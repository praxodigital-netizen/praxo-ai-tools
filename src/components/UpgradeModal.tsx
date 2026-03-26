import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, LogIn } from 'lucide-react';
import { useUsageStore } from '../store/usage';
import { LoginModal } from './LoginModal';
import { useRazorpay } from '../hooks/useRazorpay';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'limit' | 'soft';
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, type = 'limit' }) => {
  const { userEmail, upgradeToPro, isPro } = useUsageStore();
  const { handlePayment, isProcessing } = useRazorpay();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleUpgrade = () => {
    handlePayment(() => setIsLoginModalOpen(true));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6 mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-center mb-4">
                {type === 'soft' 
                  ? "🔥 Your content is getting better…" 
                  : (!userEmail ? "🔒 You've reached your free limit." : "You’ve reached today’s limit 🚀")}
              </h2>
              
              <p className="text-gray-300 text-center mb-8 text-lg">
                {type === 'soft' ? (
                  <>unlock Pro for unlimited high-converting results</>
                ) : !userEmail ? (
                  <>Login to unlock more credits.</>
                ) : (
                  <>
                    Upgrade to Pro for unlimited access<br/>
                    <span className="text-purple-400 font-semibold mt-2 block">Only ₹29/month. Cancel anytime.</span>
                  </>
                )}
              </p>

              <div className="space-y-3">
                {!userEmail && type === 'limit' && (
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                )}
                
                {(userEmail || type === 'soft') && (
                  <button 
                    onClick={() => {
                      if (isPro) return;
                      handleUpgrade();
                    }}
                    disabled={isProcessing || isPro}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPro ? 'Pro Active' : (isProcessing ? 'Processing...' : 'Upgrade to Pro 🚀')}
                  </button>
                )}

                {userEmail && type === 'limit' && (
                  <button 
                    onClick={onClose}
                    className="w-full py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Try again tomorrow</span>
                  </button>
                )}

                {type === 'soft' && (
                  <button 
                    onClick={onClose}
                    className="w-full py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Continue for free</span>
                  </button>
                )}
              </div>
              
              <p className="text-center text-gray-500 text-sm mt-6">
                Join 1,000+ creators already using Praxo AI
              </p>
            </div>
          </motion.div>
          
          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
          />
        </div>
      )}
    </AnimatePresence>
  );
};
