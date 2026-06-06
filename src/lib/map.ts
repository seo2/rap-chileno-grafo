import { artists, places, relationships, sources } from './catalog';
import type { Artist, CurationStatus, Place, Relationship, Source } from './catalog';

export type MapStatusFilter = 'all' | Extract<CurationStatus, 'reviewed' | 'candidate' | 'pending'>;

export type TerritorialScene = {
  place: Place;
  coordinates: {
    lat: number;
    lng: number;
  };
  artists: Artist[];
  relationships: Relationship[];
  sources: Source[];
  statusCounts: Record<CurationStatus, number>;
  primaryCurationStatus: CurationStatus;
  averageConfidence: number;
};

export type TerritorialMapStats = {
  places: number;
  artists: number;
  relationships: number;
  reviewedOrVerified: number;
  pendingOrCandidate: number;
  sources: number;
};

export type MapFilterOptions = {
  places: Array<Pick<Place, 'id' | 'slug' | 'name'>>;
  statuses: MapStatusFilter[];
};

export function getTerritorialMap(filter: { status?: MapStatusFilter } = {}): TerritorialScene[] {
  const statusFilter = filter.status ?? 'all';

  return places
    .map((place) => buildTerritorialScene(place))
    .filter((scene): scene is TerritorialScene => Boolean(scene))
    .filter((scene) => statusFilter === 'all' || scene.statusCounts[statusFilter] > 0)
    .sort((a, b) => b.artists.length - a.artists.length || a.place.name.localeCompare(b.place.name));
}

export function getTerritorialMapStats(scenes: TerritorialScene[] = getTerritorialMap()): TerritorialMapStats {
  const uniqueArtists = new Set(scenes.flatMap((scene) => scene.artists.map((artist) => artist.id)));
  const uniqueSources = new Set(scenes.flatMap((scene) => scene.sources.map((source) => source.id)));
  const territorialRelationships = scenes.flatMap((scene) => scene.relationships);

  return {
    places: scenes.length,
    artists: uniqueArtists.size,
    relationships: territorialRelationships.length,
    reviewedOrVerified: territorialRelationships.filter((relationship) => relationship.curationStatus === 'reviewed' || relationship.curationStatus === 'verified').length,
    pendingOrCandidate: territorialRelationships.filter((relationship) => relationship.curationStatus === 'pending' || relationship.curationStatus === 'candidate').length,
    sources: uniqueSources.size,
  };
}

export function getMapFilterOptions(): MapFilterOptions {
  return {
    places: getTerritorialMap().map((scene) => ({
      id: scene.place.id,
      slug: scene.place.slug,
      name: scene.place.name,
    })),
    statuses: ['all', 'reviewed', 'candidate', 'pending'],
  };
}

function buildTerritorialScene(place: Place): TerritorialScene | undefined {
  const placeRelationships = relationships
    .filter((relationship) => relationship.relationshipType === 'from_place' && relationship.target === place.id)
    .sort((a, b) => b.confidence - a.confidence || a.source.localeCompare(b.source));

  if (placeRelationships.length === 0) return undefined;

  const placeArtists = dedupeBy(
    placeRelationships
      .map((relationship) => artists.find((artist) => artist.id === relationship.source))
      .filter((artist): artist is Artist => Boolean(artist)),
    (artist) => artist.id,
  ).sort((a, b) => a.name.localeCompare(b.name));

  const sourceIds = new Set([
    ...place.sourceIds,
    ...placeRelationships.flatMap((relationship) => relationship.sourceIds),
  ]);

  const statusCounts = createEmptyStatusCounts();
  for (const relationship of placeRelationships) {
    statusCounts[relationship.curationStatus] += 1;
  }

  return {
    place,
    coordinates: {
      lat: place.lat,
      lng: place.lng,
    },
    artists: placeArtists,
    relationships: placeRelationships,
    sources: sources.filter((source) => sourceIds.has(source.id)),
    statusCounts,
    primaryCurationStatus: getPrimaryCurationStatus(statusCounts),
    averageConfidence: roundToTwoDecimals(placeRelationships.reduce((sum, relationship) => sum + relationship.confidence, 0) / placeRelationships.length),
  };
}

function createEmptyStatusCounts(): Record<CurationStatus, number> {
  return {
    pending: 0,
    candidate: 0,
    reviewed: 0,
    verified: 0,
    rejected: 0,
  };
}

function getPrimaryCurationStatus(statusCounts: Record<CurationStatus, number>): CurationStatus {
  if (statusCounts.verified > 0) return 'verified';
  if (statusCounts.reviewed > 0) return 'reviewed';
  if (statusCounts.candidate > 0) return 'candidate';
  if (statusCounts.pending > 0) return 'pending';
  return 'rejected';
}

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

function dedupeBy<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
