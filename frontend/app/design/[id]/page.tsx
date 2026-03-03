'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Zap,
  Share2,
  Trash2,
  Workflow,
  List,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import DesignDetailSections from '@/components/DesignDetailSections';
import LoadingSpinner from '@/components/LoadingSpinner';
import { api, Design, ApiError } from '@/lib/api';
import { toast } from 'sonner';

type ViewMode = 'diagram' | 'details';

export default function DesignPage() {
  const params = useParams();
  const router = useRouter();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('diagram');

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await api.getDesign(params.id as string);
        setDesign(result.data);
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'Failed to load design';
        setError(message);
        toast.error('Error', { description: message });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchDesign();
  }, [params.id]);

  const handleDelete = async () => {
    if (!design) return;
    if (!confirm('Are you sure you want to delete this design?')) return;

    try {
      await api.deleteDesign(design._id);
      toast.success('Design deleted');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to delete design');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <LoadingSpinner message="Loading design..." subMessage="Fetching system architecture data" />
      </div>
    );
  }

  if (error || !design) {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Design not found</h2>
          <p className="text-dark-400 mb-6">{error || 'The requested design could not be loaded.'}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-600 text-white font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </PageTransition>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="w-9 h-9 rounded-xl border border-dark-700/50 bg-dark-800/60 flex items-center justify-center text-dark-400 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="w-9 h-9 rounded-xl border border-dark-700/50 bg-dark-800/60 flex items-center justify-center text-dark-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Design header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 sm:p-8 mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{design.title}</h1>
          <p className="text-dark-400 text-sm leading-relaxed mb-4">{design.prompt}</p>

          <div className="flex items-center gap-4 flex-wrap text-xs text-dark-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(design.createdAt)}
            </span>
            {design.generationTimeMs && (
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                Generated in {(design.generationTimeMs / 1000).toFixed(1)}s
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 font-medium">
              {design.status}
            </span>
          </div>
        </motion.div>

        {/* View mode tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setViewMode('diagram')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'diagram'
                ? 'bg-accent/15 text-white border border-accent/30'
                : 'text-dark-400 hover:text-white hover:bg-dark-800/50 border border-transparent'
            }`}
          >
            <Workflow className="w-4 h-4" />
            Architecture Diagram
          </button>
          <button
            onClick={() => setViewMode('details')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'details'
                ? 'bg-accent/15 text-white border border-accent/30'
                : 'text-dark-400 hover:text-white hover:bg-dark-800/50 border border-transparent'
            }`}
          >
            <List className="w-4 h-4" />
            Detailed Breakdown
          </button>
        </div>

        {/* Content */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'diagram' ? (
            <ArchitectureDiagram data={design.structuredAIResponse} />
          ) : (
            <DesignDetailSections data={design.structuredAIResponse} />
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
