import { artists } from './catalog';
import type { Album, Relationship } from './catalog';

export type SpotifyImage = {
  url: string;
  width?: number | null;
  height?: number | null;
};

export type SpotifyExternalUrls = {
  spotify?: string;
};

export type SpotifyArtistPayload = {
  id: string;
  name: string;
  uri: string;
  external_urls?: SpotifyExternalUrls;
  images?: SpotifyImage[];
  genres?: string[];
  popularity?: number;
};

export type SpotifyAlbumPayload = {
  id: string;
  name: string;
  uri: string;
  external_urls?: SpotifyExternalUrls;
  album_type: string;
  release_date: string;
  total_tracks?: number;
  images?: SpotifyImage[];
};

export type SpotifyTrackArtist = {
  id: string;
  name: string;
  uri: string;
};

export type SpotifyTrackPayload = {
  id: string;
  name: string;
  uri: string;
  external_urls?: SpotifyExternalUrls;
  track_number?: number;
  duration_ms: number;
  album: SpotifyAlbumPayload;
  artists: SpotifyTrackArtist[];
};

export type SpotifyArtistImportPayload = {
  artist: SpotifyArtistPayload;
  albums: SpotifyAlbumPayload[];
  tracks: SpotifyTrackPayload[];
};

export type NormalizedSpotifyAlbum = {
  spotifyAlbumId: string;
  title: string;
  type: Album['type'];
  year: number;
  releaseDate: string;
  totalTracks: number;
  uri: string;
  url?: string;
  images: SpotifyImage[];
};

export type NormalizedSpotifyTrack = {
  spotifyTrackId: string;
  name: string;
  albumSpotifyId: string;
  trackNumber?: number;
  durationMs: number;
  uri: string;
  url?: string;
  artistNames: string[];
  artistSpotifyIds: string[];
};

export type VisibleSpotifyCollaboration = {
  spotifyArtistId: string;
  name: string;
  trackName: string;
};

export type NormalizedSpotifyArtistImport = {
  spotifyArtistId: string;
  name: string;
  uri: string;
  url?: string;
  popularity: number;
  genres: string[];
  images: SpotifyImage[];
  albums: NormalizedSpotifyAlbum[];
  tracks: NormalizedSpotifyTrack[];
  visibleCollaborations: VisibleSpotifyCollaboration[];
};

export type SpotifyImportReport = {
  artistSlug: string;
  sourceId: 'source-spotify-web-api';
  artistUpdate: {
    spotifyArtistId: string;
    spotifyUrl?: string;
    popularity: number;
    genres: string[];
    images: SpotifyImage[];
  };
  albumCandidates: Array<{
    spotifyAlbumId: string;
    title: string;
    year: number;
    type: Album['type'];
    spotifyUrl?: string;
  }>;
  trackCandidates: Array<{
    spotifyTrackId: string;
    name: string;
    albumSpotifyId: string;
    durationMs: number;
    spotifyUrl?: string;
    artistNames: string[];
  }>;
  relationshipCandidates: Array<{
    sourceSpotifyArtistId: string;
    targetSpotifyArtistId: string;
    targetName: string;
    relationshipType: Relationship['relationshipType'];
    evidence: string;
  }>;
  reviewNotes: string[];
};

export function extractSpotifyId(input: string) {
  const trimmed = input.trim();
  const uriMatch = trimmed.match(/^spotify:[a-z]+:([^:?/]+)$/i);
  if (uriMatch?.[1]) return uriMatch[1];

  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split('/').filter(Boolean);
    return parts.at(-1) ?? trimmed;
  } catch {
    return trimmed;
  }
}

export function normalizeSpotifyArtistImport(payload: SpotifyArtistImportPayload): NormalizedSpotifyArtistImport {
  const mainArtistId = payload.artist.id;
  const albums = dedupeBy(payload.albums.map(normalizeAlbum), (album) => album.spotifyAlbumId);
  const tracks = dedupeBy(payload.tracks.map(normalizeTrack), (track) => track.spotifyTrackId);
  const visibleCollaborations = dedupeBy(
    payload.tracks.flatMap((track) => track.artists
      .filter((artist) => artist.id !== mainArtistId)
      .map((artist) => ({
        spotifyArtistId: artist.id,
        name: artist.name,
        trackName: track.name,
      }))),
    (collaboration) => `${collaboration.spotifyArtistId}:${collaboration.trackName}`,
  );

  return {
    spotifyArtistId: payload.artist.id,
    name: payload.artist.name,
    uri: payload.artist.uri,
    url: payload.artist.external_urls?.spotify,
    popularity: payload.artist.popularity ?? 0,
    genres: payload.artist.genres ?? [],
    images: sortImages(payload.artist.images ?? []),
    albums,
    tracks,
    visibleCollaborations,
  };
}

export function buildSpotifyImportReport(artistSlug: string, normalized: NormalizedSpotifyArtistImport): SpotifyImportReport {
  const seedArtist = artists.find((artist) => artist.slug === artistSlug);
  const artistName = seedArtist?.name ?? normalized.name;

  return {
    artistSlug,
    sourceId: 'source-spotify-web-api',
    artistUpdate: {
      spotifyArtistId: normalized.spotifyArtistId,
      spotifyUrl: normalized.url,
      popularity: normalized.popularity,
      genres: normalized.genres,
      images: normalized.images,
    },
    albumCandidates: normalized.albums.map((album) => ({
      spotifyAlbumId: album.spotifyAlbumId,
      title: album.title,
      year: album.year,
      type: album.type,
      spotifyUrl: album.url,
    })),
    trackCandidates: normalized.tracks.map((track) => ({
      spotifyTrackId: track.spotifyTrackId,
      name: track.name,
      albumSpotifyId: track.albumSpotifyId,
      durationMs: track.durationMs,
      spotifyUrl: track.url,
      artistNames: track.artistNames,
    })),
    relationshipCandidates: normalized.visibleCollaborations.map((collaboration) => ({
      sourceSpotifyArtistId: normalized.spotifyArtistId,
      targetSpotifyArtistId: collaboration.spotifyArtistId,
      targetName: collaboration.name,
      relationshipType: 'collaborated_with',
      evidence: `${artistName} comparte créditos con ${collaboration.name} en “${collaboration.trackName}”.`,
    })),
    reviewNotes: [
      'Spotify aporta catálogo, imágenes, géneros y popularidad; no debe usarse como fuente única para historia o territorio.',
      'Las colaboraciones visibles provienen de créditos de tracks y deben revisarse antes de convertirse en relaciones históricas del grafo.',
    ],
  };
}

export async function getSpotifyAccessToken(credentials: { clientId: string; clientSecret: string }, fetcher: typeof fetch = fetch) {
  const basic = Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64');
  const response = await fetcher('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json() as { access_token?: string };
  if (!json.access_token) throw new Error('Spotify token response did not include access_token');
  return json.access_token;
}

export async function fetchSpotifyArtistImport(artistIdOrUrl: string, accessToken: string, fetcher: typeof fetch = fetch): Promise<SpotifyArtistImportPayload> {
  const artistId = extractSpotifyId(artistIdOrUrl);
  const artist = await spotifyGet<SpotifyArtistPayload>(`https://api.spotify.com/v1/artists/${artistId}`, accessToken, fetcher);
  const albumsResponse = await spotifyGet<{ items: SpotifyAlbumPayload[] }>(
    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,appears_on,compilation&market=CL&limit=50`,
    accessToken,
    fetcher,
  );
  const albums = dedupeBy(albumsResponse.items ?? [], (album) => album.id);
  const tracks = (await Promise.all(albums.map(async (album) => {
    const response = await spotifyGet<{ items: Array<Omit<SpotifyTrackPayload, 'album'>> }>(
      `https://api.spotify.com/v1/albums/${album.id}/tracks?market=CL&limit=50`,
      accessToken,
      fetcher,
    );
    return response.items.map((track) => ({ ...track, album }));
  }))).flat();

  return { artist, albums, tracks };
}

async function spotifyGet<T>(url: string, accessToken: string, fetcher: typeof fetch): Promise<T> {
  const response = await fetcher(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) throw new Error(`Spotify API request failed: ${response.status} ${response.statusText} (${url})`);
  return response.json() as Promise<T>;
}

function normalizeAlbum(album: SpotifyAlbumPayload): NormalizedSpotifyAlbum {
  return {
    spotifyAlbumId: album.id,
    title: album.name,
    type: normalizeAlbumType(album.album_type),
    year: parseReleaseYear(album.release_date),
    releaseDate: album.release_date,
    totalTracks: album.total_tracks ?? 0,
    uri: album.uri,
    url: album.external_urls?.spotify,
    images: sortImages(album.images ?? []),
  };
}

function normalizeTrack(track: SpotifyTrackPayload): NormalizedSpotifyTrack {
  return {
    spotifyTrackId: track.id,
    name: track.name,
    albumSpotifyId: track.album.id,
    trackNumber: track.track_number,
    durationMs: track.duration_ms,
    uri: track.uri,
    url: track.external_urls?.spotify,
    artistNames: track.artists.map((artist) => artist.name),
    artistSpotifyIds: track.artists.map((artist) => artist.id),
  };
}

function normalizeAlbumType(type: string): Album['type'] {
  if (type === 'single') return 'single';
  if (type === 'compilation') return 'compilation';
  return 'album';
}

function parseReleaseYear(releaseDate: string) {
  const year = Number(releaseDate.slice(0, 4));
  return Number.isFinite(year) ? year : 0;
}

function sortImages(images: SpotifyImage[]) {
  return [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
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
