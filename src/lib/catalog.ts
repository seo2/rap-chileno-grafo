import { albums } from '@/data/seed-albums';
import { artists } from '@/data/seed-artists';
import { places } from '@/data/seed-places';
import { relationships } from '@/data/seed-relationships';
import { sources } from '@/data/seed-sources';

export { albums, artists, places, relationships, sources };
export type {
  Album,
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

export const primaryNavigation: NavigationItem[] = [
  { label: 'Inicio', href: '/', description: 'Portada del archivo vivo' },
  { label: 'Grafo', href: '/graph', description: 'Red de artistas, discos, lugares y relaciones' },
  { label: 'Artistas', href: '/artists', description: 'Catálogo curatorial inicial' },
  { label: 'Discos', href: '/albums', description: 'Álbumes y lanzamientos semilla' },
  { label: 'Timeline', href: '/timeline', description: 'Historia por décadas y eras' },
  { label: 'Fuentes', href: '/sources', description: 'Evidencia, APIs y archivos por revisar' },
  { label: 'Investigación', href: '/research', description: 'Candidatos externos antes de publicar' },
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
  return albums.filter((album) => album.artistId === artist.id);
}

export function getAlbumArtist(album: { artistId: string }) {
  return artists.find((artist) => artist.id === album.artistId);
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
