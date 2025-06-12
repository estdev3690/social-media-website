import express from "express";
import {
  createPost,
  getPosts,
  getPostsByUser,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
} from "../controllers/postController.js";
import protect from "../middlewares/auth.js";
import handleUpload from "../middlewares/multer.js";

const postRouter = express.Router();

// Create post route - needs both auth and file upload middleware
postRouter.post("/create", protect, handleUpload, createPost);

// Other routes
postRouter.get("/get-posts", getPosts);
postRouter.get("/user-posts", protect, getPostsByUser);
postRouter.put("/update-post/:id", protect, updatePost);
postRouter.delete("/delete-post/:id", protect, deletePost);
postRouter.post("/:id/like", protect, toggleLike);
postRouter.post("/:id/comment", protect, addComment);

export default postRouter;
