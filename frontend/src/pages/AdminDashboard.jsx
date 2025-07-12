import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, Home, BarChart3, FileText, Drama, Users, Heart, MessageCircle, Calendar, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/posts/admin/posts`,
                    { withCredentials: true }
                );
                setPosts(data);
            } catch (error) {
                console.error("❌ Failed to fetch posts:", error);
                toast.error("Failed to fetch posts.");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDeletePost = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/api/posts/admin/posts/${postId}`,
                { withCredentials: true }
            );
            setPosts((prev) => prev.filter((post) => post._id !== postId));
            toast.success("Post deleted successfully.");
        } catch (error) {
            console.error("❌ Failed to delete post:", error);
            toast.error("Failed to delete post.");
        }
    };

    const sidebarItems = [
        { id: 'home', label: 'Home', icon: Home, action: () => navigate('/home') },
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, action: () => setActiveTab('dashboard') },
        { id: 'posts', label: 'Manage Posts', icon: FileText, action: () => setActiveTab('posts') }
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderDashboard = () => (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 p-6 rounded-xl border border-red-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Posts</p>
                            <p className="text-3xl font-bold text-white">{posts.length}</p>
                        </div>
                        <FileText className="w-8 h-8 text-red-400" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 p-6 rounded-xl border border-red-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Likes</p>
                            <p className="text-3xl font-bold text-white">
                                {posts.reduce((sum, post) => sum + post.likes.length, 0)}
                            </p>
                        </div>
                        <Heart className="w-8 h-8 text-red-400" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 p-6 rounded-xl border border-red-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Comments</p>
                            <p className="text-3xl font-bold text-white">
                                {posts.reduce((sum, post) => sum + post.comments.length, 0)}
                            </p>
                        </div>
                        <MessageCircle className="w-8 h-8 text-red-400" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 p-6 rounded-xl border border-red-900/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Active Users</p>
                            <p className="text-3xl font-bold text-white">
                                {new Set(posts.map(post => post.user?._id)).size}
                            </p>
                        </div>
                        <Users className="w-8 h-8 text-red-400" />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 rounded-xl border border-red-900/20 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-red-400" />
                    Recent Activity
                </h3>
                <div className="space-y-3">
                    {posts.slice(0, 5).map((post) => (
                        <div key={post._id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                <div>
                                    <p className="text-gray-200 text-sm">
                                        <span className="font-medium">{post.user?.nickname || "Unknown"}</span> created a new post
                                    </p>
                                    <p className="text-gray-400 text-xs">{formatDate(post.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400 text-xs">
                                <span className="flex items-center">
                                    <Heart className="w-3 h-3 mr-1" />
                                    {post.likes.length}
                                </span>
                                <span className="flex items-center">
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    {post.comments.length}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPosts = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Manage Posts</h2>
                <div className="text-gray-400">
                    Total: <span className="text-red-400 font-semibold">{posts.length}</span> posts
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No posts available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-gradient-to-b from-red-950/30 to-gray-900/30 rounded-xl border border-red-900/20 p-6 relative group hover:border-red-800/40 transition-all duration-300"
                        >
                            {post.imageUrl && (
                                <div className="mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src={post.imageUrl}
                                        alt="Post"
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            
                            <div className="space-y-3">
                                <p className="text-gray-200 leading-relaxed line-clamp-3">
                                    {post.content}
                                </p>
                                
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-medium">
                                                {post.user?.nickname?.charAt(0)?.toUpperCase() || "?"}
                                            </span>
                                        </div>
                                        <span className="text-gray-300 font-medium">
                                            {post.user?.nickname || "Unknown"}
                                        </span>
                                    </div>
                                    <span className="text-gray-500 text-xs">
                                        {formatDate(post.createdAt)}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
                                    <div className="flex items-center space-x-4 text-gray-400">
                                        <span className="flex items-center space-x-1">
                                            <Heart className="w-4 h-4" />
                                            <span>{post.likes.length}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{post.comments.length}</span>
                                        </span>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleDeletePost(post._id)}
                                        className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-200 transform hover:scale-105"
                                        title="Delete Post"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white">
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="w-64 bg-gradient-to-b from-red-950/50 to-gray-900/50 border-r border-red-900/20 backdrop-blur-sm">
                    <div className="p-6">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 mb-8">
                            <Drama className="h-8 w-8 text-red-400" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-100">Silent Room</h2>
                                <p className="text-sm text-gray-400">Admin Panel</p>
                            </div>
                        </div>

                        {/* Admin Info */}
                        <div className="bg-gradient-to-r from-red-950/30 to-gray-900/30 rounded-lg p-4 mb-6 border border-red-900/20">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-200 font-medium">{user?.nickname}</p>
                                    <p className="text-gray-400 text-sm">Administrator</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-2">
                            {sidebarItems.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = activeTab === item.id;
                                
                                return (
                                    <button
                                        key={item.id}
                                        onClick={item.action}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                                            isActive 
                                                ? 'bg-red-600 text-white shadow-lg' 
                                                : 'text-gray-300 hover:text-white hover:bg-red-950/30'
                                        }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-950/30 to-gray-900/30 border-b border-red-900/20 backdrop-blur-sm">
                            <div className="px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-100">
                                            {activeTab === 'dashboard' ? 'Dashboard Overview' : 'Manage Posts'}
                                        </h1>
                                        <p className="text-gray-400 mt-1">
                                            {activeTab === 'dashboard' 
                                                ? 'Monitor your Silent Room community' 
                                                : 'Review and manage community posts'
                                            }
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400 text-sm">Welcome back,</p>
                                        <p className="text-red-400 font-semibold">{user?.nickname}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {activeTab === 'dashboard' ? renderDashboard() : renderPosts()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;