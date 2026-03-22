import React from 'react';
import { Zap, MessageSquare, PenTool } from 'lucide-react';
import { ToolCard } from './Home';

export const Tools: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 overflow-x-hidden">
      <div className="text-center mb-16 w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 break-words">Our AI Tools</h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to grow your audience and create viral content.</p>
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
  );
};
