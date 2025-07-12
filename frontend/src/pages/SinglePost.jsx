import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Heart, MessageCircle, Share2, Clock, User, Drama, AlertCircle } from 'lucide-react';

const SinglePost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchPost = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem("token");

            const { data } = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/posts/${postId}`, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            setPost(data);
        } catch (error) {
            console.error('Failed to fetch post:', error);
            setError('Failed to load post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (postId) {
        fetchPost();
    }
}, [postId]);


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatRelativeTime = (dateString) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return formatDate(dateString);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Loading post...</p>
                    <p className="text-gray-500 mt-2">Please wait while we fetch the content</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white flex items-center justify-center">
                <div className="max-w-md text-center">
                    <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 rounded-2xl border border-red-900/20 p-8">
                        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4 opacity-60" />
                        <h2 className="text-2xl font-bold text-gray-200 mb-4">Post Not Found</h2>
                        <p className="text-gray-400 mb-6">
                            {error || "The post you're looking for doesn't exist or has been removed."}
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-red-700 hover:bg-red-600 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white">
            <div className="w-full px-4 sm:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Back to Feed</span>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                        <Drama className="w-8 h-8 text-red-400" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-100">Post Details</h1>
                            <p className="text-gray-400">View and interact with this post</p>
                        </div>
                    </div>
                </div>

                {/* Main Post Content */}
                <div className="w-full">
                    <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 rounded-2xl border border-red-900/20 overflow-hidden">
                        {/* Post Header */}
                        <div className="p-6 border-b border-red-900/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-200">
                                            {post.user?.nickname || "Anonymous User"}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatRelativeTime(post.createdAt)}</span>
                                            <span>•</span>
                                            <span>{formatDate(post.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="p-6">
                            {/* Text Content */}
                            <div className="mb-6">
                                <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </p>
                            </div>

                            {/* Image Content */}
                            {post.imageUrl && (
                                <div className="mb-6">
                                    <div className="rounded-xl overflow-hidden border border-gray-700/30">
                                        <img
                                            src={post.imageUrl}
                                            alt="Post content"
                                            className="w-full h-auto max-h-[600px] object-cover"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Engagement Stats */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <Heart className="w-5 h-5" />
                                        <span className="font-medium">{post.likes?.length || 0}</span>
                                        <span className="text-sm">likes</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="font-medium">{post.comments?.length || 0}</span>
                                        <span className="text-sm">comments</span>
                                    </div>
                                </div>
                                
                                <div className="text-gray-500 text-sm">
                                    Post ID: {post._id?.slice(-8)}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 bg-gradient-to-r from-red-950/20 to-gray-900/20 border-t border-red-900/20">
                            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
                                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-700/20 hover:bg-red-700/30 border border-red-600/30 hover:border-red-600/50 rounded-lg transition-all duration-200 text-red-300 hover:text-red-200">
                                    <Heart className="w-5 h-5" />
                                    <span>Like Post</span>
                                </button>
                                
                                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800/30 hover:bg-gray-700/30 border border-gray-600/30 hover:border-gray-600/50 rounded-lg transition-all duration-200 text-gray-300 hover:text-gray-200">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Add Comment</span>
                                </button>
                                
                                <button className="px-4 py-3 bg-gray-800/30 hover:bg-gray-700/30 border border-gray-600/30 hover:border-gray-600/50 rounded-lg transition-all duration-200 text-gray-300 hover:text-gray-200">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section Placeholder */}
                    <div className="mt-8 bg-gradient-to-b from-red-950/20 to-gray-900/20 rounded-2xl border border-red-900/10 p-6 w-full">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                            <MessageCircle className="w-5 h-5 mr-2 text-red-400" />
                            Comments ({post.comments?.length || 0})
                        </h3>
                        
                        {post.comments?.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
                                <p className="text-gray-400">No comments yet.</p>
                                <p className="text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Comments would be rendered here */}
                                <p className="text-gray-400 text-center py-4">
                                    Comments functionality coming soon...
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Privacy Notice */}
                    <div className="mt-6 text-center w-full">
                        <p className="text-gray-500 text-sm">
                            <span className="text-red-400">🔒</span> This post is shared anonymously in Silent Room
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePost;
