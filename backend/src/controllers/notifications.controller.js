import Post from "../models/post.model.js";

export const getUserNotifications = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ updatedAt: -1 })
      .select("_id title likes comments updatedAt");

    const notifications = posts.map(post => ({
      postId: post._id,
      postTitle: post.title,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      updatedAt: post.updatedAt
    }));

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
