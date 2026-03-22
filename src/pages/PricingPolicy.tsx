import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const PricingPolicy: React.FC = () => {
  useEffect(() => {
    document.title = "Pricing & Refund Policy | Praxo AI Tools";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Pricing and Refund Policy for Praxo AI Tools. Learn about our credit system, free and paid plans, and refund guidelines.');

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'AI tools, content generator, caption generator, SaaS tools, pricing, refund policy');

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
          Pricing & Refund Policy
        </h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Pricing Overview</h2>
            <p>
              Praxo AI Tools offers both free and paid plans based on a credit usage system. Our goal is to provide accessible AI-powered content generation tools for everyone, with scalable options for heavy users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Credit System</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Usage:</strong> Each content generation request uses exactly 1 credit.</li>
              <li><strong>Free Users:</strong> Free accounts receive a limited number of daily credits to try out our tools.</li>
              <li><strong>Tracking:</strong> Credits are tracked per individual user account.</li>
              <li><strong>Limits:</strong> Usage limits apply to prevent abuse and ensure fair access for all users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Refund Policy</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Non-Refundable:</strong> All payments are non-refundable once credits have been used.</li>
              <li><strong>Technical Issues:</strong> In case of technical issues or system failures, users can contact our support team for assistance.</li>
              <li><strong>Case-by-Case:</strong> Refunds (if any) are handled strictly on a case-by-case basis at our discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Billing Transparency</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>No Hidden Charges:</strong> We believe in complete transparency. You will only be billed for what you explicitly agree to purchase.</li>
              <li><strong>Upgrades:</strong> Users can upgrade their plans at any time to access more credits and premium features.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Information</h2>
            <p>
              If you have any questions about our pricing or refund policy, please contact us at:
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
