import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { toast } from "react-toastify";
import { FileText, RefreshCw, Plus, Loader2, PenTool } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyPosts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyPosts = async (isRefresh = false) => {
  try {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/posts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    // Filter posts belonging to the logged-in user
    const myPosts = data.filter((post) => post.user._id === user._id);
    setPosts(myPosts);
  } catch (error) {
    console.error("❌ Failed to fetch posts:", error);
    toast.error("Failed to fetch your posts.");
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  useEffect(() => {
    if (user?._id) {
      fetchMyPosts();
    }
  }, [user]);

  const handleRefresh = () => {
    fetchMyPosts(true);
  };

  const handleCreatePost = () => {
    navigate("/create");
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-black">
        <div className="w-full px-6 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-900/30 border-t-red-400 rounded-full animate-spin"></div>
              <Loader2 className="absolute inset-0 w-8 h-8 m-auto text-red-400 animate-pulse" />
            </div>
            <p className="mt-6 text-lg text-gray-300 font-medium">Loading your posts...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching your content</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-red-900/20 to-black">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-red-700/20 to-red-600/20 rounded-xl border border-red-600/30">
              <FileText className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-100">My Posts</h1>
              <p className="text-gray-400 mt-1">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} created
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 rounded-lg hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 transition-all duration-200 border border-transparent hover:border-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed group"
              title="Refresh posts"
            >
              <RefreshCw className={`w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors duration-200 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            </button>

            {/* Create Post Button
            <button
              onClick={handleCreatePost}
              className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Post</span>
            </button> */}
          </div>
        </div>

        {/* Posts Content */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-900/20 to-gray-900/20 rounded-full flex items-center justify-center border border-red-900/30">
                <PenTool className="w-12 h-12 text-red-400/60" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-400/20 rounded-full animate-pulse"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-200 mb-3">No Posts Yet</h3>
            <p className="text-gray-400 text-center max-w-md leading-relaxed mb-6">
              You haven't created any posts yet. Share your thoughts and start engaging with the community!
            </p>
            
            <button
              onClick={handleCreatePost}
              className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
            >
              <Plus className="w-6 h-6" />
              <span>Create Your First Post</span>
            </button>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className="transform transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <PostCard post={post} refreshPosts={fetchMyPosts} />
                </div>
              ))}
            </div>

            {/* Bottom Spacer */}
            <div className="flex justify-center mt-16 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent w-full max-w-xs"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPosts;