'use client';

import dynamic from 'next/dynamic';
import DesignForm from '@/components/DesignForm';
import Preloader from '@/components/Preloader';
import { motion } from 'framer-motion';
import {
  Cpu,
  Zap,
  Globe as GlobeIcon,
  Layers,
  ArrowRight,
  Database,
  Server,
  Network,
} from 'lucide-react';
import Link from 'next/link';

const Globe = dynamic(() => import('@/components/Globe'), { ssr: false });

const STATS = [
  { value: '8', label: 'Architecture Sections' },
  { value: '70B', label: 'LLaMA Parameters' },
  { value: '<15s', label: 'Generation Time' },
  { value: '∞', label: 'Design Possibilities' },
];

const FEATURES = [
  {
    icon: Server,
    title: 'Microservices',
    desc: 'Complete service decomposition with responsibilities, tech stacks, and communication patterns.',
    color: 'from-indigo-500/20 to-indigo-500/5',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Database,
    title: 'Database Design',
    desc: 'Schema design with entity relationships, indexing strategies, and replication configs.',
    color: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-400',
  },
  {
    icon: Network,
    title: 'API Architecture',
    desc: 'RESTful endpoints, GraphQL schemas, WebSocket channels, and authentication flows.',
    color: 'from-cyan-500/20 to-cyan-500/5',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Layers,
    title: 'Infrastructure',
    desc: 'Cloud deployment, CDN configs, load balancers, auto-scaling, and monitoring.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
  },
];

export default function HomePage() {
  return (
    <Preloader
      label="SysDesign AI"
      subtitle="Initializing architecture engine..."
      duration={2200}
      icon="cpu"
    >
      <div className="relative">
        {/* =========== HERO SECTION =========== */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background accents */}
          <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/[0.03] rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8 z-10">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 float-animation"
                >
                  <Zap className="w-3.5 h-3.5 text-accent-400" />
                  <span className="text-xs font-semibold text-accent-300 tracking-wide uppercase">
                    Powered by LLaMA 3.3 70B
                  </span>
                </motion.div>

                {/* Main headline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="space-y-3"
                >
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
                    <span className="text-gradient">Architect</span>
                    <br />
                    <span className="text-white">at the speed</span>
                    <br />
                    <span className="text-white">of thought.</span>
                  </h1>
                </motion.div>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="text-dark-400 text-lg sm:text-xl max-w-lg leading-relaxed"
                >
                  Describe any system. Get a complete production-grade architecture—
                  microservices, databases, APIs, caching, load balancing, and
                  interactive diagrams—in seconds.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <a
                    href="#generator"
                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-accent hover:bg-accent-600 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-accent/40"
                  >
                    Start Designing
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-7 py-3.5 border border-dark-600/50 hover:border-dark-500 text-dark-300 hover:text-white font-medium rounded-2xl transition-all duration-200"
                  >
                    View Designs
                  </Link>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex items-center gap-8 pt-4"
                >
                  {STATS.map((stat) => (
                    <div key={stat.label} className="stat-item">
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-dark-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right: Globe */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
                className="relative hidden lg:flex items-center justify-center"
              >
                <div className="w-[520px] h-[520px] relative">
                  <Globe size={520} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =========== GRADIENT LINE SEPARATOR =========== */}
        <div className="gradient-line" />

        {/* =========== FEATURES SECTION =========== */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16 space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dark-700/50 bg-dark-800/30 text-dark-400 text-xs font-medium">
                <GlobeIcon className="w-3 h-3" /> Complete Architecture Coverage
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Every layer, <span className="text-gradient">every detail.</span>
              </h2>
              <p className="text-dark-400 max-w-2xl mx-auto text-lg">
                Our AI generates 8 comprehensive architecture sections covering every
                aspect of your system from frontend to infrastructure.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative p-6 rounded-2xl border border-dark-700/40 bg-dark-900/30 hover:border-dark-600/60 transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-b ${feature.color} flex items-center justify-center mb-4 border border-white/5`}
                  >
                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========== GRADIENT LINE SEPARATOR =========== */}
        <div className="gradient-line" />

        {/* =========== GENERATOR SECTION =========== */}
        <section id="generator" className="py-24 relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/[0.02] rounded-full blur-[150px]" />
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dark-700/50 bg-dark-800/30 text-dark-400 text-xs font-medium">
                <Cpu className="w-3 h-3" /> AI Design Generator
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                What will you <span className="text-gradient">build?</span>
              </h2>
              <p className="text-dark-400 max-w-xl mx-auto">
                Describe your system in plain English. Our AI will generate a
                complete architecture breakdown in seconds.
              </p>
            </motion.div>

            <DesignForm />
          </div>
        </section>

        {/* =========== BOTTOM CTA =========== */}
        <section className="py-20 relative">
          <div className="gradient-line mb-20" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              Ready to architect your next system?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-dark-400 text-lg max-w-xl mx-auto"
            >
              Join engineers using AI to design scalable, production-ready architectures.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <a
                href="#generator"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-600 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-accent/40"
              >
                Start Designing Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </Preloader>
  );
}
