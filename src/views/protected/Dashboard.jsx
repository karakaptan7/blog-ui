import React, { useState, useEffect } from "react";
import axios from "axios";
import blogpost from "../../assets/blogpost.svg";
import avatar from "../../assets/avatar.png";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5176/api/Blog/GetAll"
        );
        setPosts(response.data);
      } catch (err) {
        setError("Error fetching posts");
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchUsernames = async () => {
      const uniqueAuthorIds = [...new Set(posts.map((post) => post.authorId))];
      const usernamePromises = uniqueAuthorIds.map(async (id) => {
        const response = await axios.get(
          `http://localhost:5176/api/User/GetById/${id}`
        );
        return { id, username: response.data.username };
      });

      try {
        const usernamesArray = await Promise.all(usernamePromises);
        const usernamesMap = usernamesArray.reduce((acc, { id, username }) => {
          acc[id] = username;
          return acc;
        }, {});
        setUsernames(usernamesMap);
      } catch (err) {
        setError("Error fetching usernames");
      }
    };

    if (posts.length > 0) {
      fetchUsernames();
    }
  }, [posts]);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0"></div>
        <div className="mt-2 flex  justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            BLOG
          </h2>{" "}
          <button
            onClick={() => navigate("/create-post")}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Yeni Gönderi
          </button>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t  border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex max-w-xl flex-col items-start justify-between shadow-lg rounded-lg overflow-hidden p-4 "
              onClick={() => navigate(`/view-post/${post.id}`)}
            >
              <img
                src={blogpost}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg hover:opacity-75 transition-opacity"
              />

              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <a href={post.href}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </a>{" "}
                  <time
                    className="flex items-end gap-x-4 text-xs text-gray-500"
                    dateTime={post.datetime}
                  >
                    {new Date(post.createdAt).toLocaleDateString("en-GB")}
                  </time>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                  <ReactQuill
                    theme="bubble"
                    value={post.content}
                    className="max-h-24"
                  />{" "}
                </p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4">
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">
                    <img
                      class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                      src={avatar}
                      alt=""
                    ></img>{" "}
                    <a href="#">
                      <span className="absolute inset-0"></span>
                      {usernames[post.authorId]}
                    </a>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
