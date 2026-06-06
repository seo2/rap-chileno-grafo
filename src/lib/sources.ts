import { albums, artists, places, relationships, sources } from './catalog';
import type { Album, Artist, CurationStatus, Place, Relationship, Source, SourceType } from './catalog';

export type SourceEntityType = 'artist' | 'album' | 'place' | 'relationship';

export type SourceMentionSummary = {
  sourceId: string;
  totalMentions: number;
  reviewedMentions: number;
  byEntityType: Record<SourceEntityType, number>;
  byStatus: Partial<Record<CurationStatus, number>>;
};

export type SourceExtract = {
  id: string;
  sourceId: string;
  entityType: SourceEntityType;
  entityId: string;
  entityLabel: string;
  field: string;
  value: string;
  confidence: number;
  curationStatus: CurationStatus;
};

export type SourceDetail = {
  source: Source;
  entities: {
    artists: Artist[];
    albums: Album[];
    places: Place[];
    relationships: Relationship[];
  };
  mentionSummary: SourceMentionSummary;
  extracts: SourceExtract[];
};

export type CurationQueueItem = {
  id: string;
  sourceId: string;
  sourceName: string;
  entityType: SourceEntityType | 'source';
  entityId: string;
  entityLabel: string;
  reason: string;
  priority: number;
  curationStatus: CurationStatus;
  confidence?: number;
};

const emptyMentionCounts: Record<SourceEntityType, number> = {
  artist: 0,
  album: 0,
  place: 0,
  relationship: 0,
};

export function getSourceById(id: string) {
  return sources.find((source) => source.id === id);
}

export function getSourcesForEntity(entityId: string): Source[] {
  const entity = [...artists, ...albums, ...places].find((candidate) => candidate.id === entityId);
  if (!entity) return [];
  return entity.sourceIds.map(getSourceById).filter((source): source is Source => Boolean(source));
}

export function getSourcesForRelationship(relationshipId: string): Source[] {
  const relationship = relationships.find((candidate) => candidate.id === relationshipId);
  if (!relationship) return [];
  return relationship.sourceIds.map(getSourceById).filter((source): source is Source => Boolean(source));
}

export function getEntitiesForSource(sourceId: string) {
  return {
    artists: artists.filter((artist) => artist.sourceIds.includes(sourceId)),
    albums: albums.filter((album) => album.sourceIds.includes(sourceId)),
    places: places.filter((place) => place.sourceIds.includes(sourceId)),
    relationships: relationships.filter((relationship) => relationship.sourceIds.includes(sourceId)),
  };
}

export function getSourceMentionSummary(sourceId: string): SourceMentionSummary {
  const entities = getEntitiesForSource(sourceId);
  const mentions = [
    ...entities.artists.map((entity) => ({ entityType: 'artist' as const, status: entity.curationStatus })),
    ...entities.albums.map((entity) => ({ entityType: 'album' as const, status: entity.curationStatus })),
    ...entities.places.map((entity) => ({ entityType: 'place' as const, status: entity.curationStatus })),
    ...entities.relationships.map((entity) => ({ entityType: 'relationship' as const, status: entity.curationStatus })),
  ];

  return {
    sourceId,
    totalMentions: mentions.length,
    reviewedMentions: mentions.filter((mention) => mention.status === 'reviewed' || mention.status === 'verified').length,
    byEntityType: mentions.reduce<Record<SourceEntityType, number>>((counts, mention) => {
      counts[mention.entityType] += 1;
      return counts;
    }, { ...emptyMentionCounts }),
    byStatus: countBy<CurationStatus>(mentions.map((mention) => mention.status)),
  };
}

export function getSourceExtracts(sourceId: string): SourceExtract[] {
  const entities = getEntitiesForSource(sourceId);

  return [
    ...entities.artists.map((artist) => createExtract({
      sourceId,
      entityType: 'artist',
      entityId: artist.id,
      entityLabel: artist.name,
      field: 'bio / resumen',
      value: [artist.city, artist.region, `era ${artist.era}`, artist.summary].join(' · '),
      confidence: artist.confidence,
      curationStatus: artist.curationStatus,
    })),
    ...entities.albums.map((album) => createExtract({
      sourceId,
      entityType: 'album',
      entityId: album.id,
      entityLabel: album.title,
      field: 'lanzamiento',
      value: `${album.year} · ${album.type} · ${getArtistLabel(album.artistId)}`,
      confidence: album.confidence,
      curationStatus: album.curationStatus,
    })),
    ...entities.places.map((place) => createExtract({
      sourceId,
      entityType: 'place',
      entityId: place.id,
      entityLabel: place.name,
      field: 'territorio',
      value: `${place.type} · ${place.lat}, ${place.lng}`,
      confidence: place.confidence,
      curationStatus: place.curationStatus,
    })),
    ...entities.relationships.map((relationship) => createExtract({
      sourceId,
      entityType: 'relationship',
      entityId: relationship.id,
      entityLabel: getRelationshipLabel(relationship),
      field: 'relación',
      value: [
        relationship.relationshipType.replaceAll('_', ' '),
        relationship.year ? String(relationship.year) : undefined,
        `peso ${relationship.weight}`,
        relationship.notes,
      ]
        .filter(Boolean)
        .join(' · '),
      confidence: relationship.confidence,
      curationStatus: relationship.curationStatus,
    })),
  ].sort((a, b) => b.confidence - a.confidence || a.entityLabel.localeCompare(b.entityLabel));
}

export function getSourceDetail(sourceId: string): SourceDetail | undefined {
  const source = getSourceById(sourceId);
  if (!source) return undefined;

  return {
    source,
    entities: getEntitiesForSource(sourceId),
    mentionSummary: getSourceMentionSummary(sourceId),
    extracts: getSourceExtracts(sourceId),
  };
}

export function getCurationQueue(): CurationQueueItem[] {
  const sourceItems: CurationQueueItem[] = sources
    .filter((source) => source.curationStatus === 'pending' || source.curationStatus === 'candidate')
    .map((source) => ({
      id: `source-${source.id}`,
      sourceId: source.id,
      sourceName: source.name,
      entityType: 'source',
      entityId: source.id,
      entityLabel: source.name,
      reason: source.curationStatus === 'pending' ? 'fuente pendiente de revisión editorial' : 'fuente candidata por revisar',
      priority: source.curationStatus === 'pending' ? 90 : 70,
      curationStatus: source.curationStatus,
    }));

  const extractItems: CurationQueueItem[] = sources.flatMap((source) => getSourceExtracts(source.id)
    .filter((extract) => extract.curationStatus === 'pending' || extract.curationStatus === 'candidate' || extract.confidence < 0.5)
    .map((extract) => ({
      id: `extract-${extract.id}`,
      sourceId: source.id,
      sourceName: source.name,
      entityType: extract.entityType,
      entityId: extract.entityId,
      entityLabel: extract.entityLabel,
      reason: extract.confidence < 0.5 ? 'dato de baja confianza requiere evidencia adicional' : `dato ${extract.curationStatus} por revisar`,
      priority: Math.round((1 - extract.confidence) * 60) + (extract.curationStatus === 'pending' ? 35 : 20),
      curationStatus: extract.curationStatus,
      confidence: extract.confidence,
    })));

  return [...sourceItems, ...extractItems].sort((a, b) => b.priority - a.priority || a.entityLabel.localeCompare(b.entityLabel));
}

function createExtract(extract: Omit<SourceExtract, 'id'>): SourceExtract {
  return {
    ...extract,
    id: `${extract.sourceId}-${extract.entityType}-${extract.entityId}`,
  };
}

function getArtistLabel(artistId: string) {
  return artists.find((artist) => artist.id === artistId)?.name ?? artistId;
}

function getEntityLabel(entityId: string) {
  return artists.find((artist) => artist.id === entityId)?.name
    ?? albums.find((album) => album.id === entityId)?.title
    ?? places.find((place) => place.id === entityId)?.name
    ?? entityId;
}

function getRelationshipLabel(relationship: Relationship) {
  return `${getEntityLabel(relationship.source)} → ${getEntityLabel(relationship.target)}`;
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

export function getSourceStats() {
  return {
    total: sources.length,
    byStatus: countBy<CurationStatus>(sources.map((source) => source.curationStatus)),
    byType: countBy<SourceType>(sources.map((source) => source.sourceType)),
  };
}
