import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle2, Loader2, MessageSquare, Share2 } from 'lucide-react';
import { useUsageStore } from '../store/usage';
import { UpgradeModal } from '../components/UpgradeModal';
import { ShareModal } from '../components/ShareModal';

export const CaptionGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('English');
  const [tone, setTone] = useState('Friendly');
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

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const res = await fetch(`${supabaseUrl}/functions/v1/generate-captions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  body: JSON.stringify({
    topic,
    language,
    tone,
    isPro
  }),
});

const data = await res.json();

if (!res.ok) {
  throw new Error(data.error || 'Failed to generate captions');
}

// ✅ IMPORTANT VALIDATION
if (!data || !data.result) {
  throw new Error("Invalid response from server");
}

// ✅ SET RESULTS
setResults(data.result);

// ✅ CREDIT ONCE
await incrementCount();

// analytics
if (window.gtag) {
  window.gtag('event', 'use_credit', {
    tool: 'caption_generator'
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
            className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full mb-6 border border-blue-500/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Engage Your Audience</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Caption Generator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Write engaging captions that drive comments, saves, and shares for your social media posts.
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
                    What's your post about?
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., A behind-the-scenes look at my workspace, my morning routine..."
                    className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
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
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
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
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                    >
                      <option value="Friendly">Friendly</option>
                      <option value="Professional">Professional</option>
                      <option value="Humorous">Humorous</option>
                      <option value="Inspirational">Inspirational</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !topic}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-6 h-6" />
                      <span>Generate Captions</span>
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
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <span>Your Captions</span>
                  </h3>
                  {results.map((caption, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="group relative bg-black/50 border border-white/5 rounded-xl p-5 hover:border-blue-500/30 transition-all"
                    >
                      <p className="text-gray-200 pr-24 text-lg leading-relaxed whitespace-pre-wrap">{caption}</p>
                      <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleShare(caption)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(caption, index)}
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
                    <MessageSquare className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-center max-w-sm">
                    Enter your topic and click generate to get engaging captions for your posts.
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
