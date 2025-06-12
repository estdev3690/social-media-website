import cookie from "js-cookie";
import axios from "axios";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { backendUrl, user } = useContext(AuthContext);

  const [Allposts, setAllposts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const utoken = cookie.get("token");

  const fetchAllPosts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/posts/get-posts`, {
        headers: {
          Authorization: `Bearer ${utoken}`
        }
      });
      
      if (data.success) {
        // Initialize following status for each unique user
        const uniqueUsers = [...new Set(data.posts.map(post => post.user._id))];
        const followingStatusObj = {};
        
        // Check following status for each user
        await Promise.all(uniqueUsers.map(async (userId) => {
          try {
            const response = await axios.get(`${backendUrl}/api/user/profile/${userId}`, {
              headers: {
                Authorization: `Bearer ${utoken}`
              }
            });
            if (response.data.success) {
              followingStatusObj[userId] = response.data.user.followers.includes(user);
            }
          } catch (error) {
            console.error(`Error checking following status for user ${userId}:`, error);
          }
        }));

        setAllposts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching all posts:', error);
      toast.error(error.response?.data?.message || "Failed to fetch posts");
    }
  };
  const fetchPostofLoggedInUser = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/posts/user-posts`, {
        headers: {
          Authorization: `Bearer ${utoken}`,
        },
      });
      if (data.success) {
        setUserPosts(data.posts);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error fetching user posts");
    }
  };

  const likePost = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/posts/${id}/like`,
        {
          headers: {
            Authorization: `Bearer ${utoken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchAllPosts();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const postsComments = async (id, text) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/posts/${id}/comment`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${utoken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchAllPosts();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const createPost = async (text, image) => {
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (image) {
        formData.append("file", image);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/posts/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${utoken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchAllPosts();
        navigate("/posts");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  };

  const deletePost = async (id) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/posts/delete-post/${id}`,
        {
          headers: {
            Authorization: `Bearer ${utoken}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchAllPosts();
        fetchPostofLoggedInUser();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    if (user && utoken) {
      try {
        await fetchAllPosts();
        await fetchPostofLoggedInUser();
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
  };

  fetchData();
}, [user, utoken]);

  const values = {
    Allposts,
    userPosts,
    fetchAllPosts,
    fetchPostofLoggedInUser,
    likePost,
    postsComments,
    createPost,
    deletePost,
    setAllposts,
    setUserPosts,
  };
  return <PostContext.Provider value={values}>{children}</PostContext.Provider>;
};

export default PostContextProvider;
