import React from "react";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import PostsPage from "./pages/PostPage";
import AddPost from "./components/AddPost";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Profile from "./components/Profile";

export default function App() {
  const { token } = useContext(AuthContext);
  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />

      {token ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/" element={<Navigate to="/posts" />} />
            <Route path="/create-post" element={<AddPost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/home" element={<PostsPage />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      )}
    </div>
  );
}
