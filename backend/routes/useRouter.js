import express from "express";
import { register, login, logout, me, followUser, unfollowUser, getUserProfile, getAllUsers } from "../controllers/userController.js";
import handleUpload from "../middlewares/multer.js";
import protect from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.post("/register", handleUpload, register);
userRouter.post("/login",login);
userRouter.post("/logout",logout);
userRouter.get("/me",protect,me);
userRouter.post("/follow/:id", protect, followUser);
userRouter.post("/unfollow/:id", protect, unfollowUser);
userRouter.get("/profile/:id", protect, getUserProfile);
userRouter.get("/all", protect, getAllUsers);
export default userRouter;