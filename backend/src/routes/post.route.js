import express from 'express';
import {
  createPost,
  getAllPosts,
  likePost,
  commentOnPost,
  getAllPostsAdmin,
  deletePost,
  getPostById,
} from '../controllers/post.controller.js';

import { protect } from '../middleware/auth.middleware.js';
import { adminProtect } from '../middleware/admin.middleware.js';
import { upload } from '../lib/cloudinary.js';

const router = express.Router();

/** PUBLIC/USER ROUTES **/

// Create post with image upload
router.post('/', protect, upload.single('image'), createPost);

// Get all posts for feed
router.get('/', protect, getAllPosts);

// Get a single post by ID
router.get('/:id', protect, getPostById);

// Like/unlike a post
router.put('/like/:id', protect, likePost);

// Comment on a post
router.post('/comment/:id', protect, commentOnPost);

/** ADMIN ROUTES **/

// Get all posts for admin dashboard
router.get('/admin/posts', protect, adminProtect, getAllPostsAdmin);

// Delete a specific post by ID (admin)
router.delete('/admin/posts/:id', protect, adminProtect, deletePost);

export default router;
