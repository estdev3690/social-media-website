import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaPlus, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const { handleLogout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCreatePost = () => {
    navigate("/create-post");
    setMenuOpen(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative z-10">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate("/home")}>
          🚀 MyBlog
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <button
          onClick={handleCreatePost}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          <FaPlus />
          <span>Create Post</span>
        </button>
        <button
          onClick={handleLogoutClick}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-xl text-gray-700 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white w-52 shadow-lg rounded-lg py-2 px-4 flex flex-col space-y-3 md:hidden">
          <button
            onClick={handleCreatePost}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <FaPlus />
            <span>Create Post</span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center space-x-2 text-red-500 hover:text-red-700"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
