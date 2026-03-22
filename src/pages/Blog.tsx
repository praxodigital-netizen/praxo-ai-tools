import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

export const Blog: React.FC = () => {
  useEffect(() => {
    document.title = "AI Tools Blog | Praxo AI Tools";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Explore the latest AI tools, trends, and guides to boost your productivity and grow your business with Praxo AI Tools.');

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            AI Tools Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore the latest AI tools, trends, and guides to boost your productivity and grow your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-colors flex flex-col h-full"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1 text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                  <Tag className="w-3 h-3" />
                  {post.category}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                <Link to={`/blog/${post.slug}`} className="hover:text-purple-400 transition-colors">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                {post.excerpt}
              </p>
              
              <Link 
                to={`/blog/${post.slug}`} 
                className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors group mt-auto text-sm"
              >
                Read Article
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.article>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
