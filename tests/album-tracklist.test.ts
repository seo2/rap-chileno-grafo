import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAlbumDetail,
  getAlbumTracklist,
} from '../src/lib/catalog';

test('getAlbumTracklist returns ordered tracks for a curated album', () => {
  const tracklist = getAlbumTracklist('album-relativo-absoluto');

  assert.equal(tracklist.length, 4);
  assert.deepEqual(tracklist.map((track) => track.trackNumber), [1, 2, 3, 4]);
  assert.equal(tracklist[0]?.title, 'Intro');
  assert.equal(tracklist[3]?.title, 'Relativo & absoluto');
  assert.equal(tracklist[0]?.sourceName, 'Curaduría tracklist semilla');
});

test('getAlbumDetail exposes tracklist provenance without mixing other albums', () => {
  const detail = getAlbumDetail('relativo-absoluto-autobiografia-mc');

  assert.ok(detail);
  assert.equal(detail.tracklist.length, 4);
  assert.ok(detail.tracklist.every((track) => track.albumId === 'album-relativo-absoluto'));
  assert.deepEqual(detail.tracklist.map((track) => track.title), [
    'Intro',
    'Mi testimonio',
    'Rap para mi gente',
    'Relativo & absoluto',
  ]);
});

test('getAlbumTracklist returns an empty list for albums without curated tracks yet', () => {
  assert.deepEqual(getAlbumTracklist('album-aerolineas-makiza'), []);
});
