import { albums, artists, getRelationshipTypeLabel, places, relationships, sources } from '@/lib/catalog';
import type { Album, Artist, CurationStatus, Era, Place, Relationship, Source } from '@/lib/catalog';

export type TimelineEntityType = 'artist' | 'album' | 'relationship' | 'milestone';

export type TimelineEvent = {
  id: string;
  year: number;
  era: Era;
  title: string;
  description: string;
  entityType: TimelineEntityType;
  entityId: string;
  sourceIds: string[];
  curationStatus: CurationStatus;
  confidence: number;
  artistIds: string[];
  artistSlugs: string[];
  placeIds: string[];
  placeSlugs: string[];
  tags: string[];
};

export type TimelineFilter = {
  artistSlug?: string;
  placeSlug?: string;
  decade?: number;
  era?: Era;
};

export type TimelineDecade = {
  label: string;
  startYear: number;
  events: TimelineEvent[];
};

export type TimelineEventDetail = {
  event: TimelineEvent;
  artists: Artist[];
  places: Place[];
  sources: Source[];
  album?: Album;
  relationship?: Relationship;
};

const eraStartYears: Record<Era, number> = {
  '80s': 1980,
  '90s': 1990,
  '2000s': 2000,
  '2010s': 2010,
  '2020s': 2020,
};

function getEraForYear(year: number): Era {
  if (year < 1990) return '80s';
  if (year < 2000) return '90s';
  if (year < 2010) return '2000s';
  if (year < 2020) return '2010s';
  return '2020s';
}

function getDecadeForYear(year: number) {
  return Math.floor(year / 10) * 10;
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function getArtistPlaces(artistId: string) {
  const placeIds = relationships
    .filter((relationship) => relationship.relationshipType === 'from_place' && relationship.source === artistId)
    .map((relationship) => relationship.target);

  return places.filter((place) => placeIds.includes(place.id));
}

function eventFromArtist(artist: Artist): TimelineEvent {
  const artistPlaces = getArtistPlaces(artist.id);

  return {
    id: `artist-${artist.id}-era`,
    year: eraStartYears[artist.era],
    era: artist.era,
    title: `${artist.name} entra en la era ${artist.era}`,
    description: artist.summary,
    entityType: 'artist',
    entityId: artist.id,
    sourceIds: artist.sourceIds,
    curationStatus: artist.curationStatus,
    confidence: artist.confidence,
    artistIds: [artist.id],
    artistSlugs: [artist.slug],
    placeIds: artistPlaces.map((place) => place.id),
    placeSlugs: artistPlaces.map((place) => place.slug),
    tags: artist.tags,
  };
}

function eventFromAlbum(album: Album): TimelineEvent {
  const artist = artists.find((candidate) => candidate.id === album.artistId);
  const artistPlaces = artist ? getArtistPlaces(artist.id) : [];

  return {
    id: `album-${album.id}-release`,
    year: album.year,
    era: getEraForYear(album.year),
    title: album.title,
    description: artist ? `${artist.name} publica ${album.type} clave para la línea temporal del archivo.` : `Lanzamiento ${album.type} pendiente de artista verificado.`,
    entityType: 'album',
    entityId: album.id,
    sourceIds: album.sourceIds,
    curationStatus: album.curationStatus,
    confidence: album.confidence,
    artistIds: artist ? [artist.id] : [],
    artistSlugs: artist ? [artist.slug] : [],
    placeIds: artistPlaces.map((place) => place.id),
    placeSlugs: artistPlaces.map((place) => place.slug),
    tags: [album.type, artist?.era ?? getEraForYear(album.year)].filter(Boolean),
  };
}

function eventFromRelationship(relationship: Relationship): TimelineEvent | null {
  if (!relationship.year) return null;

  const sourceArtist = artists.find((artist) => artist.id === relationship.source);
  const targetArtist = artists.find((artist) => artist.id === relationship.target);
  const targetAlbum = albums.find((album) => album.id === relationship.target);
  const relationshipArtists = unique([sourceArtist, targetArtist, targetAlbum ? artists.find((artist) => artist.id === targetAlbum.artistId) : undefined].filter(Boolean) as Artist[]);
  const relationshipPlaces = unique(relationshipArtists.flatMap((artist) => getArtistPlaces(artist.id)));
  const targetLabel = targetArtist?.name ?? targetAlbum?.title ?? relationship.target;

  return {
    id: `relationship-${relationship.id}`,
    year: relationship.year,
    era: getEraForYear(relationship.year),
    title: `${sourceArtist?.name ?? relationship.source} → ${targetLabel}`,
    description: `Relación ${getRelationshipTypeLabel(relationship.relationshipType)} registrada en ${relationship.year}.`,
    entityType: 'relationship',
    entityId: relationship.id,
    sourceIds: relationship.sourceIds,
    curationStatus: relationship.curationStatus,
    confidence: relationship.confidence,
    artistIds: relationshipArtists.map((artist) => artist.id),
    artistSlugs: relationshipArtists.map((artist) => artist.slug),
    placeIds: relationshipPlaces.map((place) => place.id),
    placeSlugs: relationshipPlaces.map((place) => place.slug),
    tags: [relationship.relationshipType],
  };
}

export function prepareTimelineEvents(): TimelineEvent[] {
  const events = [
    ...artists.map(eventFromArtist),
    ...albums.map(eventFromAlbum),
    ...relationships.map(eventFromRelationship).filter((event): event is TimelineEvent => event !== null),
  ];

  return events.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
}

export function filterTimelineEvents(events: TimelineEvent[], filter: TimelineFilter = {}) {
  return events.filter((event) => {
    if (filter.artistSlug && !event.artistSlugs.includes(filter.artistSlug)) return false;
    if (filter.placeSlug && !event.placeSlugs.includes(filter.placeSlug)) return false;
    if (filter.era && event.era !== filter.era) return false;
    if (filter.decade && getDecadeForYear(event.year) !== filter.decade) return false;
    return true;
  });
}

export function getTimelineDecades(events: TimelineEvent[] = prepareTimelineEvents()): TimelineDecade[] {
  const grouped = new Map<number, TimelineEvent[]>();

  for (const event of events) {
    const decade = getDecadeForYear(event.year);
    grouped.set(decade, [...(grouped.get(decade) ?? []), event]);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a - b)
    .map(([startYear, decadeEvents]) => ({
      label: `${startYear}s`,
      startYear,
      events: decadeEvents,
    }));
}

export function getTimelineEventDetail(eventId: string): TimelineEventDetail | undefined {
  const event = prepareTimelineEvents().find((candidate) => candidate.id === eventId);
  if (!event) return undefined;

  return {
    event,
    artists: artists.filter((artist) => event.artistIds.includes(artist.id)),
    places: places.filter((place) => event.placeIds.includes(place.id)),
    sources: sources.filter((source) => event.sourceIds.includes(source.id)),
    album: event.entityType === 'album' ? albums.find((album) => album.id === event.entityId) : undefined,
    relationship: event.entityType === 'relationship' ? relationships.find((relationship) => relationship.id === event.entityId) : undefined,
  };
}

export function getTimelineStats(events: TimelineEvent[] = prepareTimelineEvents()) {
  return {
    total: events.length,
    decades: getTimelineDecades(events).length,
    verifiedOrReviewed: events.filter((event) => event.curationStatus === 'verified' || event.curationStatus === 'reviewed').length,
    pendingOrCandidate: events.filter((event) => event.curationStatus === 'pending' || event.curationStatus === 'candidate').length,
  };
}

export function getTimelineFilterOptions() {
  const events = prepareTimelineEvents();
  const activeArtistSlugs = new Set(events.flatMap((event) => event.artistSlugs));
  const activePlaceSlugs = new Set(events.flatMap((event) => event.placeSlugs));

  return {
    artists: artists.filter((artist) => activeArtistSlugs.has(artist.slug)),
    places: places.filter((place) => activePlaceSlugs.has(place.slug)),
    decades: getTimelineDecades(events).map((decade) => decade.startYear),
  };
}
