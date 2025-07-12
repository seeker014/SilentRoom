import express from 'express';
import { registerUser, loginUser , getUserById } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user/:id', protect, getUserById);


export default router;