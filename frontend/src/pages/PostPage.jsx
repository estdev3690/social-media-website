import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function PostPage() {
  const { user, backendUrl } = useContext(AuthContext);
  const { Allposts, likePost, postsComments } = useContext(PostContext);
  const [commentText, setCommentText] = useState({});
  const [followingStatus, setFollowingStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const navigate = useNavigate();

  // Fetch initial following status for all users in posts
  useEffect(() => {
    const fetchFollowingStatus = async () => {
      if (!Allposts || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const uniqueUsers = [...new Set(Allposts.map(post => post.user._id))];
        const newFollowingStatus = {};

        await Promise.all(uniqueUsers.map(async (userId) => {
          try {
            const { data } = await axios.get(`${backendUrl}/api/user/profile/${userId}`, {
              headers: {
                Authorization: `Bearer ${document.cookie.split('=')[1]}`
              }
            });
            if (data.success) {
              newFollowingStatus[userId] = data.user.followers.some(
                follower => follower._id === user._id
              );
            }
          } catch (error) {
            console.error(`Error checking following status for user ${userId}:`, error);
          }
        }));

        setFollowingStatus(newFollowingStatus);
      } catch (error) {
        console.error('Error fetching following status:', error);
        toast.error('Failed to load following status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowingStatus();
  }, [Allposts, user, backendUrl]);

  const handleChange = (postId, value) => {
    setCommentText((prev) => ({ ...prev, [postId]: value }));
  };

  const handleSubmit = (e, postId) => {
    e.preventDefault();
    const text = commentText[postId]?.trim();
    if (text) {
      postsComments(postId, text);
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const handleFollow = async (userId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${document.cookie.split('=')[1]}`
          }
        }
      );
      if (data.success) {
        setFollowingStatus(prev => ({ ...prev, [userId]: true }));
        toast.success(data.message);
      }
    } catch (error) {
      if (error.response?.data?.message === "You are already following this user") {
        setFollowingStatus(prev => ({ ...prev, [userId]: true }));
      }
      toast.error(error.response?.data?.message || "Failed to follow user");
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/unfollow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${document.cookie.split('=')[1]}`
          }
        }
      );
      if (data.success) {
        setFollowingStatus(prev => ({ ...prev, [userId]: false }));
        toast.success(data.message);
      }
    } catch (error) {
      if (error.response?.data?.message === "You are not following this user") {
        setFollowingStatus(prev => ({ ...prev, [userId]: false }));
      }
      toast.error(error.response?.data?.message || "Failed to unfollow user");
    }
  };

  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 w-full md:ml-64">
        {/* Header */}
        

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <p className="mt-4 text-gray-600">Loading your feed...</p>
                </div>
              ) : Allposts && Allposts.length > 0 ? (
                <div className="space-y-6">
                  {[...Allposts].reverse().map((post) => (
                    <article key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                      {/* Post Header */}
                      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-100">
                        <div 
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={() => navigateToProfile(post.user._id)}
                        >
                          <img 
                            src={post.user.avatar} 
                            alt={post.user.username}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                          />
                          <div>
                            <h2 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                              {post.user.username}
                            </h2>
                            <p className="text-xs text-gray-500">
                              {formatTimestamp(post.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        {user._id !== post.user._id && (
                          <button
                            onClick={() => followingStatus[post.user._id] ? handleUnfollow(post.user._id) : handleFollow(post.user._id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                              followingStatus[post.user._id]
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            {followingStatus[post.user._id] ? 'Following' : 'Follow'}
                          </button>
                        )}
                      </div>

                      {/* Post Content */}
                      <div className="relative">
                        {post.image && (
                          <img
                            src={post.image}
                            alt="Post content"
                            className="w-full aspect-video object-cover"
                          />
                        )}
                        <div className="p-4 sm:p-6">
                          <p className="text-gray-800 text-base">{post.text}</p>
                        </div>
                      </div>

                      {/* Post Actions */}
                      <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center space-x-4">
                        <button
                          onClick={() => likePost(post._id)}
                          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          <span className="text-xl">👍</span>
                          <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                        </button>
                        <button
                          onClick={() => toggleComments(post._id)}
                          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          <span className="text-xl">💬</span>
                          <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      <div className={`border-t border-gray-100 transition-all duration-300 ${expandedComments[post._id] ? 'block' : 'hidden'}`}>
                        <div className="px-4 sm:px-6 py-3 space-y-3 max-h-64 overflow-y-auto">
                          {post.comments?.map((comment, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <img
                                src={comment.user?.avatar || "https://via.placeholder.com/40"}
                                alt="User"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                <p className="text-sm font-medium text-gray-900">{comment.user?.username}</p>
                                <p className="text-sm text-gray-700">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment Form */}
                        <form 
                          onSubmit={(e) => handleSubmit(e, post._id)}
                          className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar || "https://via.placeholder.com/40"}
                              alt="Your avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <input
                              type="text"
                              value={commentText[post._id] || ""}
                              onChange={(e) => handleChange(post._id, e.target.value)}
                              placeholder="Write a comment..."
                              className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                            >
                              Post
                            </button>
                          </div>
                        </form>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500">Start following people to see their posts here!</p>
                </div>
              )}
            </div>

            {/* Sidebar Content */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome Back!</h2>
                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src={user?.avatar || "https://via.placeholder.com/40"}
                    alt="Your avatar"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user?.username}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/create-post')}
                  className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-600 transition-colors"
                >
                  Create New Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
