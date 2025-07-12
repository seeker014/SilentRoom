import { Link } from 'react-router-dom';
import { Home, Bell, MessageCircle, Shield, FileText, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="h-screen w-5/5 bg-gradient-to-b from-gray-900 via-red-900/20 to-black shadow-xl flex flex-col items-center md:items-start p-2 md:p-4 sticky top-0 border-r border-red-900/20">
      
      {/* Home */}
      <Link
        to="/home"
        className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 rounded-md p-2 w-full transition-all duration-200 border border-transparent hover:border-red-900/20"
      >
        <Home className="text-red-400" />
        <span className="hidden md:inline text-gray-100">Home</span>
      </Link>

      {/* Create Post */}
      <Link
        to="/create"
        className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 rounded-md p-2 w-full mt-2 transition-all duration-200 border border-transparent hover:border-red-900/20"
      >
        <Plus className="text-red-400" />
        <span className="hidden md:inline text-gray-100">Create Post</span>
      </Link>

      {/* Notifications */}
      <Link
        to="/notifications"
        className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 rounded-md p-2 w-full mt-2 transition-all duration-200 border border-transparent hover:border-red-900/20"
      >
        <Bell className="text-red-400" />
        <span className="hidden md:inline text-gray-100">Notifications</span>
      </Link>

      {/* Messages */}
      <Link
        to="/messages"
        className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 rounded-md p-2 w-full mt-2 transition-all duration-200 border border-transparent hover:border-red-900/20"
      >
        <MessageCircle className="text-red-400" />
        <span className="hidden md:inline text-gray-100">Messages</span>
      </Link>

      {/* My Posts */}
      <Link
        to="/myposts"
        className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 rounded-md p-2 w-full mt-2 transition-all duration-200 border border-transparent hover:border-red-900/20"
      >
        <FileText className="text-red-400" />
        <span className="hidden md:inline text-gray-100">My Posts</span>
      </Link>

      {/* Admin Dashboard */}
      {user?.role === "admin" && (
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 rounded-md p-2 w-full mt-2 transition-all duration-200 border border-transparent hover:border-red-900/20"
        >
          <Shield className="text-red-400" />
          <span className="hidden md:inline text-gray-100">Admin Dashboard</span>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
