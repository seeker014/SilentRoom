import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';

// ========== SEND MESSAGE ==========
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user._id;
        const partnerId = req.params.id;

        let chat = await Chat.findOne({
            participants: { $all: [userId, partnerId] },
        });

        if (!chat) {
            // Create new chat if it doesn't exist
            chat = new Chat({
                participants: [userId, partnerId],
                messages: [{ sender: userId, message }],
            });
            await chat.save();
        } else {
            // Push new message if chat exists
            chat.messages.push({ sender: userId, message });
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// ========== GET MESSAGES ==========
export const getMessages = async (req, res) => {
    try {
        const chat = await Chat.findOne({
            participants: { $all: [req.user._id, req.params.id] },
        }).populate('messages.sender', 'nickname');

        res.status(200).json(chat?.messages || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ========== GET USER CONVERSATIONS (for Messages Page) ==========
export const getUserConversations = async (req, res) => {
    try {
        const userId = req.params.userId;

        const chats = await Chat.find({ participants: userId })
            .populate('participants', 'nickname')
            .sort({ updatedAt: -1 });

        const conversations = chats.map(chat => {
            const partner = chat.participants.find(
                (participant) => participant._id.toString() !== userId
            );

            const lastMessage = chat.messages?.[chat.messages.length - 1];

            return {
                chatId: chat._id,
                partnerId: partner ? partner._id : null,
                partnerNickname: partner ? partner.nickname : "Unknown User",
                lastMessage: lastMessage ? lastMessage.message : "No messages yet",
                updatedAt: chat.updatedAt,
            };
        }).filter(conv => conv.partnerId !== null); // filter out corrupted chats

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error in getUserConversations:", error);
        res.status(500).json({ message: error.message || "Failed to fetch conversations" });
    }
};
