import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Image, Send, ArrowLeft } from 'lucide-react';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const token = localStorage.getItem('token');

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log('Post created:', res.data);
      navigate('/home'); // redirect to home
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-8 w-full">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Feed
          </button>
          
          <div className="text-center w-full">
            <div className="flex justify-center mb-6">
              <Plus className="h-16 w-16 text-red-400 opacity-80" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-100">
              Share Your Story
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Express your feelings anonymously. Your thoughts matter, and this is your safe space to share them.
            </p>
          </div>
        </div>

        {/* Create Post Form */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-5xl bg-gradient-to-b from-red-950/30 to-gray-900/30 rounded-2xl border border-red-900/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* Content Textarea */}
              <div className="w-full">
                <label className="block text-lg font-semibold text-gray-200 mb-3">
                  What's on your mind?
                </label>
                <textarea
                  placeholder="Share your feelings, thoughts, experiences... This is your safe space to be authentic."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="w-full">
                <label className="block text-lg font-semibold text-gray-200 mb-3">
                  Add an Image (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all duration-200 cursor-pointer"
                  >
                    <Image className="w-5 h-5 mr-2" />
                    {image ? image.name : 'Choose an image to upload'}
                  </label>
                </div>
                {image && (
                  <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <p className="text-gray-300 text-sm">
                      Selected: <span className="text-red-400">{image.name}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full">
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-red-700 hover:bg-red-600 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Share Post
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border-2 border-gray-600 hover:border-gray-500 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Privacy Notice */}
            <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700 w-full">
              <p className="text-gray-400 text-sm text-center">
                <span className="text-red-400 font-semibold">Remember:</span> Your post will be shared anonymously. 
                Only your nickname will be visible to other users.
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="w-full flex justify-center mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            <div className="bg-gradient-to-b from-red-950/20 to-gray-900/20 p-6 rounded-xl border border-red-900/10 w-full">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Be Authentic</h3>
              <p className="text-gray-400 text-sm">
                Share your genuine feelings and experiences. This community values honesty and vulnerability.
              </p>
            </div>
            
            <div className="bg-gradient-to-b from-red-950/20 to-gray-900/20 p-6 rounded-xl border border-red-900/10 w-full">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Stay Respectful</h3>
              <p className="text-gray-400 text-sm">
                Remember that real people will read your post. Be kind and considerate in your words.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
