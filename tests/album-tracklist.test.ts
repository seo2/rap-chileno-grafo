import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAlbumDetail,
  getAlbumTracklist,
} from '../src/lib/catalog';

test('getAlbumTracklist returns ordered tracks for a curated album', () => {
  const tracklist = getAlbumTracklist('album-relativo-absoluto');

  assert.equal(tracklist.length, 17);
  assert.deepEqual(tracklist.map((track) => track.trackNumber), Array.from({ length: 17 }, (_, index) => index + 1));
  assert.equal(tracklist[0]?.title, 'Intro');
  assert.equal(tracklist[16]?.title, 'He Perdido la Cordura');
  assert.equal(tracklist[0]?.sourceName, 'Spotify Web API: tracklist Seo2');
  assert.equal(tracklist[0]?.spotifyTrackId, '31YhFiOwIJLTPUu6NrEvLt');
});

test('getAlbumDetail exposes tracklist provenance without mixing other albums', () => {
  const detail = getAlbumDetail('relativo-absoluto-autobiografia-mc');

  assert.ok(detail);
  assert.equal(detail.tracklist.length, 17);
  assert.ok(detail.tracklist.every((track) => track.albumId === 'album-relativo-absoluto'));
  assert.deepEqual(detail.tracklist.slice(0, 4).map((track) => track.title), ['Intro', 'Hola Mundo', 'Viví', 'Líneas en el Cielo']);
});

test('getAlbumTracklist returns an empty list for albums without curated tracks yet', () => {
  assert.deepEqual(getAlbumTracklist('album-aerolineas-makiza'), []);
});
