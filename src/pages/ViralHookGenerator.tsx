import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, Loader2, Zap, Share2 } from 'lucide-react';
import { useUsageStore } from '../store/usage';
import { client } from '../api/client';
import { UpgradeModal } from '../components/UpgradeModal';
import { ShareModal } from '../components/ShareModal';

export const ViralHookGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('English');
  const [tone, setTone] = useState('Curiosity-driven');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalType, setUpgradeModalType] = useState<'limit' | 'soft'>('limit');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareText, setShareText] = useState('');

  const { browserId, isPro, userEmail, incrementCount, getDisplayCount, getDisplayLimit } = useUsageStore();
  const displayCount = getDisplayCount();
  const displayLimit = getDisplayLimit();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    if (!isPro && displayCount >= displayLimit) {
      if (window.gtag) {
        window.gtag('event', 'limit_reached');
      }
      setUpgradeModalType('limit');
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      const res = await fetch(`${supabaseUrl}/functions/v1/generate-hooks`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  body: JSON.stringify({ topic, language, tone, browserId })
});
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate hooks');
      }

      if (!isPro) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setResults(data.result);
      await incrementCount();
      
      if (window.gtag) {
        window.gtag('event', 'use_credit', {
          tool: 'hook_generator'
        });
      }
      
      const newCount = getDisplayCount();
      if (!isPro && userEmail && newCount === 3) {
        setUpgradeModalType('soft');
        setShowUpgradeModal(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = async (text: string) => {
    const fullShareText = `Check this viral content I generated using Praxo AI Tools 🚀\n\n${text}\n\nTry it here: https://praxoaitools.com`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Praxo AI Tools',
          text: fullShareText,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShareText(text);
      setShareModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full mb-6 border border-purple-500/20"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Stop the Scroll Instantly</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Viral Hook Generator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Create attention-grabbing hooks that force your audience to stop scrolling and watch your content.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-xl">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What's your video about?
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., 3 tips for better sleep, how to start a business with $0..."
                    className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Hinglish">Hinglish</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
                    >
                      <option value="Curiosity-driven">Curiosity</option>
                      <option value="Controversial">Controversial</option>
                      <option value="Educational">Educational</option>
                      <option value="Storytelling">Storytelling</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !topic}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      <span>Generate Hooks</span>
                    </>
                  )}
                </button>
                
                {!isPro ? (
                  <p className="text-center text-xs text-gray-500 mt-2">
                    {displayLimit - displayCount} free credits remaining
                  </p>
                ) : (
                  <p className="text-center text-sm text-purple-400 mt-2 font-medium flex items-center justify-center space-x-1">
                    <span>🔥 Viral Mode Activated</span>
                  </p>
                )}
              </form>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7"
          >
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 min-h-[400px] shadow-xl">
              {error ? (
                <div className="h-full flex items-center justify-center text-red-400 text-center p-6 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p>{error}</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <span>Your Viral Hooks</span>
                  </h3>
                  {results.map((hook, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="group relative bg-black/50 border border-white/5 rounded-xl p-5 hover:border-purple-500/30 transition-all"
                    >
                      <p className="text-gray-200 pr-24 text-lg leading-relaxed">{hook}</p>
                      <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleShare(hook)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(hook, index)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy"
                        >
                          {copiedIndex === index ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 min-h-[300px]">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-center max-w-sm">
                    Enter your topic and click generate to get viral hooks tailored for your content.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        type={upgradeModalType}
      />
      
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        text={shareText}
      />
    </div>
  );
};
