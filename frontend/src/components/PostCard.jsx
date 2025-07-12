import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, MessageSquare, Send, User, Clock } from 'lucide-react';

const PostCard = ({ post, refreshPosts }) => {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate();

    const handleLike = async () => {
        try {
            setIsLiked(!isLiked);
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/posts/like/${post._id}`, {
  withCredentials: true});
            refreshPosts();
        } catch (error) {
            console.error(error);
            setIsLiked(!isLiked); // Revert on error
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/posts/comment/${post._id}`, { comment } , {
  withCredentials: true});
            setComment('');
            refreshPosts();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = () => {
        navigate(`/chat/${post.user._id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-gradient-to-b from-gray-900 via-red-900/20 to-black rounded-2xl shadow-2xl hover:shadow-red-900/20 transition-all duration-300 overflow-hidden w-full max-w-2xl mx-auto border border-red-900/20 group hover:border-red-800/40">
            
            {/* Post Header */}
            <div className="p-6 border-b border-red-900/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-red-700/30 to-red-600/30 rounded-full flex items-center justify-center border border-red-600/30">
                            <User className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-100">
                                {post.user?.nickname || 'Anonymous User'}
                            </h3>
                            <div className="flex items-center space-x-1 text-sm text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            {post.imageUrl && (
                <div className="relative overflow-hidden">
                    <img
                        src={post.imageUrl}
                        alt="Post content"
                        className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            )}

            {/* Content Section */}
            <div className="p-6">
                {/* Post Content */}
                <div className="mb-6">
                    <p className="text-gray-200 text-base leading-relaxed break-words">
                        {post.content}
                    </p>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between mb-6 py-3 border-y border-red-900/20">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                            isLiked 
                                ? 'bg-red-600/20 text-red-400 border border-red-600/30' 
                                : 'hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 text-gray-300 hover:text-red-400 border border-transparent hover:border-red-900/20'
                        }`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="font-medium">{post.likes.length}</span>
                        <span className="hidden sm:inline">Likes</span>
                    </button>
                    
                    <div className="flex items-center space-x-2 text-gray-400">
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">{post.comments.length}</span>
                        <span className="hidden sm:inline">Comments</span>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-red-400" />
                        Recent Comments
                    </h4>
                    
                    <div className="space-y-3 max-h-32 overflow-y-auto custom-scrollbar">
                        {post.comments.length > 0 ? (
                            post.comments.slice(-3).map((c, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gradient-to-r from-red-950/20 to-gray-900/20 rounded-lg p-3 border border-red-900/10"
                                >
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {c.comment}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic text-center py-2">
                                No comments yet. Be the first to share your thoughts!
                            </p>
                        )}
                    </div>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleComment} className="mb-6">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-900/50 to-red-900/20 border border-red-900/30 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all duration-200"
                        />
                        <button
                            type="submit"
                            disabled={loading || !comment.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:from-gray-700 disabled:to-gray-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center space-x-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            <span className="hidden sm:inline">
                                {loading ? 'Posting...' : 'Post'}
                            </span>
                        </button>
                    </div>
                </form>

                {/* Message Button */}
                <button
                    onClick={handleMessage}
                    className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-800/30 to-gray-900/30 hover:from-red-700/40 hover:to-gray-800/40 text-gray-200 hover:text-red-400 py-4 rounded-lg border border-red-900/20 hover:border-red-800/40 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl group"
                >
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Send Private Message</span>
                </button>
            </div>

            {/* Bottom Accent */}
            <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700 opacity-60"></div>
        </div>
    );
};

export default PostCard;