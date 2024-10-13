import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import "./index.css";

import Login from "./views/public/Login";
import Register from "./views/public/Register";
import Dashboard from "./views/protected/Dashboard";
import CreatePost from "./views/protected/CreatePost";
import ViewPost from "./views/protected/ViewPost";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/view-post/:id" element={<ViewPost />} />
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);
