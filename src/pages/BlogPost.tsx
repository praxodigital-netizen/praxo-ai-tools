import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import ReactMarkdown from 'react-markdown';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Praxo AI Tools`;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', post.excerpt);

      window.scrollTo(0, 0);
    }
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl"
        >
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1 text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="prose prose-invert prose-purple max-w-none">
            <ReactMarkdown
              components={{
                h3: ({node, ...props}) => <h3 className="text-2xl font-semibold text-white mt-8 mb-4" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-300 leading-relaxed mb-6" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 text-gray-300 mb-6 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 text-gray-300 mb-6 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                a: ({node, ...props}) => <a className="text-purple-400 hover:text-purple-300 transition-colors underline" {...props} />
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Ready to grow your audience?</h3>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity"
            >
              Try Praxo AI Tools for Free
            </Link>
          </div>
        </motion.article>
      </div>
    </div>
  );
};
