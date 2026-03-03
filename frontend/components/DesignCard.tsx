'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Trash2, Cpu, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Design } from '@/lib/api';

interface DesignCardProps {
  design: Design;
  index?: number;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Completed' },
  generating: { icon: Loader2, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Generating' },
  failed: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Failed' },
};

export default function DesignCard({ design, index = 0, onDelete }: DesignCardProps) {
  const status = statusConfig[design.status] || statusConfig.completed;
  const StatusIcon = status.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative"
    >
      <Link href={`/design/${design._id}`} className="block">
        <div className="relative rounded-2xl border border-dark-700/50 bg-dark-800/40 hover:border-accent/30 hover:bg-dark-800/70 p-6 transition-all duration-300 h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-accent-400" />
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-accent-300 transition-colors">
            {design.title}
          </h3>

          {/* Prompt preview */}
          <p className="text-dark-400 text-sm line-clamp-2 mb-4 leading-relaxed">
            {design.prompt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-dark-700/30">
            <div className="flex items-center gap-1.5 text-dark-500 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(design.createdAt)}
              {design.generationTimeMs && (
                <span className="text-dark-600 ml-2">
                  · {(design.generationTimeMs / 1000).toFixed(1)}s
                </span>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-accent-400 transition-colors transform group-hover:translate-x-1 duration-200" />
          </div>
        </div>
      </Link>

      {/* Delete button */}
      {onDelete && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(design._id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-dark-900/80 border border-dark-700/50 flex items-center justify-center text-dark-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      )}
    </motion.div>
  );
}
