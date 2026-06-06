import { albums, artists, getAlbumArtist, getRelationshipEdges, places, relationships } from './catalog';
import type { CurationStatus, Relationship, Source, SourceType } from './catalog';
import { getSourcesForEntity, getSourcesForRelationship } from './sources';

export type GraphNodeKind = 'artist' | 'album' | 'place';

export type GraphNode = {
  id: string;
  label: string;
  kind: GraphNodeKind;
  curationStatus: CurationStatus;
  confidence: number;
  sourceIds: string[];
  sourceType: SourceType;
  href?: string;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  relationshipType: string;
  weight: number;
  curationStatus: CurationStatus;
  confidence: number;
  sourceIds: string[];
  year?: number;
};

export type GraphRelationshipSummary = {
  id: string;
  sourceId: string;
  targetId: string;
  sourceLabel: string;
  targetLabel: string;
  typeLabel: string;
  display: string;
  year?: number;
  curationStatus: CurationStatus;
  confidence: number;
  promotedFromCandidateId?: string;
  notes?: string;
};

export type CanvasGraphNode = GraphNode & {
  radius: number;
  color: string;
  strokeColor: string;
};

export type CanvasGraphEdge = GraphEdge & {
  strokeWidth: number;
  color: string;
};

export type GraphCanvasData = {
  nodes: CanvasGraphNode[];
  edges: CanvasGraphEdge[];
  nodeIds: Set<string>;
  initialSelectedNodeId: string;
};

export type GraphFilter = {
  kinds?: GraphNodeKind[];
  statuses?: CurationStatus[];
  query?: string;
};

export type GraphNodeDetail = CanvasGraphNode & {
  sources: Source[];
  relationships: Relationship[];
  relationshipSummaries: GraphRelationshipSummary[];
  neighborNodeIds: string[];
  edgeIds: string[];
};

export type GraphNeighborhood = {
  selectedNodeIds: Set<string>;
  neighborNodeIds: Set<string>;
  edgeIds: Set<string>;
  isDimmedNode: (nodeId: string) => boolean;
  isDimmedEdge: (edgeId: string) => boolean;
};

const kindColor: Record<GraphNodeKind, string> = {
  artist: '#1ed760',
  album: '#7170ff',
  place: '#2dd4bf',
};

const statusStroke: Record<CurationStatus, string> = {
  pending: '#f59e0b',
  candidate: '#f7f8f8',
  reviewed: '#2dd4bf',
  verified: '#1ed760',
  rejected: '#ef4444',
};

const relationshipTypeLabels: Record<Relationship['relationshipType'], string> = {
  collaborated_with: 'colaboró con',
  member_of: 'integrante de',
  released: 'publicó',
  from_place: 'desde',
  associated_with_era: 'asociado a era',
};

export function getGraphNodes(): GraphNode[] {
  return [
    ...artists.map((artist) => ({
      id: artist.id,
      label: artist.name,
      kind: 'artist' as const,
      curationStatus: artist.curationStatus,
      confidence: artist.confidence,
      sourceIds: artist.sourceIds,
      sourceType: artist.sourceType,
      href: `/artists/${artist.slug}`,
    })),
    ...albums.map((album) => {
      const artist = getAlbumArtist(album);
      return {
        id: album.id,
        label: artist ? `${album.title} · ${artist.name}` : album.title,
        kind: 'album' as const,
        curationStatus: album.curationStatus,
        confidence: album.confidence,
        sourceIds: album.sourceIds,
        sourceType: album.sourceType,
        href: `/albums/${album.slug}`,
      };
    }),
    ...places.map((place) => ({
      id: place.id,
      label: place.name,
      kind: 'place' as const,
      curationStatus: place.curationStatus,
      confidence: place.confidence,
      sourceIds: place.sourceIds,
      sourceType: place.sourceType,
    })),
  ];
}

export function getGraphEdges(): GraphEdge[] {
  return getRelationshipEdges().map((relationship) => ({
    id: relationship.id,
    source: relationship.source,
    target: relationship.target,
    relationshipType: relationship.relationshipType,
    weight: relationship.weight,
    curationStatus: relationship.curationStatus,
    confidence: relationship.confidence,
    sourceIds: relationship.sourceIds,
    year: relationship.year,
  }));
}

export function prepareGraphCanvasData(): GraphCanvasData {
  const nodes = getGraphNodes().map((node) => ({
    ...node,
    radius: Math.max(8, Math.round(10 + node.confidence * 18 + (node.kind === 'artist' ? 5 : 0))),
    color: kindColor[node.kind],
    strokeColor: statusStroke[node.curationStatus],
  }));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = getGraphEdges()
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map((edge) => ({
      ...edge,
      strokeWidth: Math.max(1, edge.weight * 0.75),
      color: statusStroke[edge.curationStatus],
    }));

  return {
    nodes,
    edges,
    nodeIds,
    initialSelectedNodeId: nodes.find((node) => node.id === 'artist-ana-tijoux')?.id ?? nodes[0]?.id ?? '',
  };
}

export function filterGraphData(graph: GraphCanvasData, filter: GraphFilter): GraphCanvasData {
  const allowedKinds = new Set(filter.kinds ?? ['artist', 'album', 'place']);
  const allowedStatuses = new Set(filter.statuses ?? ['pending', 'candidate', 'reviewed', 'verified', 'rejected']);
  const query = normalizeSearch(filter.query ?? '');
  const nodes = graph.nodes.filter((node) => allowedKinds.has(node.kind) && allowedStatuses.has(node.curationStatus) && matchesGraphQuery(node, query));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = graph.edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));

  return {
    nodes,
    edges,
    nodeIds,
    initialSelectedNodeId: nodes.some((node) => node.id === graph.initialSelectedNodeId) ? graph.initialSelectedNodeId : nodes[0]?.id ?? '',
  };
}

export function getRelationshipSummary(relationshipId: string): GraphRelationshipSummary | undefined {
  const relationship = relationships.find((candidate) => candidate.id === relationshipId);
  if (!relationship) return undefined;

  const source = getGraphNodeById(relationship.source);
  const target = getGraphNodeById(relationship.target);
  if (!source || !target) return undefined;

  const sourceLabel = source.label.split(' · ')[0];
  const targetLabel = target.label.split(' · ')[0];
  const typeLabel = relationshipTypeLabels[relationship.relationshipType];

  return {
    id: relationship.id,
    sourceId: relationship.source,
    targetId: relationship.target,
    sourceLabel,
    targetLabel,
    typeLabel,
    display: `${sourceLabel} → ${typeLabel} → ${targetLabel}`,
    year: relationship.year,
    curationStatus: relationship.curationStatus,
    confidence: relationship.confidence,
    promotedFromCandidateId: relationship.promotedFromCandidateId,
    notes: relationship.notes,
  };
}

export function getGraphNeighborhood(nodeId: string): GraphNeighborhood {
  const selectedNodeIds = new Set<string>(nodeId ? [nodeId] : []);
  const neighborNodeIds = new Set<string>();
  const edgeIds = new Set<string>();

  relationships.forEach((relationship) => {
    if (relationship.source !== nodeId && relationship.target !== nodeId) return;
    edgeIds.add(relationship.id);
    neighborNodeIds.add(relationship.source === nodeId ? relationship.target : relationship.source);
  });

  return {
    selectedNodeIds,
    neighborNodeIds,
    edgeIds,
    isDimmedNode: (candidateId: string) => selectedNodeIds.size > 0 && !selectedNodeIds.has(candidateId) && !neighborNodeIds.has(candidateId),
    isDimmedEdge: (candidateId: string) => edgeIds.size > 0 && !edgeIds.has(candidateId),
  };
}

export function getGraphNodeDetail(nodeId: string): GraphNodeDetail | undefined {
  const node = prepareGraphCanvasData().nodes.find((candidate) => candidate.id === nodeId);
  if (!node) return undefined;

  const nodeRelationships = relationships.filter((relationship) => relationship.source === nodeId || relationship.target === nodeId);
  const sources = node.kind === 'place'
    ? getSourcesForEntity(nodeId)
    : [...getSourcesForEntity(nodeId), ...nodeRelationships.flatMap((relationship) => getSourcesForRelationship(relationship.id))];

  const uniqueSources = sources.filter((source, index, all) => all.findIndex((candidate) => candidate.id === source.id) === index);
  const neighborhood = getGraphNeighborhood(nodeId);

  return {
    ...node,
    sources: uniqueSources,
    relationships: nodeRelationships,
    relationshipSummaries: nodeRelationships.map((relationship) => getRelationshipSummary(relationship.id)).filter((summary): summary is GraphRelationshipSummary => Boolean(summary)),
    neighborNodeIds: Array.from(neighborhood.neighborNodeIds),
    edgeIds: Array.from(neighborhood.edgeIds),
  };
}

function getGraphNodeById(nodeId: string) {
  return getGraphNodes().find((node) => node.id === nodeId);
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function matchesGraphQuery(node: CanvasGraphNode, query: string) {
  if (!query) return true;
  const entity = [...artists, ...albums, ...places].find((candidate) => candidate.id === node.id);
  const haystack = [
    node.label,
    node.kind,
    node.curationStatus,
    entity && 'tags' in entity ? entity.tags.join(' ') : '',
    entity && 'summary' in entity ? entity.summary : '',
    entity && 'city' in entity ? entity.city : '',
    entity && 'region' in entity ? entity.region : '',
    entity && 'notes' in entity ? entity.notes : '',
  ].filter(Boolean).join(' ');

  return normalizeSearch(haystack).includes(query);
}
