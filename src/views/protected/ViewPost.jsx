import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import avatar from "../../assets/avatar.png";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({
    title: "",
    content: "",
    author: "",
    date: "",
    authorId: "",
  });
  const [usernames, setUsernames] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5176/api/Comment/GetByPostId/post/${id}`
      );
      const data = await response.json();
      setPost((prevPost) => ({ ...prevPost, comments: data }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchUsernames = async () => {
    try {
      const response = await fetch("http://localhost:5176/api/User/getAll");

      const data = await response.json();
      setUsernames(() => {
        return data.reduce((acc, user) => {
          acc[user.id] = user.username;
          return acc;
        }, {});
      });
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchUsernames();
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:5176/api/Blog/GetById/${id}`
        );
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5176/api/Comment/Create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          blogPostId: id,
          authorId: parseInt(localStorage.getItem("id")),
        }),
      });
      const data = await response.json();
      setComments([...comments, data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
    fetchComments();
  };

  return (
    <div className="view-post">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {post.title}
          </h1>
        </div>
        <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
          <div>
            <div className="space-y-6">
              <ReactQuill
                theme="bubble"
                value={post.content}
                className="h-full"
              />
            </div>
          </div>

          <div className="mt-10">
            <div className="text-sm leading-6">
              <p className="font-semibold text-gray-900">
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  src={avatar}
                  alt=""
                ></img>{" "}
                <a href="#">{usernames[post.authorId]}</a>
              </p>
            </div>
          </div>

          <div className="mt-3">
            <time
              className="flex items-end gap-x-4 text-xs text-gray-500"
              dateTime={post.datetime}
            >
              {new Date(post.createdAt).toLocaleDateString("en-GB")}
            </time>
            <div className="mt-4 space-y-6"></div>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-medium text-gray-900">Yorumlar</h2>
          <ul className="mt-4 space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <li key={comment.id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={avatar}
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-gray-900">
                        {usernames[comment.authorId]}
                      </a>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      <time dateTime={comment.datetime}>
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </time>
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      <p>{comment.content}</p>
                    </div>{" "}
                    <div className="border-t border-gray-200 mt-2"></div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Henüz Yorum Yapılmamış...</li>
            )}
          </ul>
          <div className="mt-4">
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows="3"
                placeholder="Yorum ekle..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Gönder
              </button>{" "}
            </form>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
