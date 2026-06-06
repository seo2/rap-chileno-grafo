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
};

export type GraphNodeDetail = CanvasGraphNode & {
  sources: Source[];
  relationships: Relationship[];
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
  const nodes = graph.nodes.filter((node) => allowedKinds.has(node.kind) && allowedStatuses.has(node.curationStatus));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = graph.edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));

  return {
    nodes,
    edges,
    nodeIds,
    initialSelectedNodeId: nodes.some((node) => node.id === graph.initialSelectedNodeId) ? graph.initialSelectedNodeId : nodes[0]?.id ?? '',
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

  return {
    ...node,
    sources: uniqueSources,
    relationships: nodeRelationships,
  };
}
