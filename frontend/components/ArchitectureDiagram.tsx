'use client';

import { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  MarkerType,
  NodeProps,
  Handle,
  Position,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';
import { StructuredAIResponse, FlowStep } from '@/lib/api';

// ==================== Custom Node Components ====================

function ServiceNode({ data }: NodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <Handle type="target" position={Position.Top} className="!bg-accent !w-2 !h-2 !border-accent/50" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-accent !w-2 !h-2 !border-accent/50" />
      <div className={`px-5 py-4 rounded-2xl border shadow-lg min-w-[180px] max-w-[220px] ${data.bgClass} ${data.borderClass} ${data.shadowClass}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-lg">{data.icon}</span>
          <span className="text-xs font-bold text-white/90 truncate">{data.label}</span>
        </div>
        {data.description && (
          <p className="text-[10px] text-white/50 leading-relaxed line-clamp-2">
            {data.description}
          </p>
        )}
        {data.tech && data.tech.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.tech.slice(0, 3).map((t: string, i: number) => (
              <span
                key={i}
                className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-white/10 text-white/60"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-accent !w-2 !h-2 !border-accent/50" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-accent !w-2 !h-2 !border-accent/50" />
    </motion.div>
  );
}

function DatabaseNode({ data }: NodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Handle type="target" position={Position.Top} className="!bg-neon-green !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-neon-green !w-2 !h-2" />
      <div className="px-5 py-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/5 min-w-[170px]">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="text-lg">🗄️</span>
          <span className="text-xs font-bold text-emerald-300 truncate">{data.label}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
          {data.dbType}
        </span>
        {data.tables && data.tables.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {data.tables.slice(0, 4).map((table: string, i: number) => (
              <p key={i} className="text-[9px] text-emerald-400/60 font-mono">
                └ {table}
              </p>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-neon-green !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-neon-green !w-2 !h-2" />
    </motion.div>
  );
}

function InfraNode({ data }: NodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Handle type="target" position={Position.Top} className="!bg-neon-orange !w-2 !h-2" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-neon-orange !w-2 !h-2" />
      <div className="px-5 py-4 rounded-2xl border border-orange-500/30 bg-orange-500/10 shadow-lg shadow-orange-500/5 min-w-[170px]">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="text-lg">{data.icon}</span>
          <span className="text-xs font-bold text-orange-300 truncate">{data.label}</span>
        </div>
        {data.description && (
          <p className="text-[10px] text-orange-400/60 leading-relaxed line-clamp-2">
            {data.description}
          </p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-neon-orange !w-2 !h-2" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-neon-orange !w-2 !h-2" />
    </motion.div>
  );
}

function GatewayNode({ data }: NodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-neon-purple !w-2.5 !h-2.5" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-neon-purple !w-2.5 !h-2.5" />
      <div className="px-6 py-4 rounded-2xl border-2 border-purple-500/40 bg-purple-500/15 shadow-xl shadow-purple-500/10 min-w-[200px]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{data.icon}</span>
          <div>
            <span className="text-sm font-bold text-purple-200">{data.label}</span>
            {data.description && (
              <p className="text-[10px] text-purple-400/60 mt-0.5">{data.description}</p>
            )}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-neon-purple !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-neon-purple !w-2.5 !h-2.5" />
    </motion.div>
  );
}

// ==================== Flow Step Node ====================

function FlowStepNode({ data }: NodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: data.delay || 0 }}
    >
      <Handle type="target" position={Position.Left} className="!bg-yellow-400 !w-2 !h-2" />
      <Handle type="target" position={Position.Top} id="top" className="!bg-yellow-400 !w-2 !h-2" />
      <div className={`px-4 py-3 rounded-xl border min-w-[160px] max-w-[200px] ${data.bgClass} ${data.borderClass}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-bold flex items-center justify-center">
            {data.stepNum}
          </span>
          <span className="text-[11px] font-bold text-white/85 truncate">{data.action}</span>
        </div>
        <p className="text-[9px] text-white/40 leading-relaxed line-clamp-2">{data.description}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">{data.from}</span>
          <span className="text-[8px] text-white/20">→</span>
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">{data.to}</span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-yellow-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-yellow-400 !w-2 !h-2" />
    </motion.div>
  );
}

// ==================== Node type mapping ====================

const nodeTypes = {
  service: ServiceNode,
  database: DatabaseNode,
  infra: InfraNode,
  gateway: GatewayNode,
  flowStep: FlowStepNode,
};

// ==================== Color palettes for services ====================
const serviceColors = [
  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', shadow: 'shadow-indigo-500/5' },
  { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', shadow: 'shadow-cyan-500/5' },
  { bg: 'bg-violet-500/10', border: 'border-violet-500/30', shadow: 'shadow-violet-500/5' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/30', shadow: 'shadow-blue-500/5' },
  { bg: 'bg-pink-500/10', border: 'border-pink-500/30', shadow: 'shadow-pink-500/5' },
  { bg: 'bg-teal-500/10', border: 'border-teal-500/30', shadow: 'shadow-teal-500/5' },
  { bg: 'bg-sky-500/10', border: 'border-sky-500/30', shadow: 'shadow-sky-500/5' },
  { bg: 'bg-rose-500/10', border: 'border-rose-500/30', shadow: 'shadow-rose-500/5' },
  { bg: 'bg-amber-500/10', border: 'border-amber-500/30', shadow: 'shadow-amber-500/5' },
  { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', shadow: 'shadow-fuchsia-500/5' },
];

const flowStepColors = [
  { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { bg: 'bg-lime-500/10', border: 'border-lime-500/30' },
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
];

const serviceIcons = ['⚡', '🔧', '📡', '🎯', '📊', '🔔', '💳', '🔐', '📁', '🌐'];

// ==================== Helpers ====================

/** Find the best matching node ID for a systemFlow entity name */
function matchEntityToNode(
  entityName: string,
  nodeMap: Map<string, string>
): string | null {
  const lower = entityName.toLowerCase();
  // Direct match
  if (nodeMap.has(lower)) return nodeMap.get(lower)!;
  // Partial match
  for (const [key, id] of nodeMap.entries()) {
    if (lower.includes(key) || key.includes(lower)) return id;
  }
  return null;
}

// ==================== Layout logic ====================

interface ArchitectureDiagramProps {
  data: StructuredAIResponse;
}

function ArchitectureDiagramInner({ data }: ArchitectureDiagramProps) {
  const flowRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = useCallback(async () => {
    if (!flowRef.current) return;
    try {
      const viewport = flowRef.current.querySelector('.react-flow__viewport') as HTMLElement;
      if (!viewport) return;

      const dataUrl = await toPng(viewport, {
        backgroundColor: '#0d0d0f',
        width: viewport.scrollWidth,
        height: viewport.scrollHeight,
        style: {
          transform: 'none',
        },
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdf = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [img.width, img.height],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
      pdf.save('architecture-diagram.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  }, []);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!data) return { initialNodes: nodes, initialEdges: edges };

    const services = data.microservices || [];
    const databases = data.databaseSchema || [];
    const infra = data.infrastructure;
    const caching = data.cachingStrategy;
    const lb = data.loadBalancing;
    const systemFlow = data.systemFlow;

    // Build a name → nodeId map for flow-based edge resolution
    const entityNodeMap = new Map<string, string>();

    // ---------- Determine layout dynamically ----------
    // Count components to decide spacing
    const svcCount = services.length;
    const dbCount = databases.length;
    const infraCount = infra?.services?.length || 0;
    const flowStepCount = systemFlow?.steps?.length || 0;

    // Adaptive spacing based on component count
    const HORIZONTAL_SPACING = svcCount > 6 ? 240 : 280;
    const VERTICAL_SPACING = 200;
    const totalContentWidth = Math.max(svcCount, dbCount, 3) * HORIZONTAL_SPACING;
    const centerX = totalContentWidth / 2;

    // Determine if the architecture has a message queue / event bus pattern
    const hasEventBus = services.some(
      (s) =>
        s.techStack?.some((t) =>
          /kafka|rabbitmq|sqs|nats|pulsar|event/i.test(t)
        ) ||
        s.name.toLowerCase().includes('queue') ||
        s.name.toLowerCase().includes('event') ||
        s.name.toLowerCase().includes('message')
    );

    const hasCache = caching && caching.tools && caching.tools.length > 0;

    // ---- Row 0: Entry points ----
    let currentY = 0;

    nodes.push({
      id: 'client',
      type: 'gateway',
      position: { x: centerX - 100, y: currentY },
      data: { label: 'Client Apps', icon: '👤', description: 'Web, Mobile, API consumers' },
    });
    entityNodeMap.set('client', 'client');
    entityNodeMap.set('client apps', 'client');
    entityNodeMap.set('user', 'client');
    entityNodeMap.set('users', 'client');
    entityNodeMap.set('browser', 'client');
    entityNodeMap.set('mobile', 'client');

    currentY += VERTICAL_SPACING;

    // ---- Row 1: Load Balancer (if present) ----
    if (lb) {
      nodes.push({
        id: 'lb',
        type: 'gateway',
        position: { x: centerX - 100, y: currentY },
        data: { label: 'Load Balancer', icon: '⚖️', description: lb.algorithm || lb.approach },
      });
      entityNodeMap.set('load balancer', 'lb');
      entityNodeMap.set('lb', 'lb');
      entityNodeMap.set('nginx', 'lb');
      entityNodeMap.set('alb', 'lb');

      edges.push({
        id: 'client-lb',
        source: 'client',
        target: 'lb',
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
      });
      currentY += VERTICAL_SPACING;
    }

    // ---- Row 2: API Gateway ----
    nodes.push({
      id: 'api-gateway',
      type: 'gateway',
      position: { x: centerX - 100, y: currentY },
      data: { label: 'API Gateway', icon: '🚪', description: 'Rate limiting, auth, routing' },
    });
    entityNodeMap.set('api gateway', 'api-gateway');
    entityNodeMap.set('gateway', 'api-gateway');
    entityNodeMap.set('api', 'api-gateway');

    edges.push({
      id: lb ? 'lb-gateway' : 'client-gateway',
      source: lb ? 'lb' : 'client',
      target: 'api-gateway',
      animated: true,
      style: { stroke: '#a855f7', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
    });
    currentY += VERTICAL_SPACING;

    // ---- Row 3: Microservices (dynamic layout) ----
    const serviceRowY = currentY;
    // Arrange services in a grid if there are many, otherwise single row
    const maxPerRow = svcCount > 6 ? Math.ceil(svcCount / 2) : svcCount;
    const serviceRows = Math.ceil(svcCount / maxPerRow);

    services.forEach((svc, i) => {
      const color = serviceColors[i % serviceColors.length];
      const nodeId = `svc-${i}`;
      const row = Math.floor(i / maxPerRow);
      const col = i % maxPerRow;
      const rowItemCount = Math.min(maxPerRow, svcCount - row * maxPerRow);
      const rowWidth = rowItemCount * HORIZONTAL_SPACING;
      const rowStartX = centerX - rowWidth / 2;

      nodes.push({
        id: nodeId,
        type: 'service',
        position: {
          x: rowStartX + col * HORIZONTAL_SPACING,
          y: serviceRowY + row * (VERTICAL_SPACING * 0.9) + (col % 2 === 0 ? 0 : 30),
        },
        data: {
          label: svc.name,
          description: svc.description,
          icon: serviceIcons[i % serviceIcons.length],
          tech: svc.techStack || [],
          bgClass: color.bg,
          borderClass: color.border,
          shadowClass: color.shadow,
        },
      });

      // Register in entity map for flow matching
      entityNodeMap.set(svc.name.toLowerCase(), nodeId);
      // Also register simplified names (e.g., "User Service" → "user")
      const simpleName = svc.name.toLowerCase().replace(/\s*(service|svc|server|handler|manager)\s*/g, '').trim();
      if (simpleName) entityNodeMap.set(simpleName, nodeId);

      // Connect gateway to service
      edges.push({
        id: `gw-${nodeId}`,
        source: 'api-gateway',
        target: nodeId,
        type: 'smoothstep',
        style: { stroke: '#6366f1', strokeWidth: 1.5, opacity: 0.6 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
      });

      // Inter-service dependency links
      if (svc.dependencies) {
        svc.dependencies.forEach((dep) => {
          const depIdx = services.findIndex(
            (s) =>
              s.name.toLowerCase().includes(dep.toLowerCase()) ||
              dep.toLowerCase().includes(s.name.toLowerCase())
          );
          if (depIdx !== -1 && depIdx !== i) {
            edges.push({
              id: `dep-${i}-${depIdx}`,
              source: nodeId,
              target: `svc-${depIdx}`,
              type: 'smoothstep',
              style: { stroke: '#565869', strokeWidth: 1, strokeDasharray: '6 3' },
              animated: false,
            });
          }
        });
      }
    });

    currentY = serviceRowY + serviceRows * VERTICAL_SPACING + 30;

    // ---- Event Bus / Message Queue (only if detected) ----
    if (hasEventBus) {
      const busId = 'event-bus';
      nodes.push({
        id: busId,
        type: 'infra',
        position: { x: centerX - 100, y: currentY },
        data: {
          label: 'Message Bus',
          icon: '📨',
          description: 'Async event-driven communication',
        },
      });
      entityNodeMap.set('message bus', busId);
      entityNodeMap.set('event bus', busId);
      entityNodeMap.set('kafka', busId);
      entityNodeMap.set('rabbitmq', busId);
      entityNodeMap.set('queue', busId);

      // Connect event-producing services to bus
      services.forEach((svc, i) => {
        const isEventRelated =
          svc.techStack?.some((t) => /kafka|rabbitmq|sqs|nats|pulsar|event/i.test(t)) ||
          svc.dependencies?.some((d) => /queue|event|message|kafka/i.test(d));
        if (isEventRelated) {
          edges.push({
            id: `svc-${i}-bus`,
            source: `svc-${i}`,
            target: busId,
            type: 'smoothstep',
            style: { stroke: '#f97316', strokeWidth: 1.5, opacity: 0.7, strokeDasharray: '4 4' },
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
          });
        }
      });
      currentY += VERTICAL_SPACING;
    }

    // ---- Cache layer (positioned to the side if event bus exists) ----
    if (hasCache) {
      const cacheX = hasEventBus
        ? totalContentWidth - 100 // to the right side
        : centerX - totalContentWidth / 3;

      nodes.push({
        id: 'cache',
        type: 'infra',
        position: { x: cacheX, y: currentY - (hasEventBus ? VERTICAL_SPACING : 0) },
        data: {
          label: `Cache (${caching!.tools.join(', ')})`,
          icon: '⚡',
          description: caching!.approach,
        },
      });
      entityNodeMap.set('cache', 'cache');
      entityNodeMap.set('redis', 'cache');
      entityNodeMap.set('memcached', 'cache');
      entityNodeMap.set('cdn', 'cache');

      const cacheConnections = Math.min(3, svcCount);
      for (let i = 0; i < cacheConnections; i++) {
        edges.push({
          id: `svc-${i}-cache`,
          source: `svc-${i}`,
          target: 'cache',
          type: 'smoothstep',
          style: { stroke: '#f97316', strokeWidth: 1, opacity: 0.5 },
        });
      }

      if (!hasEventBus) currentY += VERTICAL_SPACING * 0.7;
    }

    // ---- Databases (dynamic layout based on count) ----
    const dbRowY = currentY + 20;
    // Fan out databases in an arc if > 2, otherwise center them
    databases.forEach((db, i) => {
      const nodeId = `db-${i}`;
      let posX: number;
      if (dbCount === 1) {
        posX = centerX - 85;
      } else if (dbCount === 2) {
        posX = centerX - HORIZONTAL_SPACING / 2 + i * HORIZONTAL_SPACING;
      } else {
        // Arc layout: spread around center with slight curve
        const angle = ((i / (dbCount - 1)) - 0.5) * Math.PI * 0.4;
        const radius = totalContentWidth * 0.35;
        posX = centerX + Math.sin(angle) * radius - 85;
      }

      nodes.push({
        id: nodeId,
        type: 'database',
        position: {
          x: posX,
          y: dbRowY + (dbCount > 2 ? Math.abs(i - (dbCount - 1) / 2) * 30 : 0),
        },
        data: {
          label: db.name,
          dbType: db.type,
          tables: db.tables?.map((t) => t.name) || [],
        },
      });

      entityNodeMap.set(db.name.toLowerCase(), nodeId);
      const simpleDbName = db.name.toLowerCase().replace(/\s*(database|db|store|storage)\s*/g, '').trim();
      if (simpleDbName) entityNodeMap.set(simpleDbName, nodeId);

      // Connect related services to databases
      const connectCount = Math.max(1, Math.floor(svcCount / dbCount));
      for (let s = i * connectCount; s < Math.min((i + 1) * connectCount, svcCount); s++) {
        edges.push({
          id: `svc-${s}-${nodeId}`,
          source: `svc-${s}`,
          target: nodeId,
          type: 'smoothstep',
          style: { stroke: '#22c55e', strokeWidth: 1.5, opacity: 0.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' },
        });
      }
    });

    currentY = dbRowY + VERTICAL_SPACING;

    // ---- Infrastructure nodes (staggered layout) ----
    if (infra && infra.services && infra.services.length > 0) {
      const infraIcons = ['☁️', '🖥️', '📦', '🔒', '📊', '🌍'];
      const infraItems = infra.services.slice(0, 5);
      const infraWidth = infraItems.length * 220;
      const infraStartX = centerX - infraWidth / 2;

      infraItems.forEach((svc, i) => {
        nodes.push({
          id: `infra-${i}`,
          type: 'infra',
          position: {
            x: infraStartX + i * 220,
            y: currentY + (i % 2 === 0 ? 0 : 35),
          },
          data: {
            label: svc.name,
            icon: infraIcons[i % infraIcons.length],
            description: svc.purpose,
          },
        });
        entityNodeMap.set(svc.name.toLowerCase(), `infra-${i}`);
      });
    }

    // ---- System Flow: add flow-based edges from systemFlow.steps ----
    if (systemFlow && systemFlow.steps && systemFlow.steps.length > 0) {
      const addedEdges = new Set<string>();

      systemFlow.steps.forEach((step: FlowStep) => {
        const sourceId = matchEntityToNode(step.from, entityNodeMap);
        const targetId = matchEntityToNode(step.to, entityNodeMap);

        if (sourceId && targetId && sourceId !== targetId) {
          const edgeKey = `${sourceId}-${targetId}`;
          if (!addedEdges.has(edgeKey)) {
            addedEdges.add(edgeKey);
            edges.push({
              id: `flow-${step.step}-${edgeKey}`,
              source: sourceId,
              target: targetId,
              type: 'smoothstep',
              label: step.action,
              labelStyle: { fill: '#9ca3af', fontSize: 9, fontWeight: 600 },
              labelBgStyle: { fill: '#0d0d0f', fillOpacity: 0.85 },
              labelBgPadding: [6, 3] as [number, number],
              labelBgBorderRadius: 4,
              style: { stroke: '#eab308', strokeWidth: 1.8, opacity: 0.7 },
              animated: true,
              markerEnd: { type: MarkerType.ArrowClosed, color: '#eab308' },
            });
          }
        }
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  if (!data || (!data.microservices?.length && !data.databaseSchema?.length)) {
    return (
      <div className="flex items-center justify-center h-[500px] text-dark-400">
        No architecture data to visualize
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Download PDF Button */}
      <div className="absolute top-3 right-3 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-800/80 border border-dark-600/50 hover:border-accent/40 hover:bg-dark-700/80 text-dark-300 hover:text-white backdrop-blur-sm transition-all duration-200 text-sm font-medium shadow-lg"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </motion.button>
      </div>

      <div ref={flowRef} className="w-full h-[700px] rounded-2xl overflow-hidden border border-dark-700/50 bg-dark-950">
        <ReactFlow
          nodes={nodes}
          edges={edgesState}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{ padding: 0.15, maxZoom: 1.2 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(99, 102, 241, 0.08)"
          />
          <Controls
            showInteractive={false}
            className="!bottom-4 !left-4"
          />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'service') return '#6366f1';
              if (node.type === 'database') return '#22c55e';
              if (node.type === 'infra') return '#f97316';
              if (node.type === 'gateway') return '#a855f7';
              if (node.type === 'flowStep') return '#eab308';
              return '#565869';
            }}
            maskColor="rgba(13, 13, 15, 0.8)"
            className="!bottom-4 !right-4"
            pannable
            zoomable
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function ArchitectureDiagram({ data }: ArchitectureDiagramProps) {
  return (
    <ReactFlowProvider>
      <ArchitectureDiagramInner data={data} />
    </ReactFlowProvider>
  );
}
