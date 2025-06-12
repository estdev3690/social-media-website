import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { PostContext } from "../context/PostContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Profile() {
  const { user: currentUser, backendUrl } = useContext(AuthContext);
  const {
    userPosts,
    deletePost,
    fetchPostofLoggedInUser,
    updatePost,
  } = useContext(PostContext);

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile/${id || currentUser._id}`);
      if (data.success) {
        setProfileUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(error.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/follow/${profileUser._id}`);
      if (data.success) {
        toast.success(data.message);
        fetchUserProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to follow user");
    }
  };

  const handleUnfollow = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/unfollow/${profileUser._id}`);
      if (data.success) {
        toast.success(data.message);
        fetchUserProfile();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unfollow user");
    }
  };

  useEffect(() => {
    fetchUserProfile();
    if (!id || id === currentUser?._id) {
      fetchPostofLoggedInUser();
    }
  }, [id]);

  if (loading || !profileUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const isOwnProfile = !id || profileUser._id === currentUser._id;
  const isFollowing = profileUser.followers.some(follower => follower._id === currentUser._id);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      {/* User Info */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mb-8">
        <div className="text-center">
          <img
            src={profileUser.avatar || "https://via.placeholder.com/150"}
            alt="profile"
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          />
          <h1 className="text-2xl font-semibold text-gray-800">{profileUser.username}</h1>
          <p className="text-gray-500 mb-4">{profileUser.email}</p>

          {/* Followers and Following Stats */}
          <div className="flex justify-center space-x-8 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{profileUser.followers.length}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{profileUser.following.length}</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
          </div>

          {/* Follow/Unfollow Button */}
          {!isOwnProfile && (
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className={`w-full py-2 px-4 rounded-lg transition ${
                isFollowing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* User Posts */}
      {isOwnProfile && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Total Posts: {userPosts.length}
          </h2>

          <div className="space-y-4">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-md p-5 flex items-start space-x-4"
              >
                <img
                  src={post.image}
                  alt="post"
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-700">{post.text}</h3>
                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={() => deletePost(post._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => updatePost(post._id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
