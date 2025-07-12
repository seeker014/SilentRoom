import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, Heart, MessageCircle, User, Clock, RefreshCw, BellRing, Loader2 } from "lucide-react";

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${user._id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
      setNotifications(data);
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);

  const handleRefresh = () => {
    fetchNotifications(true);
  };

  const formatTimeAgo = (timestamp) => {
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getNotificationIcon = (likeCount, commentCount) => {
    if (likeCount > commentCount) {
      return <Heart className="w-5 h-5 text-red-400 fill-current" />;
    }
    return <MessageCircle className="w-5 h-5 text-red-400" />;
  };

  const getNotificationText = (likeCount, commentCount) => {
    if (likeCount === 0 && commentCount === 0) {
      return "Your post is live!";
    }
    
    const parts = [];
    if (likeCount > 0) {
      parts.push(`${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`);
    }
    if (commentCount > 0) {
      parts.push(`${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`);
    }
    
    return `Your post received ${parts.join(' and ')}.`;
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-900/30 border-t-red-400 rounded-full animate-spin"></div>
              <Loader2 className="absolute inset-0 w-8 h-8 m-auto text-red-400 animate-pulse" />
            </div>
            <p className="mt-6 text-lg text-gray-300 font-medium">Loading notifications...</p>
            <p className="text-sm text-gray-500 mt-2">Fetching your latest updates</p>
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
              <Bell className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-100">Notifications</h1>
              <p className="text-gray-400 mt-1">
                {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 rounded-lg hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 transition-all duration-200 border border-transparent hover:border-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Refresh notifications"
          >
            <RefreshCw className={`w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors duration-200 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          </button>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-900/20 to-gray-900/20 rounded-full flex items-center justify-center border border-red-900/30">
                <BellRing className="w-12 h-12 text-red-400/60" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-400/20 rounded-full animate-pulse"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-200 mb-3">No Notifications Yet</h3>
            <p className="text-gray-400 text-center max-w-md leading-relaxed mb-6">
              Start engaging with the community! Like posts, leave comments, and you'll see notifications here.
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {notifications.map((notif, index) => (
              <div
                key={notif.postId}
                className="group cursor-pointer bg-gradient-to-b from-gray-900 via-red-900/20 to-black rounded-xl border border-red-900/20 hover:border-red-800/40 shadow-lg hover:shadow-red-900/20 transition-all duration-300 overflow-hidden transform hover:scale-[1.02]"
                onClick={() => navigate(`/posts/${notif.postId}`)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="p-6">
                  {/* Notification Header */}
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-700/30 to-red-600/30 rounded-full flex items-center justify-center border border-red-600/30">
                        {getNotificationIcon(notif.likeCount, notif.commentCount)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Post Title */}
                      <h3 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-200">
                        {notif.postTitle}
                      </h3>

                      {/* Notification Text */}
                      <p className="text-gray-300 mb-3 leading-relaxed">
                        {getNotificationText(notif.likeCount, notif.commentCount)}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center space-x-6 mb-3">
                        {notif.likeCount > 0 && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Heart className="w-4 h-4 text-red-400 fill-current" />
                            <span className="text-gray-400 font-medium">{notif.likeCount}</span>
                          </div>
                        )}
                        {notif.commentCount > 0 && (
                          <div className="flex items-center space-x-2 text-sm">
                            <MessageCircle className="w-4 h-4 text-red-400" />
                            <span className="text-gray-400 font-medium">{notif.commentCount}</span>
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(notif.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-700/20 to-red-600/20 rounded-full flex items-center justify-center border border-red-600/30">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Indicator (if needed in future) */}
        {notifications.length > 0 && (
          <div className="flex justify-center mt-16 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent w-full max-w-xs"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;