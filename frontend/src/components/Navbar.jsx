import { Drama, Bell, SunMoon, Plus, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar(props) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (props.hideNavbar) return null;

  const [theme, setTheme] = useState("light");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let dropdownTimeout;

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => setDropdownOpen(false), 200);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-900 via-red-900/20 to-black shadow-xl border-b border-red-900/20">
      {/* Left - Logo */}
      <div className="flex items-center space-x-3">
        <Drama className="w-8 h-8 text-red-400" />
        <h1 className="text-xl font-semibold text-gray-100">
          Silent Room
        </h1>
      </div>

      {/* Right - Controls with proper spacing */}
      <div className="flex items-center space-x-6 mr-4">
        {/* Dark/Light Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          title="Toggle Theme"
          className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 transition-all duration-200 border border-transparent hover:border-red-900/20"
        >
          <SunMoon className="w-6 h-6 text-gray-300 hover:text-red-400 transition-colors duration-200" />
        </button>

        {/* Notifications */}
        <button
          title="Notifications"
          onClick={() => navigate("/notifications")}
          className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 transition-all duration-200 border border-transparent hover:border-red-900/20"
        >
          <Bell className="w-6 h-6 text-gray-300 hover:text-red-400 transition-colors duration-200" />
        </button>

        {/* Post Creation Button */}
        <button
          onClick={() => navigate("/create")}
          title="Create Post"
          className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-red-600/20"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Post</span>
        </button>

        {/* User Dropdown */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button 
            title="User Menu"
            className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 transition-all duration-200 border border-transparent hover:border-red-900/20"
          >
            <User className="w-6 h-6 text-gray-300 hover:text-red-400 transition-colors duration-200" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-gradient-to-b from-gray-900 to-black rounded-lg shadow-2xl z-50 border border-red-900/20 overflow-hidden">
              <button
                onClick={() => navigate("/myposts")}
                className="block w-full text-left px-4 py-3 text-gray-200 hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 hover:text-red-400 transition-all duration-200 border-b border-red-900/10"
              >
                My Posts
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-3 text-gray-200 hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 hover:text-red-400 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;