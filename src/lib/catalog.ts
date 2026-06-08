import { albums } from '@/data/seed-albums';
import { artists } from '@/data/seed-artists';
import { places } from '@/data/seed-places';
import { relationships } from '@/data/seed-relationships';
import { sources } from '@/data/seed-sources';
import { tracks } from '@/data/seed-tracks';
import type { Album, AlbumTrack, Artist, CurationStatus, Relationship, Source } from '@/data/types';

export { albums, artists, places, relationships, sources, tracks };
export type {
  Album,
  AlbumTrack,
  Artist,
  CurationStatus,
  EditorialEvidence,
  Era,
  Place,
  Relationship,
  ResearchCandidate,
  ResearchCandidateKind,
  Source,
  SourceType,
} from '@/data/types';

export type NavigationItem = {
  label: string;
  href: string;
  description: string;
};

export type AlbumDecadeGroup = {
  decade: string;
  albums: Album[];
};

export type AlbumDetail = {
  album: Album;
  artist?: Artist;
  tracklist: AlbumTrack[];
  relationships: Relationship[];
  relationshipSummaries: Array<{
    id: string;
    display: string;
    year?: number;
    curationStatus: CurationStatus;
    confidence: number;
  }>;
  sources: Source[];
  relatedArtistSlugs: string[];
};

export const primaryNavigation: NavigationItem[] = [
  { label: 'Inicio', href: '/', description: 'Portada del archivo vivo' },
  { label: 'Grafo', href: '/graph', description: 'Red de artistas, discos, lugares y relaciones' },
  { label: 'Mapa', href: '/map', description: 'Escenas territoriales, ciudades y provenance de lugar' },
  { label: 'Buscar', href: '/search', description: 'Búsqueda global por artistas, discos, lugares, relaciones y fuentes' },
  { label: 'Artistas', href: '/artists', description: 'Catálogo curatorial inicial' },
  { label: 'Discos', href: '/albums', description: 'Álbumes y lanzamientos semilla' },
  { label: 'Timeline', href: '/timeline', description: 'Historia por décadas y eras' },
  { label: 'Fuentes', href: '/sources', description: 'Evidencia, APIs y archivos por revisar' },
  { label: 'Investigación', href: '/research', description: 'Candidatos externos antes de publicar' },
  { label: 'Curaduría', href: '/curation', description: 'Consola editorial de fuentes, claims, promociones y publicación' },
  { label: 'Acerca', href: '/about', description: 'Propósito editorial del proyecto' },
];

export function getPrimaryNavigation() {
  return primaryNavigation;
}

export function getRapOnlyArtists() {
  return artists.filter((artist) => !artist.urbanCrossover);
}

export function getArtistBySlug(slug: string) {
  return artists.find((artist) => artist.slug === slug);
}

export function getArtistAlbums(slug: string) {
  const artist = getArtistBySlug(slug);
  if (!artist) return [];
  const releasedAlbumIds = new Set(relationships
    .filter((relationship) => relationship.source === artist.id && relationship.relationshipType === 'released')
    .map((relationship) => relationship.target));

  return albums
    .filter((album) => album.artistId === artist.id || releasedAlbumIds.has(album.id))
    .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
}

export function getAlbumArtist(album: { artistId: string }) {
  return artists.find((artist) => artist.id === album.artistId);
}

export function getAlbumBySlug(slug: string) {
  return albums.find((album) => album.slug === slug);
}

export function getAlbumRelationships(albumId: string) {
  return relationships.filter((relationship) => relationship.source === albumId || relationship.target === albumId);
}

export function getAlbumTracklist(albumId: string) {
  return tracks
    .filter((track) => track.albumId === albumId)
    .sort((a, b) => a.trackNumber - b.trackNumber || a.title.localeCompare(b.title));
}

export function getAlbumDetail(slug: string): AlbumDetail | undefined {
  const album = getAlbumBySlug(slug);
  if (!album) return undefined;

  const artist = getAlbumArtist(album);
  const albumRelationships = getAlbumRelationships(album.id);
  const tracklist = getAlbumTracklist(album.id);
  const albumSourceIds = new Set([
    ...album.sourceIds,
    ...tracklist.flatMap((track) => track.sourceIds),
    ...albumRelationships.flatMap((relationship) => relationship.sourceIds),
  ]);
  const albumSources = sources.filter((source) => albumSourceIds.has(source.id));
  const relatedArtistIds = new Set([
    album.artistId,
    ...albumRelationships.flatMap((relationship) => [relationship.source, relationship.target]).filter((id) => id.startsWith('artist-')),
  ]);

  return {
    album,
    artist,
    tracklist,
    relationships: albumRelationships,
    relationshipSummaries: albumRelationships.map((relationship) => ({
      id: relationship.id,
      display: `${getEntityLabel(relationship.source)} → ${getRelationshipTypeLabel(relationship.relationshipType)} → ${getEntityLabel(relationship.target)}`,
      year: relationship.year,
      curationStatus: relationship.curationStatus,
      confidence: relationship.confidence,
    })),
    sources: albumSources,
    relatedArtistSlugs: artists.filter((candidate) => relatedArtistIds.has(candidate.id)).map((candidate) => candidate.slug),
  };
}

export function getAlbumsByDecade(): AlbumDecadeGroup[] {
  const groups = albums.reduce<Record<string, Album[]>>((acc, album) => {
    const decade = `${Math.floor(album.year / 10) * 10}s`;
    acc[decade] = [...(acc[decade] ?? []), album];
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([decade, decadeAlbums]) => ({
      decade,
      albums: [...decadeAlbums].sort((a, b) => a.year - b.year || a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => a.decade.localeCompare(b.decade));
}

export function getEntityLabel(entityId: string) {
  return artists.find((artist) => artist.id === entityId)?.name
    ?? albums.find((album) => album.id === entityId)?.title
    ?? places.find((place) => place.id === entityId)?.name
    ?? entityId;
}

export function getRelationshipTypeLabel(type: Relationship['relationshipType']) {
  const labels: Record<Relationship['relationshipType'], string> = {
    collaborated_with: 'colaboró con',
    member_of: 'integrante de',
    released: 'publicó',
    from_place: 'desde',
    associated_with_era: 'asociado a era',
  };
  return labels[type];
}

export function getRelationshipEdges() {
  const nodeIds = new Set([...artists.map((artist) => artist.id), ...albums.map((album) => album.id), ...places.map((place) => place.id)]);
  return relationships.filter((relationship) => nodeIds.has(relationship.source) && nodeIds.has(relationship.target));
}

export function getArtistRelationships(artistId: string) {
  return relationships.filter((relationship) => relationship.source === artistId || relationship.target === artistId);
}

export function getGraphStats() {
  const rapArtists = getRapOnlyArtists();
  return {
    artists: rapArtists.length,
    relationships: getRelationshipEdges().length,
    albums: albums.length,
    places: places.length,
    sources: sources.length,
    pendingSources: sources.filter((source) => source.curationStatus === 'pending').length,
    eras: new Set(rapArtists.map((artist) => artist.era)).size,
  };
}
