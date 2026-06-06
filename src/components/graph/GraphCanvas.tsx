'use client';

import * as d3 from 'd3';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { filterGraphData, getGraphNeighborhood, getGraphNodeDetail, prepareGraphCanvasData } from '@/lib/graph';
import type { CanvasGraphEdge, CanvasGraphNode, GraphNodeKind } from '@/lib/graph';
import type { CurationStatus } from '@/lib/catalog';
import styles from './graph.module.css';

type SimNode = CanvasGraphNode & d3.SimulationNodeDatum;
type SimEdge = Omit<CanvasGraphEdge, 'source' | 'target'> & {
  source: string | SimNode;
  target: string | SimNode;
};

type FilterKey = GraphNodeKind | CurationStatus;

const kindFilters: { key: GraphNodeKind; label: string }[] = [
  { key: 'artist', label: 'Artistas' },
  { key: 'album', label: 'Discos' },
  { key: 'place', label: 'Lugares' },
];

const statusFilters: { key: CurationStatus; label: string }[] = [
  { key: 'candidate', label: 'Candidatos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'reviewed', label: 'Revisados' },
  { key: 'verified', label: 'Verificados' },
];

export function GraphCanvas() {
  const baseGraph = useMemo(() => prepareGraphCanvasData(), []);
  const [enabledKinds, setEnabledKinds] = useState<GraphNodeKind[]>(['artist', 'album', 'place']);
  const [enabledStatuses, setEnabledStatuses] = useState<CurationStatus[]>(['candidate', 'pending', 'reviewed', 'verified']);
  const [query, setQuery] = useState('');
  const filteredGraph = useMemo(
    () => filterGraphData(baseGraph, { kinds: enabledKinds, statuses: enabledStatuses, query }),
    [baseGraph, enabledKinds, enabledStatuses, query],
  );
  const [selectedNodeId, setSelectedNodeId] = useState(baseGraph.initialSelectedNodeId);
  const [nodes, setNodes] = useState<SimNode[]>([]);
  const [edges, setEdges] = useState<SimEdge[]>([]);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragViewport, setDragViewport] = useState({ width: 920, height: 620, left: 0, top: 0 });

  useEffect(() => {
    if (!filteredGraph.nodes.some((node) => node.id === selectedNodeId)) {
      setSelectedNodeId(filteredGraph.initialSelectedNodeId);
    }
  }, [filteredGraph, selectedNodeId]);

  useEffect(() => {
    const simulationNodes: SimNode[] = filteredGraph.nodes.map((node, index) => ({
      ...node,
      x: 460 + Math.cos(index) * 180,
      y: 310 + Math.sin(index) * 140,
    }));
    const simulationEdges: SimEdge[] = filteredGraph.edges.map((edge) => ({ ...edge }));

    const simulation = d3.forceSimulation<SimNode>(simulationNodes)
      .force('link', d3.forceLink<SimNode, SimEdge>(simulationEdges).id((node) => node.id).distance((edge) => 90 + edge.weight * 9).strength(0.42))
      .force('charge', d3.forceManyBody<SimNode>().strength(-280))
      .force('center', d3.forceCenter<SimNode>(460, 310))
      .force('collision', d3.forceCollide<SimNode>().radius((node) => node.radius + 18))
      .alpha(0.9)
      .on('tick', () => {
        setNodes(simulationNodes.map((node) => ({ ...node })));
        setEdges(simulationEdges.map((edge) => ({ ...edge })));
      });

    return () => {
      simulation.stop();
    };
  }, [filteredGraph]);

  useEffect(() => {
    if (!draggedNodeId) return;

    function handlePointerMove(event: PointerEvent) {
      const x = ((event.clientX - dragViewport.left) / Math.max(1, dragViewport.width)) * 920;
      const y = ((event.clientY - dragViewport.top) / Math.max(1, dragViewport.height)) * 620;
      setNodes((currentNodes) => currentNodes.map((node) => (
        node.id === draggedNodeId
          ? { ...node, x: clamp(x, 30, 890), y: clamp(y, 30, 590) }
          : node
      )));
    }

    function handlePointerUp() {
      setDraggedNodeId(null);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggedNodeId, dragViewport]);

  const selectedDetail = useMemo(() => getGraphNodeDetail(selectedNodeId), [selectedNodeId]);
  const neighborhood = useMemo(() => getGraphNeighborhood(selectedNodeId), [selectedNodeId]);

  function toggleFilter<T extends FilterKey>(value: T, current: T[], setter: (next: T[]) => void) {
    if (current.includes(value)) {
      if (current.length === 1) return;
      setter(current.filter((item) => item !== value));
      return;
    }
    setter([...current, value]);
  }

  return (
    <section className={styles.canvasShell} aria-label="Grafo interactivo del rap chileno">
      <div className={styles.canvasToolbar}>
        <div>
          <p className={styles.eyebrow}>Grafo D3 interactivo · Sprint 4</p>
          <h2>Red viva</h2>
        </div>
        <div className={styles.toolbarGroups}>
          <label className={styles.searchBox}>
            <span>Buscar en el grafo</span>
            <input
              aria-label="Buscar artista, disco, ciudad o tag"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Seo2, Chiloé, Makiza..."
              type="search"
              value={query}
            />
          </label>
          <div className={styles.filterGroup} aria-label="Filtros por tipo de nodo">
            {kindFilters.map((filter) => (
              <button
                className={enabledKinds.includes(filter.key) ? styles.activeFilter : styles.filterButton}
                key={filter.key}
                onClick={() => toggleFilter(filter.key, enabledKinds, setEnabledKinds)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className={styles.filterGroup} aria-label="Filtros por estado curatorial">
            {statusFilters.map((filter) => (
              <button
                className={enabledStatuses.includes(filter.key) ? styles.activeFilter : styles.filterButton}
                key={filter.key}
                onClick={() => toggleFilter(filter.key, enabledStatuses, setEnabledStatuses)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.graphMetaBar}>
        <span>{filteredGraph.nodes.length} nodos visibles</span>
        <span>{filteredGraph.edges.length} relaciones visibles</span>
        <span>Arrastra nodos, busca y selecciona para destacar vecinos</span>
      </div>

      <div className={styles.interactiveGrid}>
        <div className={styles.svgWrap}>
          <svg className={styles.interactiveSvg} viewBox="0 0 920 620" role="img" aria-label="Red interactiva de artistas, discos y lugares">
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            {edges.map((edge) => {
              const source = resolvePoint(edge.source);
              const target = resolvePoint(edge.target);
              const dimmed = neighborhood.isDimmedEdge(edge.id);
              return (
                <line
                  className={`${styles.liveEdge} ${dimmed ? styles.dimmedEdge : styles.focusEdge}`}
                  key={edge.id}
                  stroke={edge.color}
                  strokeWidth={edge.strokeWidth}
                  x1={source.x}
                  x2={target.x}
                  y1={source.y}
                  y2={target.y}
                />
              );
            })}
            {nodes.map((node) => {
              const dimmed = neighborhood.isDimmedNode(node.id);
              const related = selectedNodeId === node.id || selectedDetail?.neighborNodeIds.includes(node.id);
              return (
                <g
                  className={`${styles.liveNodeGroup} ${dimmed ? styles.dimmedNode : ''} ${related ? styles.relatedNode : ''}`}
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  onPointerDown={(event) => {
                    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (bounds) setDragViewport({ width: bounds.width, height: bounds.height, left: bounds.left, top: bounds.top });
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setSelectedNodeId(node.id);
                    setDraggedNodeId(node.id);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') setSelectedNodeId(node.id);
                  }}
                >
                  {selectedNodeId === node.id ? <circle className={styles.selectedHalo} cx={node.x} cy={node.y} r={node.radius + 14} /> : null}
                  {related && selectedNodeId !== node.id ? <circle className={styles.neighborHalo} cx={node.x} cy={node.y} r={node.radius + 8} /> : null}
                  <circle cx={node.x} cy={node.y} fill={node.color} r={node.radius} stroke={node.strokeColor} strokeWidth={selectedNodeId === node.id ? 4 : 2} />
                  <text x={node.x} y={(node.y ?? 0) + node.radius + 15}>{node.label.split(' · ')[0]}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className={styles.nodePanel}>
          {selectedDetail ? (
            <>
              <p className={styles.eyebrow}>{selectedDetail.kind} · {selectedDetail.curationStatus}</p>
              <h3>{selectedDetail.label}</h3>
              <div className={styles.panelStats}>
                <span>Confianza {Math.round(selectedDetail.confidence * 100)}%</span>
                <span>{selectedDetail.relationships.length} relaciones</span>
                <span>{selectedDetail.sources.length} fuentes</span>
              </div>
              {selectedDetail.href ? <Link className={styles.panelLink} href={selectedDetail.href}>Abrir ficha completa →</Link> : null}
              <h4>Relaciones</h4>
              <div className={styles.panelList}>
                {selectedDetail.relationshipSummaries.slice(0, 8).map((relationship) => (
                  <div key={relationship.id}>
                    <strong>{relationship.typeLabel}</strong>
                    <span>{relationship.display}{relationship.year ? ` · ${relationship.year}` : ''}</span>
                  </div>
                ))}
              </div>
              <h4>Fuentes</h4>
              <div className={styles.panelList}>
                {selectedDetail.sources.map((source) => (
                  <div key={source.id}>
                    <strong>{source.name}</strong>
                    <span>{source.sourceType} · {source.curationStatus}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="muted">Selecciona un nodo para ver detalle.</p>
          )}
        </aside>
      </div>
    </section>
  );
}

function resolvePoint(value: string | SimNode) {
  if (typeof value === 'string') return { x: 0, y: 0 };
  return { x: value.x ?? 0, y: value.y ?? 0 };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
