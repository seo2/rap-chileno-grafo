import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildSpotifyImportReport,
  extractSpotifyId,
  normalizeSpotifyArtistImport,
  type SpotifyAlbumPayload,
  type SpotifyArtistPayload,
  type SpotifyTrackPayload,
} from '../src/lib/spotify';

const artist: SpotifyArtistPayload = {
  id: 'spotify-seo2-id',
  name: 'Seo2',
  uri: 'spotify:artist:spotify-seo2-id',
  external_urls: { spotify: 'https://open.spotify.com/artist/spotify-seo2-id' },
  images: [
    { url: 'https://i.scdn.co/image/large', width: 640, height: 640 },
    { url: 'https://i.scdn.co/image/small', width: 160, height: 160 },
  ],
  genres: ['rap chileno', 'hip hop chileno'],
  popularity: 42,
};

const albums: SpotifyAlbumPayload[] = [
  {
    id: 'album-relativo-spotify',
    name: 'Relativo & absoluto. Autobiografía de un MC',
    uri: 'spotify:album:album-relativo-spotify',
    external_urls: { spotify: 'https://open.spotify.com/album/album-relativo-spotify' },
    album_type: 'album',
    release_date: '2009-01-01',
    total_tracks: 12,
    images: [{ url: 'https://i.scdn.co/image/cover', width: 640, height: 640 }],
  },
];

const tracks: SpotifyTrackPayload[] = [
  {
    id: 'track-1',
    name: 'Tema con invitado',
    uri: 'spotify:track:track-1',
    external_urls: { spotify: 'https://open.spotify.com/track/track-1' },
    track_number: 1,
    duration_ms: 180000,
    album: albums[0],
    artists: [
      { id: 'spotify-seo2-id', name: 'Seo2', uri: 'spotify:artist:spotify-seo2-id' },
      { id: 'guest-artist-id', name: 'Invitado MC', uri: 'spotify:artist:guest-artist-id' },
    ],
  },
];

test('extractSpotifyId accepts artist URLs, URIs and bare ids', () => {
  assert.equal(extractSpotifyId('spotify:artist:abc123'), 'abc123');
  assert.equal(extractSpotifyId('https://open.spotify.com/artist/abc123?si=test'), 'abc123');
  assert.equal(extractSpotifyId('abc123'), 'abc123');
});

test('normalizeSpotifyArtistImport maps Spotify artist, albums, tracks and visible collaborations', () => {
  const normalized = normalizeSpotifyArtistImport({ artist, albums, tracks });

  assert.equal(normalized.spotifyArtistId, 'spotify-seo2-id');
  assert.equal(normalized.name, 'Seo2');
  assert.equal(normalized.popularity, 42);
  assert.deepEqual(normalized.genres, ['rap chileno', 'hip hop chileno']);
  assert.equal(normalized.images[0]?.url, 'https://i.scdn.co/image/large');
  assert.equal(normalized.albums[0]?.year, 2009);
  assert.equal(normalized.albums[0]?.type, 'album');
  assert.equal(normalized.tracks[0]?.durationMs, 180000);
  assert.deepEqual(normalized.visibleCollaborations, [{ spotifyArtistId: 'guest-artist-id', name: 'Invitado MC', trackName: 'Tema con invitado' }]);
});

test('buildSpotifyImportReport creates candidate updates without overwriting curated historical fields', () => {
  const report = buildSpotifyImportReport('seo2', normalizeSpotifyArtistImport({ artist, albums, tracks }));

  assert.equal(report.artistSlug, 'seo2');
  assert.equal(report.sourceId, 'source-spotify-web-api');
  assert.equal(report.artistUpdate.spotifyArtistId, 'spotify-seo2-id');
  assert.equal(report.artistUpdate.popularity, 42);
  assert.deepEqual(report.artistUpdate.genres, ['rap chileno', 'hip hop chileno']);
  assert.equal(report.albumCandidates[0]?.title, 'Relativo & absoluto. Autobiografía de un MC');
  assert.equal(report.trackCandidates[0]?.name, 'Tema con invitado');
  assert.equal(report.relationshipCandidates[0]?.relationshipType, 'collaborated_with');
  assert.equal(report.reviewNotes[0], 'Spotify aporta catálogo, imágenes, géneros y popularidad; no debe usarse como fuente única para historia o territorio.');
});
