import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Send, ArrowLeft, MessageCircle, Drama } from "lucide-react";
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { partnerId: chatPartnerId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const currentUserId = user?._id;

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [partnerNickname, setPartnerNickname] = useState("Loading...");

    const socket = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (!currentUserId || !chatPartnerId) return;

        const fetchPartnerNickname = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/auth/user/${chatPartnerId}`,
                    { withCredentials: true }
                );
                setPartnerNickname(data.nickname);
            } catch (error) {
                console.error("Failed to fetch partner nickname:", error);
                setPartnerNickname("Unknown User");
            }
        };

        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/chats/${chatPartnerId}`,
                    { withCredentials: true }
                );
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchPartnerNickname();
        fetchMessages();

        socket.current = io(import.meta.env.VITE_SERVER_URL, { withCredentials: true });
        const roomId = [currentUserId, chatPartnerId].sort().join("_");

        socket.current.emit("joinRoom", roomId);

        socket.current.on("receiveMessage", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [currentUserId, chatPartnerId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const roomId = [currentUserId, chatPartnerId].sort().join("_");

        const newMsg = {
            senderId: currentUserId,
            receiverId: chatPartnerId,
            message: message.trim(),
            timestamp: new Date().toISOString(),
        };

        socket.current.emit("sendMessage", { ...newMsg, roomId });

        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/chats/${chatPartnerId}`,
                { message: message.trim() },
                { withCredentials: true }
            );
        } catch (error) {
            console.error("❌ Failed to save message:", error.response?.data || error.message);
        }

        setMessages((prev) => [...prev, newMsg]);
        setMessage("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white w-full">
            <div className="flex flex-col h-screen w-full">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-red-950/50 to-gray-900/50 border-b border-red-900/20 backdrop-blur-sm w-full px-4 sm:px-8 lg:px-12">
                    <div className="py-4 w-full">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => navigate(-1)} 
                                    className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
                                >
                                    <ArrowLeft className="w-6 h-6 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
                                    
                                </button>
                                
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-semibold text-gray-100">
                                            {partnerNickname}
                                        </h1>
                                        <p className="text-sm text-gray-400">Anonymous Chat</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Drama className="w-6 h-6 text-red-400" />
                                <span className="text-lg font-bold text-gray-200">Silent Room</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden w-full">
                    <div className="h-full flex flex-col w-full px-4 sm:px-8 lg:px-12">
                        <div className="flex-1 overflow-y-auto py-6 space-y-4 w-full">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                    <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 rounded-2xl border border-red-900/20 p-8 max-w-md">
                                        <MessageCircle className="w-16 h-16 text-red-400 mx-auto mb-4 opacity-60" />
                                        <h3 className="text-xl font-semibold text-gray-200 mb-2">Start the Conversation</h3>
                                        <p className="text-gray-400">
                                            This is the beginning of your anonymous chat with <span className="text-red-400 font-medium">{partnerNickname}</span>. 
                                            Share your thoughts freely and safely.
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            {messages.map((msg, index) => {
                                const isSender = msg.senderId === currentUserId;
                                const time = new Date(msg.timestamp).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                });

                                return (
                                    <div
                                        key={index}
                                        className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4 w-full`}
                                    >
                                        <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl`}>
                                            <div
                                                className={`px-4 py-3 rounded-2xl shadow-lg break-words ${
                                                    isSender 
                                                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-br-md' 
                                                        : 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 rounded-bl-md border border-gray-600/30'
                                                }`}
                                            >
                                                <p className="text-sm leading-relaxed">{msg.message}</p>
                                            </div>
                                            <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mt-1 px-2`}>
                                                <span className="text-xs text-gray-500">
                                                    {time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="border-t border-red-900/20 bg-gradient-to-r from-red-950/30 to-gray-900/30 backdrop-blur-sm w-full">
                            <div className="py-4 w-full">
                                <form onSubmit={handleSendMessage} className="flex items-end space-x-4 w-full">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Type your message... Press Enter to send"
                                                rows={1}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage(e);
                                                    }
                                                }}
                                                style={{
                                                    minHeight: '48px',
                                                    maxHeight: '120px',
                                                    height: 'auto'
                                                }}
                                                onInput={(e) => {
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={!message.trim()}
                                        className="flex items-center justify-center w-12 h-12 bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-400 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>

                                {/* Privacy Notice */}
                                <div className="mt-3 text-center">
                                    <p className="text-xs text-gray-500">
                                        <span className="text-red-400">🔒</span> This conversation is private and anonymous
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
