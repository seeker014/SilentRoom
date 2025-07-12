import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from './PostCard';
import { RefreshCw, MessageCircle, Loader2 } from 'lucide-react';

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPosts = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            
            const { data } = await axios.get('/api/posts');
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchPosts(true);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-red-900/30 border-t-red-400 rounded-full animate-spin"></div>
                    <Loader2 className="absolute inset-0 w-8 h-8 m-auto text-red-400 animate-pulse" />
                </div>
                <p className="mt-6 text-lg text-gray-300 font-medium">Loading posts...</p>
                <p className="text-sm text-gray-500 mt-2">Fetching the latest content for you</p>
            </div>
        );
    }

    // Empty State
    if (!posts.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-900/20 to-gray-900/20 rounded-full flex items-center justify-center border border-red-900/30">
                        <MessageCircle className="w-12 h-12 text-red-400/60" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-400/20 rounded-full animate-pulse"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-200 mb-3">No Posts Yet</h3>
                <p className="text-gray-400 text-center max-w-md leading-relaxed mb-6">
                    Be the first to share your thoughts and start meaningful conversations in our community.
                </p>
                
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
                </button>
            </div>
        );
    }

    // Posts Feed
    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Feed Header */}
            <div className="flex items-center justify-between mb-8 px-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-1">Community Feed</h2>
                    <p className="text-gray-400 text-sm">
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'} • Latest updates
                    </p>
                </div>
                
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="p-3 rounded-lg hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 transition-all duration-200 border border-transparent hover:border-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                    title="Refresh posts"
                >
                    <RefreshCw className={`w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-200 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                </button>
            </div>

            {/* Posts Container */}
            <div className="space-y-6 px-4">
                {posts.map((post, index) => (
                    <div
                        key={post._id}
                        className="transform transition-all duration-300 hover:scale-[1.01]"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                    >
                        <PostCard post={post} refreshPosts={fetchPosts} />
                    </div>
                ))}
            </div>

            {/* Load More Indicator (if needed in future) */}
            <div className="flex justify-center mt-12 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent w-full max-w-xs"></div>
            </div>
        </div>
    );
};

export default PostFeed;