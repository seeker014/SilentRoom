import React from 'react';
import Sidebar from '../components/Sidebar';
import QuoteBox from '../components/QuoteBox';
import PostFeed from '../components/PostFeed';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black">
            {/* Main Container */}
            <div className="flex min-h-screen">
                {/* Sidebar - 20% width */}
                <div className="w-[20%] min-w-[300px] border-r border-red-900/30 bg-gradient-to-b from-red-950/20 to-gray-900/20 backdrop-blur-sm">
                    <Sidebar />
                </div>
                
                {/* Main Content Area - 80% width */}
                <div className="flex-1 flex flex-col">
                    {/* Quote Box */}
                    <div className="border-b border-red-900/30">
                        <QuoteBox />
                    </div>
                    
                    {/* Post Feed */}
                    <div className="flex-1 overflow-y-auto">
                        <PostFeed />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
