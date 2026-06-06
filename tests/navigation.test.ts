import assert from 'node:assert/strict';
import test from 'node:test';

import { albums, getAlbumArtist, getArtistBySlug, getArtistAlbums, getPrimaryNavigation } from '../src/lib/catalog';

test('getPrimaryNavigation exposes the product routes in editorial order', () => {
  assert.deepEqual(
    getPrimaryNavigation().map((item) => item.href),
    ['/', '/graph', '/artists', '/albums', '/timeline', '/sources', '/research', '/curation', '/about'],
  );
});

test('getArtistBySlug finds artists for dynamic artist pages', () => {
  const artist = getArtistBySlug('ana-tijoux');
  assert.equal(artist?.name, 'Ana Tijoux');
});

test('getArtistAlbums returns albums owned by an artist slug', () => {
  const albums = getArtistAlbums('tiro-de-gracia');
  assert.equal(albums.length, 1);
  assert.equal(albums[0]?.title, 'Ser Hümano!!');
});

test('getAlbumArtist resolves album cards to their artist', () => {
  const album = albums.find((candidate) => candidate.id === 'album-aerolineas-makiza');
  assert.ok(album);
  assert.equal(getAlbumArtist(album)?.name, 'Makiza');
});
