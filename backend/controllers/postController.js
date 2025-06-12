import postModel from "../models/postSchema.js";

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    
    // Validate text
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Post text is required"
      });
    }

    // Check if file was uploaded
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Image is required for the post"
      });
    }

    // Create post with user ID from auth middleware
    const post = await postModel.create({
      user: req.user,
      text: text.trim(),
      image: req.file.path,
    });

    // Populate user details in the response
    const populatedPost = await post.populate('user', 'username avatar');

    res.status(201).json({ 
      success: true, 
      message: "Post created successfully", 
      post: populatedPost 
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create post",
      error: error.message 
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, message: "Posts fetched successfully", posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const posts = await postModel.find({ user: userId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      message: posts.length ? "Posts retrieved successfully" : "No posts found", 
      posts 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }
    if (post.user.toString() !== req.user) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { text: text || post.text, image: req.file?.path || post.image },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "Post not found" });
    }
    if (post.user.toString() !== req.user) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    await postModel.findByIdAndDelete(postId);
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user;

    // Validate postId
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required"
      });
    }

    // Find post and populate user details
    const post = await postModel.findById(postId).populate('user', 'username avatar');
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found"
      });
    }

    // Check if user has already liked the post
    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // User hasn't liked the post - add like
      post.likes.push(userId);
      await post.save();
      
      return res.status(200).json({
        success: true,
        message: "Post liked successfully",
        liked: true,
        likesCount: post.likes.length,
        post: {
          _id: post._id,
          text: post.text,
          image: post.image,
          likes: post.likes,
          user: post.user
        }
      });
    } else {
      // User has already liked - remove like
      post.likes.splice(likeIndex, 1);
      await post.save();
      
      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        liked: false,
        likesCount: post.likes.length,
        post: {
          _id: post._id,
          text: post.text,
          image: post.image,
          likes: post.likes,
          user: post.user
        }
      });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle like",
      error: error.message
    });
  }
};

const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user;
    const { text } = req.body;

    // Validate comment text
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required"
      });
    }

    // Find and update the post with the new comment
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    // Add the comment to the post
    post.comments.push({
      user: userId,
      text: text.trim()
    });

    // Save the updated post
    await post.save();

    // Get the newly added comment
    const newComment = post.comments[post.comments.length - 1];

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export {
  createPost,
  getPosts,
  getPostsByUser,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
};
