import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  useEffect(() => {
    document.title = "About Praxo AI Tools";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Learn about Praxo AI Tools, our mission, and how we help creators generate high-quality content quickly and efficiently.');

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'AI tools, content generator, caption generator, SaaS tools, about us');

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-gray-900/50 border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          About Praxo AI Tools
        </h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">About Us</h2>
            <p>
              Praxo AI Tools is an AI-powered platform designed to help creators generate high-quality content quickly and efficiently. We leverage the latest in artificial intelligence to streamline your creative workflow.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Mission</h2>
            <p>
              Our mission is to simplify content creation using AI so that anyone can create engaging content in seconds. We believe that powerful tools should be accessible and easy to use for everyone.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What We Offer</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Caption Generator:</strong> Create engaging captions for your social media posts.</li>
              <li><strong>Hook Generator:</strong> Generate viral hooks to capture your audience's attention.</li>
              <li><strong>More AI tools coming soon:</strong> We are constantly expanding our suite of tools to meet your needs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Who It's For</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Content Creators:</strong> Streamline your workflow and overcome writer's block.</li>
              <li><strong>Influencers:</strong> Maintain a consistent posting schedule with high-quality content.</li>
              <li><strong>Businesses:</strong> Enhance your digital marketing efforts without needing a large team.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Why Choose Us</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Fast Results:</strong> Generate content in seconds, not hours.</li>
              <li><strong>Simple Interface:</strong> Intuitive design that gets straight to the point.</li>
              <li><strong>No Technical Skills Required:</strong> You don't need to be an AI expert to get professional results.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Vision</h2>
            <p>
              To build a complete ecosystem of AI-powered tools for creators and businesses, empowering them to reach their full potential in the digital space.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Information</h2>
            <p>
              We'd love to hear from you! Reach out to us at:
              <br />
              <a href="mailto:praxodigital@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors mt-2 inline-block">
                praxodigital@gmail.com
              </a>
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};
