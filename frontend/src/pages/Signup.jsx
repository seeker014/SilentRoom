import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Drama, User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`, {
        nickname,
        password,
      }, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white">
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
          <Drama className="h-8 w-8 text-red-400" />
          <span className="text-2xl font-bold text-gray-100">Silent Room</span>
        </Link>
        <Link 
          to="/login" 
          className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium"
        >
          Already have an account?
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-100px)] px-6">
        {/* Left Side - Form */}
        <div className="w-full max-w-md lg:max-w-lg lg:mr-12 mb-8 lg:mb-0">
          <div className="bg-gradient-to-b from-red-950/40 to-gray-900/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-red-900/30">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Drama className="h-16 w-16 text-red-400 opacity-80" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-100 mb-2">
                Join Silent Room
              </h2>
              <p className="text-gray-400 text-lg">
                Create your anonymous identity
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Nickname Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Choose your nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-700 hover:bg-red-600 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-red-400 hover:text-red-300 font-semibold transition-colors duration-200 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image and Info */}
        <div className="w-full max-w-md lg:max-w-lg">
          <div className="relative">
            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
                alt="Anonymous Connection"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                Connect Anonymously
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                Join a community where you can be yourself without judgment. Share your story and connect with others who understand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;