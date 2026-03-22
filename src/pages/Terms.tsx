import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const Terms: React.FC = () => {
  useEffect(() => {
    document.title = "Terms & Conditions | Praxo AI Tools";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Terms & Conditions for Praxo AI Tools. Read our terms of service for using our AI tools, caption generator, and content creation platform.');

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'AI tools, caption generator, content creation, terms and conditions, terms of service');

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
          Terms & Conditions
        </h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Acceptance of Terms</h2>
            <p>
              By accessing and using Praxo AI Tools, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you are prohibited from using our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Service Description</h2>
            <p>
              Praxo AI Tools provides AI-powered content generation tools, including but not limited to caption generators, viral hook generators, and prompt generators. Our services are designed to assist users in creating engaging content efficiently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Usage Limits</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Free Credits:</strong> Free accounts are provided with a limited number of credits. Once these credits are exhausted, you must wait for the reset period or upgrade your account.</li>
              <li><strong>Acceptable Use:</strong> Misuse of the platform, including automated scraping, bypassing credit limits, or generating harmful content, is strictly prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Account Responsibility</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Please notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Intellectual Property</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Platform Ownership:</strong> The Praxo AI Tools platform, including its design, code, and branding, belongs exclusively to Praxo AI Tools.</li>
              <li><strong>Generated Content:</strong> You retain the rights to use, modify, and distribute the content generated using our tools for your personal or commercial purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h2>
            <p>
              While we strive to provide high-quality AI generation, the results may not always be 100% accurate, appropriate, or fit for your specific needs. Praxo AI Tools shall not be held liable for any direct, indirect, or consequential damages arising from the use of our services or generated content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to our services at any time, without prior notice, for conduct that we believe violates these Terms & Conditions or is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Changes to Terms</h2>
            <p>
              We may update our Terms & Conditions from time to time. We will notify you of any changes by posting the new Terms & Conditions on this page. You are advised to review this page periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at:
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
