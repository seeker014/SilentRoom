import express from 'express';
import { sendMessage, getMessages , getUserConversations } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/:id', protect, sendMessage);
router.get('/:id', protect, getMessages);
router.get('/conversations/:userId', getUserConversations);

export default router;