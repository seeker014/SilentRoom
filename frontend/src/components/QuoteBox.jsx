import { useState, useEffect } from 'react';
import { Quote, RefreshCw , BookOpenTextIcon} from 'lucide-react';
import axios from 'axios';

const QuoteBox = () => {
  const [quote, setQuote] = useState("Loading motivational quote...");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuote = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://api.quotable.io/random?tags=motivational|inspirational');
      setQuote(response.data.content);
      setAuthor(response.data.author);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
      setQuote("Stay strong, your journey matters. Every step forward is progress.");
      setAuthor("Silent Room");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <div className="relative group">
        {/* Main Quote Container */}
        <div className="bg-gradient-to-br from-gray-900 via-red-900/20 to-black rounded-2xl border border-red-900/20 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-red-900/10 hover:shadow-3xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-red-900/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-700/20 to-red-600/20 rounded-lg border border-red-600/30">
                <BookOpenTextIcon className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-100">
                Quote of the Day
              </h2>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={fetchQuote}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-950/30 hover:to-gray-900/30 transition-all duration-200 border border-transparent hover:border-red-900/20 group"
              title="Get new quote"
            >
              <RefreshCw className={`w-5 h-5 text-gray-400 hover:text-red-400 transition-all duration-200 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            </button>
          </div>

          {/* Quote Content */}
          <div className="p-8">
            <div className="relative">
              {/* Quote Icon */}
              <Quote className="absolute -top-2 -left-2 w-8 h-8 text-red-400/20 transform rotate-180" />
              
              {/* Quote Text */}
              <blockquote className="relative z-10">
                <p className="text-lg md:text-xl text-gray-200 text-center leading-relaxed font-medium italic mb-4 pl-6">
                  {quote}
                </p>

                <Quote className="absolute -top-2 -right-2 w-8 h-8 text-red-400/20" />
                
                {/* Author */}
                {author && (
                  <footer className="flex items-center justify-end">
                    <div className="h-px bg-gradient-to-r from-transparent to-red-400/30 flex-1 mr-4"></div>
                    <cite className="text-red-400 font-medium not-italic">
                      — {author}
                    </cite>
                  </footer>
                )}
              </blockquote>

              {/* Decorative Quote Icon */}
              
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700"></div>
        </div>

        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-red-400/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      </div>
    </div>
  );
};

export default QuoteBox;