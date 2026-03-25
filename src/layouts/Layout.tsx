import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sparkles, Zap, MessageSquare, PenTool, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useUsageStore } from '../store/usage';
import { LoginModal } from '../components/LoginModal';
import { useRazorpay } from '../hooks/useRazorpay';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export const Layout: React.FC = () => {
  const { isPro, userEmail, login, logout, checkDailyReset, getDisplayCount, getDisplayLimit, syncWithDb, getTimeUntilReset } = useUsageStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState<string | null>(null);
  const { handlePayment, isProcessing } = useRazorpay();

  const displayCount = getDisplayCount();
  const displayLimit = getDisplayLimit();

  // Check for daily reset on mount
  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  // Update timer every minute
  useEffect(() => {
    if (!userEmail || isPro) return;
    
    const updateTimer = () => {
      setTimeUntilReset(getTimeUntilReset());
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [userEmail, isPro, getTimeUntilReset]);

  // Supabase Auth Listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await login(session.user.email || '', session.user.id);
          // Track login event
          if (window.gtag) {
            window.gtag('event', 'login', {
              method: 'google'
            });
          }
        } else if (event === 'SIGNED_OUT') {
          await logout();
          // Redirect to home page on logout
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error fetching session:', error);
        logout();
      } else if (session) {
        login(session.user.email || '', session.user.id);
      } else {
        // Don't call logout here on initial load if there's no session, 
        // as it might overwrite guest credits if not careful.
        // The store already defaults to logged-out state.
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout]);

  // Smart floating CTA logic
  useEffect(() => {
    if (isPro) {
      setShowFloatingCTA(false);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show if scrolled more than 30% of page
      const scrolledPast30Percent = scrollPosition > (documentHeight - windowHeight) * 0.3;
      
      // Show if user has used at least 1 generation or has <= 2 credits left
      const hasUsedService = displayCount > 0;
      const lowCredits = (displayLimit - displayCount) <= 2;

      // Only show if not at the very top (first screen)
      const notAtTop = scrollPosition > windowHeight * 0.5;

      if (notAtTop && (scrolledPast30Percent || hasUsedService || lowCredits)) {
        setShowFloatingCTA(true);
      } else {
        setShowFloatingCTA(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, displayLimit, isPro]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    closeMobileMenu();
    
    // If we're not on the home page, navigate there first
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      // Add offset for fixed header
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <img src="/logo.png" alt="PraxoAi" className="h-6 object-contain group-hover:scale-105 transition-transform brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 hover:after:w-full after:transition-all after:duration-300">Home</Link>
              <Link to="/tools" className="text-sm text-gray-300 hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 hover:after:w-full after:transition-all after:duration-300">Tools</Link>
              <a href="/#pricing" onClick={(e) => handleScrollTo(e, 'pricing')} className="text-sm text-gray-300 hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 hover:after:w-full after:transition-all after:duration-300">Pricing</a>
              <a href="/#features" onClick={(e) => handleScrollTo(e, 'features')} className="text-sm text-gray-300 hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 hover:after:w-full after:transition-all after:duration-300">Features</a>
              <a href="/#faq" onClick={(e) => handleScrollTo(e, 'faq')} className="text-sm text-gray-300 hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 hover:after:w-full after:transition-all after:duration-300">FAQ</a>
              <a href="/#contact" onClick={(e) => handleScrollTo(e, 'contact')} className="text-sm text-gray-300 hover:text-white transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-purple-500 hover:after:w-full after:transition-all after:duration-300">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                  {isPro ? (
                    <span className="text-purple-400">Unlimited access</span>
                  ) : (
                    <span className={displayCount >= displayLimit ? "text-red-400" : "text-purple-400"}>
                      {Math.max(0, displayLimit - displayCount)} {Math.max(0, displayLimit - displayCount) === 1 ? 'credit' : 'credits'} left
                    </span>
                  )}
                </div>
                {!isPro && userEmail && timeUntilReset && (
                  <span className="text-[10px] text-gray-500 mt-1 mr-2">
                    Resets in {timeUntilReset}
                  </span>
                )}
              </div>
              
              {/* Desktop Only Elements */}
              <div className="hidden md:flex items-center space-x-4">
                {userEmail ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      <User className="w-4 h-4" />
                      <span className="truncate max-w-[120px]">{userEmail}</span>
                    </div>
                    <button 
                      onClick={async () => {
                        try {
                          await logout();
                        } catch (error) {
                          alert("Something went wrong. Please try again.");
                        }
                      }}
                      className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                )}
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    if (isPro) return;
                    if (window.gtag) {
                      window.gtag('event', 'upgrade_click');
                    }
                    handlePayment(() => setIsLoginModalOpen(true));
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 rounded-lg transition-opacity shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
                >
                  {isPro ? 'Pro Active' : (isProcessing ? 'Processing...' : 'Upgrade to Pro 🚀')}
                </button>
              </div>

              {/* Mobile Hamburger Menu Button */}
              <button 
                className="md:hidden p-2 text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-64 bg-gray-900 border-l border-white/10 z-[70] p-6 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex justify-end mb-8">
                <button 
                  onClick={closeMobileMenu}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-6 flex-grow">
                <Link to="/" onClick={closeMobileMenu} className="text-lg font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
                <Link to="/tools" onClick={closeMobileMenu} className="text-lg font-medium text-gray-300 hover:text-white transition-colors">Tools</Link>
                <a href="/#pricing" onClick={(e) => handleScrollTo(e, 'pricing')} className="text-lg font-medium text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="/#features" onClick={(e) => handleScrollTo(e, 'features')} className="text-lg font-medium text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="/#faq" onClick={(e) => handleScrollTo(e, 'faq')} className="text-lg font-medium text-gray-300 hover:text-white transition-colors">FAQ</a>
                <a href="/#contact" onClick={(e) => handleScrollTo(e, 'contact')} className="text-lg font-medium text-gray-300 hover:text-white transition-colors">Contact</a>
                
                <div className="h-px w-full bg-white/10 my-2" />
                
                {userEmail ? (
                  <>
                    <div className="flex items-center space-x-2 text-lg font-medium text-gray-300">
                      <User className="w-5 h-5" />
                      <span className="truncate">My Account ({userEmail})</span>
                    </div>
                    <button 
                      onClick={async () => {
                        try {
                          await logout();
                          closeMobileMenu();
                        } catch (error) {
                          alert("Something went wrong. Please try again.");
                        }
                      }}
                      className="flex items-center space-x-2 text-lg font-medium text-gray-300 hover:text-white transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { setIsLoginModalOpen(true); closeMobileMenu(); }}
                    className="flex items-center space-x-2 text-lg font-medium text-gray-300 hover:text-white transition-colors text-left"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                )}
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    closeMobileMenu();
                    if (isPro) return;
                    if (window.gtag) {
                      window.gtag('event', 'upgrade_click');
                    }
                    handlePayment(() => setIsLoginModalOpen(true));
                  }}
                  disabled={isProcessing}
                  className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 text-base font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{isPro ? 'Pro Active' : (isProcessing ? 'Processing...' : 'Upgrade to Pro 🚀')}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Floating CTA Button */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              if (isPro) return;
              if (window.gtag) {
                window.gtag('event', 'upgrade_click');
              }
              handlePayment(() => setIsLoginModalOpen(true));
            }}
            disabled={isProcessing}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-40 flex flex-col items-center group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] group-hover:scale-105 transition-all duration-300">
              <span className="text-lg">🚀</span>
              <span className="hidden sm:inline">{isProcessing ? 'Processing...' : 'Upgrade to Pro'}</span>
              <span className="sm:hidden">{isProcessing ? '...' : 'Upgrade'}</span>
            </div>
            <div className="absolute -top-3 bg-black/80 backdrop-blur-sm text-xs font-bold text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              🔥 Limited launch price ₹29
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="PraxoAi" className="h-6 object-contain brightness-110" />
              </Link>
              <p className="text-gray-400 text-sm max-w-xs">
                Create smarter content with AI. Generate viral hooks, engaging captions, and perfect prompts in seconds.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
                <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white transition-colors text-sm">About</Link></li>
                <li><Link to="/blog" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white transition-colors text-sm">Blog</Link></li>
                <li><Link to="/tools" className="text-gray-400 hover:text-white transition-colors text-sm">Tools</Link></li>
                <li><a href="/#pricing" onClick={(e) => handleScrollTo(e, 'pricing')} className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
                <li><a href="/#features" onClick={(e) => handleScrollTo(e, 'features')} className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
                <li><a href="/#faq" onClick={(e) => handleScrollTo(e, 'faq')} className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Popular Searches</h4>
              <div className="flex flex-wrap gap-2">
                <Link to="/" className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors">AI tools</Link>
                <Link to="/" className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors">free AI tools</Link>
                <Link to="/caption-generator" className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors">AI content generator</Link>
                <Link to="/caption-generator" className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors">AI caption generator</Link>
                <Link to="/" className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors">AI tools for business</Link>
                <Link to="/" className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors">AI tools for marketing</Link>
                <Link to="/" className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors">AI productivity tools</Link>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal & Contact</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
                <li><Link to="/pricing-policy" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white transition-colors text-sm">Pricing Policy</Link></li>
                <li className="pt-2">
                  <a href="mailto:praxodigital@gmail.com" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>praxodigital@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © 2026 Praxo AI Tools. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};
