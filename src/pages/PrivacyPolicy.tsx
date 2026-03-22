import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = "Privacy Policy | Praxo AI Tools";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Privacy Policy for Praxo AI Tools. Learn how we protect your user privacy while you use our AI tools, caption generator, and content creation services.');

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'AI tools, caption generator, content creation, user privacy, privacy policy');

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
          Privacy Policy
        </h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Introduction</h2>
            <p>
              Welcome to Praxo AI Tools. We provide AI-powered tools like our caption generator, viral hook generator, and prompt generator to help you create better content. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Email Address:</strong> Collected securely via Google login for authentication purposes.</li>
              <li><strong>Usage Data:</strong> Information about your credits used and tool usage to manage your account limits.</li>
              <li><strong>Analytics Data:</strong> Anonymous data collected via Google Analytics to understand how our website is used.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How We Use Data</h2>
            <p className="mb-2">We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and maintain our AI tools and services.</li>
              <li>To track and manage your credit usage accurately.</li>
              <li>To improve the performance and user experience of our platform.</li>
              <li>For analytics and insights to understand user behavior and preferences.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Protection</h2>
            <p>
              Your data is securely stored using industry-standard practices. We respect your privacy and strictly do not sell, rent, or trade your personal data to any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. This includes the usage of cookies for analytics purposes to help us improve our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
            <p className="mb-2">We utilize the following third-party services that may collect information used to identify you:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Google:</strong> For secure authentication and login.</li>
              <li><strong>Supabase:</strong> For secure database management and user data storage.</li>
              <li><strong>Google Analytics:</strong> For website traffic analysis and performance tracking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">User Rights</h2>
            <p>
              You have the right to access, update, or delete the information we have on you. If you wish to request the removal of your data from our systems, please contact us using the information provided below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:praxodigital@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors mt-2 inline-block">
                praxodigital@gmail.com
              </a>
            </p>
          </section>
          
          <div className="pt-6 border-t border-white/10 text-sm text-gray-500">
            Last updated: March 22, 2026
          </div>
        </div>
      </motion.div>
    </div>
  );
};
