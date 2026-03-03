'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Send, AlertCircle, Zap, Globe, MessageSquare } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'sonner';

const EXAMPLE_PROMPTS = [
  { label: 'Instagram', prompt: 'Design Instagram - photo sharing social media platform', icon: '📸' },
  { label: 'Netflix', prompt: 'Design Netflix - video streaming platform', icon: '🎬' },
  { label: 'Uber', prompt: 'Design Uber - ride-sharing and transportation platform', icon: '🚗' },
  { label: 'Twitter/X', prompt: 'Design Twitter - real-time microblogging platform', icon: '🐦' },
  { label: 'Spotify', prompt: 'Design Spotify - music streaming service', icon: '🎵' },
  { label: 'WhatsApp', prompt: 'Design WhatsApp - real-time messaging platform', icon: '💬' },
];

export default function DesignForm() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.generateDesign(prompt.trim());
      toast.success('System design generated successfully!', {
        description: `Completed in ${((result.meta?.generationTimeMs || 0) / 1000).toFixed(1)}s`,
      });
      router.push(`/design/${result.data._id}`);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to generate design. Please try again.';
      setError(message);
      toast.error('Generation failed', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setError(null);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-8 sm:p-12"
      >
        <LoadingSpinner
          message="Architecting your system..."
          subMessage="AI is designing microservices, databases, APIs, and infrastructure"
        />
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main input form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="glass rounded-3xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">System Design Prompt</h2>
            <p className="text-dark-400 text-sm">
              Describe the system you want to architect
            </p>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError(null);
            }}
            placeholder="e.g., Design a ride-sharing platform like Uber with real-time tracking, payment processing, and driver matching..."
            rows={4}
            maxLength={1000}
            className="w-full bg-dark-900/60 border border-dark-600/50 rounded-2xl px-5 py-4 text-white placeholder-dark-500 focus:ring-2 focus:ring-accent/40 focus:border-accent/40 outline-none transition-all duration-200 resize-none text-[15px] leading-relaxed"
          />
          <div className="absolute bottom-3 right-3 text-xs text-dark-500">
            {prompt.length}/1000
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
          >
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-accent hover:bg-accent-600 disabled:bg-dark-700 disabled:text-dark-500 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-accent/20 disabled:shadow-none"
        >
          <Sparkles className="w-5 h-5" />
          Generate System Design
          <Send className="w-4 h-4" />
        </motion.button>
      </motion.form>

      {/* Example prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-dark-400">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Quick Examples</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {EXAMPLE_PROMPTS.map((example, i) => (
            <motion.button
              key={example.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleExampleClick(example.prompt)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dark-700/50 bg-dark-800/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 group text-left"
            >
              <span className="text-xl">{example.icon}</span>
              <span className="text-sm font-medium text-dark-300 group-hover:text-white transition-colors">
                {example.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
      >
        {[
          {
            icon: Zap,
            title: 'AI-Powered',
            desc: 'Leveraging LLaMA 3.3 70B for expert-level designs',
          },
          {
            icon: Globe,
            title: 'Interactive Diagrams',
            desc: 'Explore architecture with zoomable flow charts',
          },
          {
            icon: Sparkles,
            title: 'Complete Analysis',
            desc: 'Microservices, DBs, APIs, caching & infrastructure',
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="flex items-start gap-3 px-4 py-3 rounded-xl bg-dark-900/30"
          >
            <feature.icon className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-dark-200">{feature.title}</p>
              <p className="text-xs text-dark-500 mt-0.5">{feature.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
