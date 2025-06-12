import axios from "axios";
import cookie from "js-cookie";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendUrl = "https://social-media-website-gmvw.onrender.com";

  const [token, setToken] = useState(!!cookie.get("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const utoken = cookie.get("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${utoken}`;
      fetchCurrentUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const utoken = cookie.get("token");
      const { data } = await axios.get(`${backendUrl}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${utoken}`,
        },
      });
      if (data.success) {
        setUser(data.currentUser);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error(error.response?.data?.message || "Failed to fetch user data");
      setToken(false);
      cookie.remove("token");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email, password, username, avatar) => {
    try {
      setLoading(true);
      console.log('Registration data:', { email, username, avatar: avatar?.name });
      
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("file", avatar);

      // Log FormData contents
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1] instanceof File ? pair[1].name : pair[1]);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log('Registration response:', data);

      if (data.success) {
        cookie.set("token", data.token, { expires: 7 });
        setToken(true);
        setUser(data.user);
        toast.success(data.message);
        navigate("/posts");
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data.success) {
        cookie.set("token", data.token, { expires: 7 });
        setToken(true);
        setUser(data.user);
        toast.success(data.message);
        navigate("/posts");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    cookie.remove("token");
    setToken(false);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
    navigate("/");
  };

  const values = {
    token,
    backendUrl,
    setToken,
    user,
    setUser,
    loading,
    handleRegister,
    handleLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
