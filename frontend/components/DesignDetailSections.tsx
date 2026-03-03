'use client';

import { motion } from 'framer-motion';
import {
  Server,
  Database,
  Globe,
  Zap,
  Scale,
  Cloud,
  ArrowRight,
  Shield,
  HardDrive,
  Code,
} from 'lucide-react';
import { StructuredAIResponse } from '@/lib/api';
import { StaggerContainer, StaggerItem } from './PageTransition';

interface DesignDetailSectionsProps {
  data: StructuredAIResponse;
}

export default function DesignDetailSections({ data }: DesignDetailSectionsProps) {
  return (
    <div className="space-y-8">
      {/* Microservices */}
      <Section
        icon={Server}
        title="Microservices Architecture"
        color="text-indigo-400"
        bgColor="bg-indigo-500/10"
      >
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.microservices?.map((svc, i) => (
            <StaggerItem key={i}>
              <div className="p-5 rounded-xl border border-dark-700/40 bg-dark-900/40 hover:border-indigo-500/20 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                    <Server className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">{svc.name}</h4>
                </div>
                <p className="text-dark-400 text-xs mb-3 leading-relaxed">{svc.description}</p>

                {svc.responsibilities?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] uppercase tracking-wider text-dark-500 mb-1.5">Responsibilities</p>
                    <div className="space-y-1">
                      {svc.responsibilities.map((r, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <ArrowRight className="w-3 h-3 text-indigo-500/50 mt-0.5 shrink-0" />
                          <span className="text-xs text-dark-300">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {svc.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {svc.techStack.map((tech, j) => (
                      <span key={j} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      {/* Database Schema */}
      <Section
        icon={Database}
        title="Database Schema"
        color="text-emerald-400"
        bgColor="bg-emerald-500/10"
      >
        <StaggerContainer className="space-y-4">
          {data.databaseSchema?.map((db, i) => (
            <StaggerItem key={i}>
              <div className="p-5 rounded-xl border border-dark-700/40 bg-dark-900/40">
                <div className="flex items-center gap-3 mb-4">
                  <HardDrive className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-semibold text-white">{db.name}</h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    {db.type}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {db.tables?.map((table, j) => (
                    <div key={j} className="p-3 rounded-lg bg-dark-800/60 border border-dark-700/30">
                      <p className="text-xs font-mono font-semibold text-emerald-300 mb-2">
                        {table.name}
                      </p>
                      <div className="space-y-1">
                        {table.fields?.map((field, k) => (
                          <div key={k} className="flex items-center gap-2 text-[11px]">
                            <span className="text-dark-300 font-mono">{field.name}</span>
                            <span className="text-dark-500">·</span>
                            <span className="text-dark-400">{field.type}</span>
                            {field.constraints && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-dark-700/50 text-dark-400">
                                {field.constraints}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      {/* API Endpoints */}
      <Section
        icon={Code}
        title="API Endpoints"
        color="text-cyan-400"
        bgColor="bg-cyan-500/10"
      >
        <StaggerContainer className="space-y-4">
          {data.apiEndpoints?.map((apiSvc, i) => (
            <StaggerItem key={i}>
              <div className="p-5 rounded-xl border border-dark-700/40 bg-dark-900/40">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  {apiSvc.service}
                </h4>
                <div className="space-y-2">
                  {apiSvc.endpoints?.map((ep, j) => (
                    <div key={j} className="flex items-center gap-3 p-2.5 rounded-lg bg-dark-800/40 border border-dark-700/20">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded font-mono ${
                        ep.method === 'GET' ? 'bg-green-500/15 text-green-400' :
                        ep.method === 'POST' ? 'bg-blue-500/15 text-blue-400' :
                        ep.method === 'PUT' ? 'bg-yellow-500/15 text-yellow-400' :
                        ep.method === 'PATCH' ? 'bg-orange-500/15 text-orange-400' :
                        'bg-red-500/15 text-red-400'
                      }`}>
                        {ep.method}
                      </span>
                      <code className="text-xs text-dark-200 font-mono flex-1">{ep.path}</code>
                      {ep.auth && (
                        <Shield className="w-3.5 h-3.5 text-yellow-500/50" />
                      )}
                      <span className="text-[10px] text-dark-500 hidden sm:block max-w-[200px] truncate">
                        {ep.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      {/* Caching Strategy */}
      <Section
        icon={Zap}
        title="Caching Strategy"
        color="text-yellow-400"
        bgColor="bg-yellow-500/10"
      >
        <div className="p-5 rounded-xl border border-dark-700/40 bg-dark-900/40 space-y-4">
          <p className="text-sm text-dark-300 leading-relaxed">{data.cachingStrategy?.approach}</p>

          {data.cachingStrategy?.tools?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.cachingStrategy.tools.map((tool, i) => (
                <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                  {tool}
                </span>
              ))}
            </div>
          )}

          {data.cachingStrategy?.layers?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {data.cachingStrategy.layers.map((layer, i) => (
                <div key={i} className="p-3 rounded-lg bg-dark-800/60 border border-dark-700/30">
                  <p className="text-xs font-semibold text-yellow-300">{layer.name}</p>
                  <p className="text-[11px] text-dark-400 mt-1">{layer.description}</p>
                  {layer.ttl && (
                    <p className="text-[10px] text-dark-500 mt-1">TTL: {layer.ttl}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Load Balancing */}
      <Section
        icon={Scale}
        title="Load Balancing"
        color="text-purple-400"
        bgColor="bg-purple-500/10"
      >
        <div className="p-5 rounded-xl border border-dark-700/40 bg-dark-900/40 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
              {data.loadBalancing?.algorithm}
            </span>
            {data.loadBalancing?.tools?.map((tool, i) => (
              <span key={i} className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-dark-700/50 text-dark-300">
                {tool}
              </span>
            ))}
          </div>
          <p className="text-sm text-dark-300 leading-relaxed">{data.loadBalancing?.approach}</p>
          {data.loadBalancing?.details && (
            <p className="text-xs text-dark-400 leading-relaxed">{data.loadBalancing.details}</p>
          )}
        </div>
      </Section>

      {/* Scaling Strategy */}
      <Section
        icon={Scale}
        title="Scaling Strategy"
        color="text-blue-400"
        bgColor="bg-blue-500/10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Horizontal */}
          <div className="p-5 rounded-xl border border-dark-700/40 bg-dark-900/40">
            <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-3">
              Horizontal Scaling
            </h4>
            <p className="text-xs text-dark-300 mb-3 leading-relaxed">
              {data.scalingStrategy?.horizontal?.description}
            </p>
            {data.scalingStrategy?.horizontal?.autoScalingRules?.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] text-dark-500 uppercase tracking-wider">Auto-Scaling Rules</p>
                {data.scalingStrategy.horizontal.autoScalingRules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-dark-400">
                    <ArrowRight className="w-3 h-3 text-blue-500/50 mt-0.5 shrink-0" />
                    {rule}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vertical */}
          <div className="p-5 rounded-xl border border-dark-700/40 bg-dark-900/40">
            <h4 className="text-xs font-bold text-orange-300 uppercase tracking-wider mb-3">
              Vertical Scaling
            </h4>
            <p className="text-xs text-dark-300 mb-3 leading-relaxed">
              {data.scalingStrategy?.vertical?.description}
            </p>
            {data.scalingStrategy?.vertical?.services?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {data.scalingStrategy.vertical.services.map((svc, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
                    {svc}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Infrastructure */}
      <Section
        icon={Cloud}
        title="Infrastructure"
        color="text-sky-400"
        bgColor="bg-sky-500/10"
      >
        <div className="p-5 rounded-xl border border-dark-700/40 bg-dark-900/40 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 text-sm font-bold rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/20">
              {data.infrastructure?.cloudProvider}
            </span>
            {data.infrastructure?.regions?.map((region, i) => (
              <span key={i} className="px-2.5 py-1 text-[10px] font-mono rounded-full bg-dark-700/50 text-dark-300">
                {region}
              </span>
            ))}
            {data.infrastructure?.estimatedCost && (
              <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-green-500/10 text-green-400">
                Est: {data.infrastructure.estimatedCost}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.infrastructure?.services?.map((svc, i) => (
              <div key={i} className="p-3 rounded-lg bg-dark-800/60 border border-dark-700/30">
                <p className="text-xs font-semibold text-sky-300">{svc.name}</p>
                <p className="text-[10px] text-dark-400 mt-1">{svc.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* System Flow */}
      <Section
        icon={ArrowRight}
        title="System Flow"
        color="text-pink-400"
        bgColor="bg-pink-500/10"
      >
        <div className="p-5 rounded-xl border border-dark-700/40 bg-dark-900/40 space-y-4">
          <p className="text-sm text-dark-300 leading-relaxed">{data.systemFlow?.description}</p>

          <div className="space-y-3">
            {data.systemFlow?.steps?.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-3 rounded-lg bg-dark-800/40 border border-dark-700/20"
              >
                <div className="w-7 h-7 rounded-full bg-pink-500/15 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-pink-400">{step.step}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">{step.action}</p>
                  <p className="text-[10px] text-dark-400 mt-0.5">
                    {step.from} → {step.to}
                  </p>
                  <p className="text-[11px] text-dark-300 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

// ==================== Section wrapper ====================

function Section({
  icon: Icon,
  title,
  color,
  bgColor,
  children,
}: {
  icon: any;
  title: string;
  color: string;
  bgColor: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      {children}
    </motion.section>
  );
}
