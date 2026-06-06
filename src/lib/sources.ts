import { albums, artists, places, relationships, sources } from './catalog';
import type { Source, SourceType, CurationStatus } from './catalog';

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
