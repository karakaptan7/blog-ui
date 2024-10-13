import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState(localStorage.getItem("id") || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      console.error("The newPost field is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5176/api/Blog/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, authorId: parseInt(authorId) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.errors);
        return;
      } else {
        window.location.href = "/dashboard";
      }

      console.log("Post submitted successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Başlık:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            İçerik:
          </label>
          <div
            className="mt-1 resize-y overflow-auto border border-gray-300 rounded-md"
            style={{ minHeight: "200px" }}
          >
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-full"
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Gönder
        </button>
        <button
          onClick={() => window.history.back()}
          className="inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Vazgeç
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
