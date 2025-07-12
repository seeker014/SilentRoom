import React, { useState, useEffect } from 'react';
import { Drama, MessageCircle, Users, Shield, Heart, ArrowRight, Image, Lock, Smile } from 'lucide-react';
import {Link} from 'react-router-dom';

const LandingPage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const slidingFeatures = [
    {
      icon: Shield,
      title: "Complete Anonymity",
      description: "Share your thoughts without revealing your identity. Only nicknames, no real names required."
    },
    {
      icon: Heart,
      title: "Emotional Support",
      description: "Find comfort in a judgment-free zone where you can express your feelings openly."
    },
    {
      icon: MessageCircle,
      title: "Private Messaging",
      description: "Connect with others through anonymous one-on-one conversations and build meaningful friendships."
    },
    {
      icon: Image,
      title: "Visual Expression",
      description: "Upload images alongside your posts to better express your emotions and experiences."
    },
    {
      icon: Users,
      title: "Supportive Community",
      description: "Join a caring community where everyone understands the importance of mental health."
    },
    {
      icon: Smile,
      title: "Share Joy & Struggles",
      description: "Whether you're celebrating or struggling, find people who truly understand your journey."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % slidingFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Drama className="h-8 w-8 text-red-400" />
          <span className="text-2xl font-bold text-gray-100">Silent Room</span>
        </div>
        <div className="flex space-x-4">
          <Link to="/login">
          <button className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium">
            Login
          </button>
          </Link> 
          <Link to="/signup">
          <button className="px-6 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors duration-200 font-medium">
            Sign Up
          </button>
          </Link> 
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Drama className="h-24 w-24 text-red-400 opacity-80" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            Silent Room
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Share your feelings anonymously. Connect with others without revealing your identity. 
            A safe space for your thoughts, emotions, and connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
            <button className="px-8 py-4 bg-red-700 hover:bg-red-600 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            </Link>
            <button className="px-8 py-4 border-2 border-gray-600 hover:border-gray-500 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Silent Room - Sliding Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-100">
            Why Choose Silent Room?
          </h2>
        </div>
        
        <div className="relative h-64 overflow-hidden rounded-2xl bg-gradient-to-b from-red-950/30 to-gray-900/30 border border-red-900/20">
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentFeature * 100}%)` }}
          >
            {slidingFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="min-w-full flex items-center justify-center p-8">
                  <div className="text-center max-w-2xl">
                    <div className="mb-6">
                      <IconComponent className="w-16 h-16 mx-auto text-red-400" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Carousel Indicators - Positioned Lower */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slidingFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFeature 
                    ? 'bg-red-400' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-100">
            Express Yourself Freely
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Whether you're battling depression, celebrating joy, or anything in between - 
            this is your safe space to be authentic.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 p-8 rounded-xl border border-red-900/20 hover:border-red-800/40 transition-all duration-300">
            <Shield className="h-12 w-12 text-red-400 mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-100">Anonymous Identity</h3>
            <p className="text-gray-300 leading-relaxed">
              Sign up with just a nickname and password. No email, no real name required. 
              Your true identity stays protected while you share your authentic self.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 p-8 rounded-xl border border-red-900/20 hover:border-red-800/40 transition-all duration-300">
            <Heart className="h-12 w-12 text-red-400 mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-100">Share Your Feelings</h3>
            <p className="text-gray-300 leading-relaxed">
              Post your thoughts, upload images, and express whatever you're going through. 
              Happy, sad, anxious, or excited - all emotions are welcome here.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gradient-to-b from-red-950/30 to-gray-900/30 p-8 rounded-xl border border-red-900/20 hover:border-red-800/40 transition-all duration-300">
            <Users className="h-12 w-12 text-red-400 mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gray-100">Connect & Support</h3>
            <p className="text-gray-300 leading-relaxed">
              Comment on posts, message others privately, and build meaningful connections. 
              Find support and friendship without judgment.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-100">
            Simple Steps to Start
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Getting started is easy. Just follow these simple steps to join our community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-100">Sign Up</h3>
            <p className="text-gray-400">Create your account with just a nickname and password</p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-100">Make a Post</h3>
            <p className="text-gray-400">Share your thoughts, upload images, express yourself freely</p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-100">Engage</h3>
            <p className="text-gray-400">Comment on others' posts, show support and understanding</p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">4</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-100">Connect</h3>
            <p className="text-gray-400">Message privately, build friendships, find your tribe</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center bg-gradient-to-r from-red-950/40 to-gray-900/40 p-12 rounded-2xl border border-red-900/30">
          <Drama className="h-16 w-16 text-red-400 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-100">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands who have found their voice in our anonymous community. 
            Your journey to authentic expression starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
            <button className="px-10 py-4 bg-red-700 hover:bg-red-600 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
              Join Silent Room
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            </Link>
            <button className="px-10 py-4 border-2 border-gray-600 hover:border-gray-500 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Drama className="h-6 w-6 text-red-400" />
            <span className="text-xl font-bold text-gray-200">Silent Room</span>
          </div>
          <p className="text-gray-400 text-sm">
            A safe space for authentic expression and anonymous connections
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;