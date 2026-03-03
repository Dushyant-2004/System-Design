'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Search, Plus, RefreshCw, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import Preloader from '@/components/Preloader';
import DesignCard from '@/components/DesignCard';
import { SkeletonCard } from '@/components/LoadingSpinner';
import { api, Design, ApiError } from '@/lib/api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchDesigns = useCallback(
    async (pageNum = 1, searchQuery = '') => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.getDesigns(pageNum, 12, searchQuery || undefined);
        setDesigns(result.data);
        setTotalPages(result.meta.totalPages);
        setPage(pageNum);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Failed to load designs. Please try again later.';
        setError(message);
        toast.error('Failed to load designs', { description: message });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchDesigns(1, search);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDesigns(1, search);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;

    try {
      await api.deleteDesign(id);
      setDesigns((prev) => prev.filter((d) => d._id !== id));
      toast.success('Design deleted');
    } catch (err) {
      toast.error('Failed to delete design');
    }
  };

  return (
    <Preloader
      label="Dashboard"
      subtitle="Loading your designs..."
      duration={1400}
      icon="dashboard"
    >
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-dark-400 text-sm">Your system design history</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="flex-1 sm:flex-initial relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type="text"
                placeholder="Search designs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 bg-dark-800/60 border border-dark-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-dark-500 focus:ring-2 focus:ring-accent/30 focus:border-accent/30 outline-none transition-all"
              />
            </form>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchDesigns(page, search)}
              className="w-10 h-10 rounded-xl border border-dark-700/50 bg-dark-800/60 flex items-center justify-center text-dark-400 hover:text-white hover:border-accent/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>

            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-600 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-accent/20"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:block">New Design</span>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
          >
            {error}
            <button
              onClick={() => fetchDesigns(1, search)}
              className="ml-3 text-red-400 underline hover:text-red-300"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && designs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-dark-800/50 border border-dark-700/50 flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-dark-500" />
            </div>
            <h3 className="text-lg font-semibold text-dark-300">No designs yet</h3>
            <p className="text-dark-500 text-sm text-center max-w-sm">
              Start by generating your first system design. Describe any system and the AI will architect it for you.
            </p>
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-600 text-white font-medium rounded-xl transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                Create First Design
              </motion.div>
            </Link>
          </motion.div>
        )}

        {/* Design Grid */}
        {!loading && designs.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {designs.map((design, i) => (
                <DesignCard
                  key={design._id}
                  design={design}
                  index={i}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => fetchDesigns(page - 1, search)}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-dark-700/50 bg-dark-800/40 text-dark-300 disabled:opacity-30 hover:border-accent/30 hover:text-white transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-dark-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => fetchDesigns(page + 1, search)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-dark-700/50 bg-dark-800/40 text-dark-300 disabled:opacity-30 hover:border-accent/30 hover:text-white transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
    </Preloader>
  );
}
