import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageCircle, User, Clock, RefreshCw, Send, Loader2, MessageSquare } from "lucide-react";

const Messages = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchConversations = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            
            const { data } = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/chats/conversations/${user._id}`,
                { withCredentials: true }
            );
            setConversations(data);
        } catch (error) {
            console.error("❌ Failed to fetch conversations:", error.response?.data || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchConversations();
        }
    }, [user]);

    const handleRefresh = () => {
        fetchConversations(true);
    };

    const formatTime = (iso) => {
        const date = new Date(iso);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-black">
                <div className="w-full px-6 py-8">
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-red-900/30 border-t-red-400 rounded-full animate-spin"></div>
                            <Loader2 className="absolute inset-0 w-8 h-8 m-auto text-red-400 animate-pulse" />
                        </div>
                        <p className="mt-6 text-lg text-gray-300 font-medium">Loading conversations...</p>
                        <p className="text-sm text-gray-500 mt-2">Fetching your messages</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-red-900/20 to-black">
            <div className="w-full max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-red-700/20 to-red-600/20 rounded-xl border border-red-600/30">
                            <MessageCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-100">Messages</h1>
                            <p className="text-gray-400 mt-1">
                                {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-3 rounded-lg hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 transition-all duration-200 border border-transparent hover:border-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                        title="Refresh conversations"
                    >
                        <RefreshCw className={`w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors duration-200 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                    </button>
                </div>

                {/* Conversations List */}
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-red-900/20 to-gray-900/20 rounded-full flex items-center justify-center border border-red-900/30">
                                <MessageSquare className="w-12 h-12 text-red-400/60" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-400/20 rounded-full animate-pulse"></div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-200 mb-3">No Conversations Yet</h3>
                        <p className="text-gray-400 text-center max-w-md leading-relaxed mb-6">
                            Start connecting with the community! Send messages to other users and your conversations will appear here.
                        </p>
                        
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>{refreshing ? 'Refreshing...' : 'Check Again'}</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {conversations.map((conv, index) => (
                            <div
                                key={conv.chatId}
                                onClick={() => navigate(`/chat/${conv.partnerId}`)}
                                className="group cursor-pointer bg-gradient-to-r from-gray-900/60 to-black rounded-xl border border-red-900/20 hover:border-red-800/40 shadow hover:shadow-red-900/20 transition-all duration-200 overflow-hidden p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-red-700/30 to-red-600/30 rounded-full flex items-center justify-center border border-red-600/30 flex-shrink-0">
                                        <User className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-100 group-hover:text-red-400 transition-colors duration-200 truncate">
                                            {conv.partnerNickname}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatTime(conv.updatedAt)}</span>
                                        </div>
                                        <p className="text-gray-300 text-sm mt-1 truncate">
                                            {conv.lastMessage || "No messages yet"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-red-400 group-hover:text-red-300 transition-colors duration-200">
                                    <Send className="w-5 h-5" />
                                    <span className="hidden sm:inline font-medium">Continue Chat</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
