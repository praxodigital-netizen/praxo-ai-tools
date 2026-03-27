import React, { useState } from 'react';
import { useRazorpay } from '../hooks/useRazorpay';
import { useUsageStore } from '../store/usage';
import { LoginModal } from '../components/LoginModal';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, PenTool, ArrowRight, CheckCircle2, Sparkles, Star, Globe, Rocket } from 'lucide-react';

export const Home: React.FC = () => {
  const { handlePayment, isProcessing } = useRazorpay();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isPro } = useUsageStore();
  const { is } = useUsageStore();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] max-w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Advanced AI</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
  Stop thinking content. Start going viral 🚀
</h1>
          
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300 mb-8 max-w-3xl mx-auto">
  Generate scroll-stopping hooks, captions & AI prompts in seconds.
</h2>
          
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm text-orange-300 font-medium">
              <span>🔥 Trusted by 1,000+ creators and marketers</span>
            </div>
          </div>

          {/* SVG Gradient Definition for Rocket */}
          <svg width="0" height="0" className="absolute">
            <linearGradient id="rocket-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#c084fc" offset="0%" />
              <stop stopColor="#3b82f6" offset="100%" />
            </linearGradient>
          </svg>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Discover powerful AI tools designed to help you grow faster. Generate content, captions, and ideas instantly using smart automation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <Link 
              to="/tools" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center group"
            >
              Try Free Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            No design skills needed • Instant results • Free to start
          </p>
        </motion.div>
      </section>

      {/* Example Output Section */}
      <p className="text-center text-gray-500 mt-8">
  ⚡ New ideas generated every second
</p>
<section className="py-20 border-t border-white/10">
  <div className="max-w-6xl mx-auto px-4 text-center">

    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
      See exactly what you’ll get
    </h2>

    <p className="text-gray-400 text-lg mb-12">
      Real examples generated using Praxo AI Tools
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Viral Hook */}
      <div className="bg-black/50 border border-white/10 rounded-xl p-6 text-left hover:border-purple-500/40 transition-all">
        <p className="text-purple-400 text-sm mb-2">🔥 Viral Hook</p>
        <p className="text-white text-lg font-medium">
          “Nobody talks about this… but this is why your content isn’t growing 🚨”
        </p>
      </div>

      {/* Caption */}
      <div className="bg-black/50 border border-white/10 rounded-xl p-6 text-left hover:border-blue-500/40 transition-all">
        <p className="text-blue-400 text-sm mb-2">💬 Engaging Caption</p>
        <p className="text-white text-lg font-medium">
          “You don’t need more content… you need better hooks.  
          Start small. Stay consistent. Watch what happens. 🚀  
          #GrowthMindset #Creators”
        </p>
      </div>

      {/* AI Prompt */}
      <div className="bg-black/50 border border-white/10 rounded-xl p-6 text-left hover:border-pink-500/40 transition-all">
        <p className="text-pink-400 text-sm mb-2">🧠 AI Prompt</p>
        <p className="text-white text-lg font-medium">
          “Act as a social media expert. Generate 10 high-converting Instagram reel ideas for a fitness coach targeting beginners. Include hooks, captions, and CTA.”
        </p>
      </div>

    </div>
  </div>
</section>

      {/* What You Can Achieve Section */}
<section className="py-20 border-t border-white/10">
  <div className="max-w-5xl mx-auto px-4 text-center">

    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
      What you can achieve with Praxo AI
    </h2>

    <p className="text-gray-400 text-lg mb-12">
      Stop guessing what works. Start creating content that actually performs.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 max-w-3xl mx-auto">

      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
        🔥 Go viral with scroll-stopping hooks
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
        📈 Write captions that increase engagement
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
        🎯 Generate high-converting content ideas instantly
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
        ⚡ Create ready-to-use prompts for any AI tool
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
        🚀 Save hours of thinking and content planning
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left">
        💡 Never run out of content ideas again
      </div>

    </div>
  </div>
</section>

      {/* Tools Section */}
      <section id="tools" className="w-full bg-white/[0.02] border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Free AI Tools for Creators</h2>
            <p className="text-gray-400">Everything you need to grow your audience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ToolCard 
              to="/viral-hook-generator"
              icon={<Zap className="w-8 h-8 text-purple-400" />}
              title="Viral Hook Generator"
              description="Create scroll-stopping opening lines that instantly grab attention and make people want to watch, read, or click."
              color="from-purple-500/20 to-transparent"
            />
            <ToolCard 
              to="/caption-generator"
              icon={<MessageSquare className="w-8 h-8 text-blue-400" />}
              title="Caption Generator"
              description="Turn your ideas into complete captions with engaging text, clear messaging, and relevant hashtags that drive likes, comments, and shares."
              color="from-blue-500/20 to-transparent"
            />
            <ToolCard 
              to="/ai-prompt-generator"
              icon={<PenTool className="w-8 h-8 text-pink-400" />}
              title="AI Prompt Generator"
              description="Create clear and powerful prompts that help you get better results from any AI tool, whether you're generating content, images, or ideas."
              color="from-pink-500/20 to-transparent"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
<section className="py-20 border-t border-white/10">
  <div className="max-w-6xl mx-auto px-4 text-center">

    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
      What creators are achieving
    </h2>

    <p className="text-gray-400 text-lg mb-12">
      Real results from people using Praxo AI Tools
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-black/50 border border-white/10 rounded-xl p-6 text-left">
        <p className="text-yellow-400 mb-3">★★★★★</p>
        <p className="text-white text-lg">
          “My reels started getting 2x more engagement just by fixing my hooks. This tool is insane.”
        </p>
        <p className="text-gray-500 mt-4 text-sm">— Somesh (Content Creator)</p>
      </div>

      <div className="bg-black/50 border border-white/10 rounded-xl p-6 text-left">
        <p className="text-yellow-400 mb-3">★★★★★</p>
        <p className="text-white text-lg">
          “I stopped overthinking content. Now I just generate, post, and grow. Saved me hours every day.”
        </p>
        <p className="text-gray-500 mt-4 text-sm">— Jesse Daniel (Freelancer)</p>
      </div>

      <div className="bg-black/50 border border-white/10 rounded-xl p-6 text-left">
        <p className="text-yellow-400 mb-3">★★★★★</p>
        <p className="text-white text-lg">
          “The AI prompts alone are worth it. My content strategy became 10x better.”
        </p>
        <p className="text-gray-500 mt-4 text-sm">— Chetan (Digital Marketer)</p>
      </div>

    </div>
  </div>
</section>
      
      {/* Pricing */}
<section id="pricing" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
  <div className="text-center mb-16">
    <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
    <p className="text-gray-400">Start for free, upgrade when you need more.</p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    {/* Starter Plan */}
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
      <h3 className="text-2xl font-bold mb-2">Starter</h3>
      <div className="text-4xl font-extrabold mb-6">
        ₹0<span className="text-lg text-gray-400 font-normal">/mo</span>
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          2 credits per day (guest)
        </li>
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          Login required for extended usage
        </li>
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          Access to 3 tools
        </li>
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          Standard quality output
        </li>
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          Ads may be shown
        </li>
      </ul>

      <Link
        to="/tools"
        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-center font-semibold transition-colors mb-3"
      >
        Get Started
      </Link>

      <div className="flex justify-center items-center text-xs text-gray-400">
        <span className="flex items-center">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          No credit card required
        </span>
      </div>
    </div>

    {/* Pro Plan */}
    <div className="p-8 rounded-3xl bg-white/5 border border-purple-500 flex flex-col relative">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
        🔥 Most Popular
      </div>

      <h3 className="text-2xl font-bold mb-2">Pro</h3>

      <div className="text-4xl font-extrabold mb-2">
        <span className="line-through text-gray-500 text-2xl mr-2">₹99</span>
        ₹29
        <span className="text-lg text-gray-400 font-normal">/mo</span>
      </div>

      <p className="text-green-400 text-sm mb-6">
        🔥 Limited launch offer • Only for first 100 users
      </p>

      <ul className="space-y-4 mb-8 flex-1">
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          Unlimited credits
        </li>
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          Access to all tools
        </li>
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          Generate 5 results per request
        </li>
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          Premium quality output
        </li>
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          Faster generation
        </li>
        <li className="flex items-center text-gray-300">
          <CheckCircle2 className="w-5 h-5 mr-3 text-purple-400" />
          No ads
        </li>
      </ul>

      {isPro ? (
  <button
    disabled
    className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold cursor-not-allowed opacity-80"
  >
    Pro Activated ✅
  </button>
) : (
  <button
    onClick={() => handlePayment(() => setIsLoginModalOpen(true))}
    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
  >
    Upgrade to Pro 🚀
  </button>
)}
      <div className="mt-4 text-center">
  <p className="text-sm text-gray-400">🔒 Secure payments via Razorpay</p>
  <p className="text-xs text-gray-500 mt-1">
    256-bit encryption • No hidden charges • Cancel anytime
  </p>
</div>
    </div>
  </div>
</section>
      {/* Who is this for? */}
<section
  id="features"
  className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10"
>
  <div className="text-center mb-16">
    <h2 className="text-3xl font-bold mb-4">Who is this for?</h2>
    <p className="text-gray-400">
      Built for anyone looking to scale their online presence.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    
    {/* Content Creators */}
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:scale-105 hover:border-purple-500/40 transition-all duration-300">
      <h3 className="text-xl font-bold mb-2">🎬 Content Creators</h3>
      <p className="text-sm text-gray-400">
        Create scroll-stopping hooks, captions, and ideas for any type of content across all platforms.
      </p>
    </div>

    {/* Business Owners */}
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:scale-105 hover:border-purple-500/40 transition-all duration-300">
      <h3 className="text-xl font-bold mb-2">💼 Business Owners</h3>
      <p className="text-sm text-gray-400">
        Generate high-converting captions, ads, and content to promote your products or services.
      </p>
    </div>

    {/* Freelancers */}
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:scale-105 hover:border-purple-500/40 transition-all duration-300">
      <h3 className="text-xl font-bold mb-2">🧑‍💻 Freelancers</h3>
      <p className="text-sm text-gray-400">
        Save time and scale your work by generating content, ideas, and client deliverables instantly.
      </p>
    </div>

  </div>
</section>

      {/* Frequently Asked Questions */}
<section id="faq" className="w-full bg-white/[0.02] border-t border-white/5 py-24">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
      <p className="text-gray-400">Everything you need to know about Praxo AI.</p>
    </div>

    <div className="space-y-4">

      {/* FAQ ITEM */}
      {[
        {
          q: "Is Praxo AI free to use?",
          a: "Yes, you can use it for free with limited daily credits. Upgrade anytime for unlimited access."
        },
        {
          q: "Do I need to login?",
          a: "You can try without login, but logging in gives you more credits and better access."
        },
        {
          q: "What can I create with Praxo AI?",
          a: "You can create hooks, captions, prompts, and content ideas for any platform."
        },
        {
          q: "Does this work for all platforms?",
          a: "Yes, Praxo AI works for Instagram, YouTube, Facebook, LinkedIn, and more."
        },
        {
          q: "Why should I upgrade?",
          a: "Upgrading gives you unlimited usage, faster results, and access to all tools."
        }
      ].map((item, index) => (
        <div
          key={index}
          className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300"
        >
          
          {/* QUESTION */}
          <button
            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition"
          >
            <span className="text-lg font-semibold">{item.q}</span>
            <span className="text-purple-400 text-xl">
              {openFAQ === index ? "−" : "+"}
            </span>
          </button>

          {/* ANSWER */}
          {openFAQ === index && (
            <div className="px-6 pb-6 text-gray-400 text-sm">
              {item.a}
            </div>
          )}

        </div>
      ))}

    </div>
  </div>
</section>

      {/* Contact Section */}
<section id="contact" className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10">

  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
    <p className="text-gray-400">We’re here to support you anytime.</p>
  </div>

  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:border-purple-500/40 hover:scale-[1.02] transition-all duration-300">

    <p className="text-lg text-gray-300 mb-4">
      Have questions about Praxo AI or need assistance?
    </p>

    {/* Email Button */}
    <a
      href="mailto:praxodigital@gmail.com"
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition mb-4"
    >
      📧 Email Us
    </a>

    {/* Email Text */}
    <p className="text-sm text-gray-400 mb-2">
      praxodigital@gmail.com
    </p>

    {/* Trust Line */}
    <p className="text-xs text-gray-500">
      ⚡ We usually respond within 24 hours
    </p>

  </div>

</section>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};

export const ToolCard = ({ to, icon, title, description, color }: any) => (
  <Link to={to} className="group block">
    <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </Link>
);
