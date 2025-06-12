import userModel from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if file was uploaded successfully
    if (!req.file || !req.file.path) {
      return res
        .status(400)
        .json({ success: false, message: "Profile image is required" });
    }

    if (password.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with Cloudinary URL
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      avatar: req.file.path // Cloudinary URL
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, name: newUser.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: "1h" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true, // ✅ Recommended: Prevents JavaScript access to cookie (XSS protection)
      secure: process.env.NODE_ENV === 'production', // ✅ True in production to enforce HTTPS
      sameSite: "Lax", // ✅ Good balance: CSRF protection while allowing top-level GET navigation
      maxAge: 3600000, // ✅ 1 hour in milliseconds
    });

    // Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      token: token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed",
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // ✅ Recommended: Prevents JavaScript access to cookie (XSS protection)
      secure: process.env.NODE_ENV === 'production', // ✅ True in production to enforce HTTPS
      sameSite: "Lax", // ✅ Good balance: CSRF protection while allowing top-level GET navigation
      maxAge: 3600000, // ✅ 1 hour in milliseconds
    });


    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const me=async(req,res)=>{
  try {
    const user=await userModel.findById(req.user).select("-password");
    if(!user){
      return res.status(400).json({success:false,message:"User not found"});
    }
    res.status(200).json({success:true,message:"User found",currentUser:user});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const followUser = async (req, res) => {
  try {
    const userToFollow = await userModel.findById(req.params.id);
    const currentUser = await userModel.findById(req.user);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself"
      });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user"
      });
    }

    // Add to following and followers
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: "User followed successfully"
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await userModel.findById(req.params.id);
    const currentUser = await userModel.findById(req.user);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (userToUnfollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself"
      });
    }

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user"
      });
    }

    // Remove from following and followers
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully"
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export { register, login, logout, me, followUser, unfollowUser, getUserProfile };