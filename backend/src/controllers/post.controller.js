import Post from '../models/post.model.js';

export const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        let imageUrl = null;
        if (req.file && req.file.path) {
            imageUrl = req.file.path; // Cloudinary returns secure URL here
        }

        const post = await Post.create({
            user: req.user._id,
            content,
            imageUrl,
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'nickname')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.user._id)) {
            post.likes.push(req.user._id);
        } else {
            post.likes = post.likes.filter(
                (userId) => userId.toString() !== req.user._id.toString()
            );
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const commentOnPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.comments.push({
            user: req.user._id,
            comment: req.body.comment,
        });
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Get all posts
export const getAllPostsAdmin = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'nickname email')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Delete post
export const deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted by admin' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "nickname")
            .populate("comments.user", "nickname");
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

