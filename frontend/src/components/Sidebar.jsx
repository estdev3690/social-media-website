import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  const menuItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/create-post', label: 'Create Post', icon: '✏️' },
    { path: '/posts', label: 'All Posts', icon: '📱' },
  ];

  const isActive = (path) => location.pathname === path;

  if (!user) {
    return (
      <div className="w-full md:w-64 bg-white shadow-lg animate-pulse p-4">
        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-500 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed md:static top-0 left-0 h-full bg-white shadow-xl
        transform transition-transform duration-300 ease-in-out z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 w-64 min-h-screen
      `}>
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative group">
            <img
              src={user?.avatar || "https://via.placeholder.com/150"}
              alt="profile"
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-2 ring-blue-500 ring-offset-2 transition-all duration-300 group-hover:ring-4"
            />
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 text-center mb-1">{user?.username}</h1>
          <p className="text-sm text-gray-500 text-center truncate">{user?.email}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full px-4 py-3 rounded-lg flex items-center space-x-3
                transition-all duration-200 
                ${isActive(item.path)
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-blue-50'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="w-full px-4 py-3 mt-4 rounded-lg flex items-center space-x-3
              text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            © 2024 Social Media App
          </p>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
