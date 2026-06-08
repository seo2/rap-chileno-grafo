import { albums, artists, places, relationships, sources } from '@/lib/catalog';
import type { CurationStatus, Relationship } from '@/data/types';

export type SearchResultType = 'artist' | 'album' | 'place' | 'source' | 'relationship';

export type SearchCatalogOptions = {
  types?: SearchResultType[];
  statuses?: CurationStatus[];
  limit?: number;
};

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  curationStatus: CurationStatus;
  confidence?: number;
  sourceName?: string;
  matchedFields: string[];
  score: number;
};

export type SearchFilterOption<T extends string = string> = {
  value: T;
  label: string;
  count: number;
};

const RESULT_TYPE_LABELS: Record<SearchResultType, string> = {
  artist: 'Artistas',
  album: 'Discos',
  place: 'Lugares',
  source: 'Fuentes',
  relationship: 'Relaciones',
};

const STATUS_LABELS: Record<CurationStatus, string> = {
  pending: 'Pendientes',
  candidate: 'Candidatas',
  reviewed: 'Revisadas',
  verified: 'Verificadas',
  rejected: 'Rechazadas',
};

const RELATIONSHIP_LABELS: Record<Relationship['relationshipType'], string> = {
  collaborated_with: 'colaboró con',
  member_of: 'integrante de',
  released: 'publicó',
  from_place: 'desde',
  associated_with_era: 'asociado a era',
};

export function searchCatalog(query: string, options: SearchCatalogOptions = {}): SearchResult[] {
  const normalizedQuery = normalize(query);
  const queryTokens = normalizedQuery.split(' ').filter(Boolean);
  if (queryTokens.length === 0) return [];

  const typeFilter = new Set(options.types ?? ['artist', 'album', 'place', 'source', 'relationship']);
  const statusFilter = options.statuses ? new Set(options.statuses) : undefined;
  const candidates = buildSearchIndex().filter((result) => typeFilter.has(result.type));

  return candidates
    .map((candidate) => scoreCandidate(candidate, queryTokens))
    .filter((candidate): candidate is SearchResult => Boolean(candidate))
    .filter((candidate) => !statusFilter || statusFilter.has(candidate.curationStatus))
    .sort((a, b) => b.score - a.score || typeRank(a.type) - typeRank(b.type) || a.title.localeCompare(b.title))
    .slice(0, options.limit ?? 40);
}

export function getSearchFilters() {
  const index = buildSearchIndex();
  return {
    types: (['artist', 'album', 'place', 'source', 'relationship'] as SearchResultType[]).map((type) => ({
      value: type,
      label: RESULT_TYPE_LABELS[type],
      count: index.filter((result) => result.type === type).length,
    })),
    statuses: (['pending', 'candidate', 'reviewed', 'verified', 'rejected'] as CurationStatus[])
      .map((status) => ({
        value: status,
        label: STATUS_LABELS[status],
        count: index.filter((result) => result.curationStatus === status).length,
      }))
      .filter((status) => status.count > 0),
  };
}

function buildSearchIndex(): SearchResult[] {
  const artistResults: SearchResult[] = artists.map((artist) => ({
    id: artist.id,
    type: 'artist',
    title: artist.name,
    subtitle: `${artist.city}, ${artist.region} · ${artist.era}`,
    description: artist.summary,
    href: `/artists/${artist.slug}`,
    curationStatus: artist.curationStatus,
    confidence: artist.confidence,
    sourceName: artist.sourceName,
    matchedFields: [],
    score: 0,
  }));

  const albumResults: SearchResult[] = albums.map((album) => {
    const artist = artists.find((candidate) => candidate.id === album.artistId);
    return {
      id: album.id,
      type: 'album',
      title: album.title,
      subtitle: `${artist?.name ?? 'Artista pendiente'} · ${album.year} · ${album.type}`,
      description: `Lanzamiento conectado al catálogo editorial y a fuentes como ${album.sourceName}.`,
      href: `/albums/${album.slug}`,
      curationStatus: album.curationStatus,
      confidence: album.confidence,
      sourceName: album.sourceName,
      matchedFields: [],
      score: 0,
    };
  });

  const placeResults: SearchResult[] = places.map((place) => ({
    id: place.id,
    type: 'place',
    title: place.name,
    subtitle: `${place.type} · ${place.lat.toFixed(2)}, ${place.lng.toFixed(2)}`,
    description: place.notes ?? `Escena territorial candidata asociada a ${place.sourceName}.`,
    href: `/map?place=${place.slug}`,
    curationStatus: place.curationStatus,
    confidence: place.confidence,
    sourceName: place.sourceName,
    matchedFields: [],
    score: 0,
  }));

  const sourceResults: SearchResult[] = sources.map((source) => ({
    id: source.id,
    type: 'source',
    title: source.name,
    subtitle: `${source.sourceType} · ${source.curationStatus}`,
    description: source.description,
    href: `/sources/${source.id}`,
    curationStatus: source.curationStatus,
    sourceName: source.name,
    matchedFields: [],
    score: 0,
  }));

  const relationshipResults: SearchResult[] = relationships.map((relationship) => ({
    id: relationship.id,
    type: 'relationship',
    title: getRelationshipTitle(relationship),
    subtitle: `${RELATIONSHIP_LABELS[relationship.relationshipType]} · peso ${relationship.weight}`,
    description: relationship.notes ?? `Relación ${relationship.curationStatus} con fuente ${relationship.sourceName}.`,
    href: `/graph?selected=${relationship.source}`,
    curationStatus: relationship.curationStatus,
    confidence: relationship.confidence,
    sourceName: relationship.sourceName,
    matchedFields: [],
    score: 0,
  }));

  return [...artistResults, ...albumResults, ...placeResults, ...sourceResults, ...relationshipResults];
}

function scoreCandidate(candidate: SearchResult, queryTokens: string[]): SearchResult | undefined {
  const fields = [
    ['title', candidate.title, 12],
    ['subtitle', candidate.subtitle, 5],
    ['description', candidate.description, 3],
    ['source', candidate.sourceName ?? '', 2],
    ['status', candidate.curationStatus, 1],
    ['type', candidate.type, 1],
  ] as const;

  let score = 0;
  const matchedFields = new Set<string>();

  for (const token of queryTokens) {
    let tokenMatched = false;
    for (const [field, rawValue, weight] of fields) {
      const normalizedField = normalize(rawValue);
      if (normalizedField === token) {
        score += weight + 8;
        matchedFields.add(field);
        tokenMatched = true;
      } else if (normalizedField.startsWith(token)) {
        score += weight + 4;
        matchedFields.add(field);
        tokenMatched = true;
      } else if (normalizedField.includes(token)) {
        score += weight;
        matchedFields.add(field);
        tokenMatched = true;
      }
    }
    if (!tokenMatched) return undefined;
  }

  return { ...candidate, matchedFields: [...matchedFields], score };
}

function getRelationshipTitle(relationship: Relationship) {
  const source = getEntityLabel(relationship.source);
  const target = getEntityLabel(relationship.target);
  return `${source} ${RELATIONSHIP_LABELS[relationship.relationshipType]} ${target}`;
}

function getEntityLabel(entityId: string) {
  return artists.find((artist) => artist.id === entityId)?.name
    ?? albums.find((album) => album.id === entityId)?.title
    ?? places.find((place) => place.id === entityId)?.name
    ?? entityId;
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ]+/g, ' ')
    .trim();
}

function typeRank(type: SearchResultType) {
  return ['place', 'artist', 'album', 'relationship', 'source'].indexOf(type);
}
