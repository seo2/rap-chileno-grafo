import assert from 'node:assert/strict';
import test from 'node:test';

import { albums, getAlbumArtist, getArtistBySlug, getArtistAlbums, getPrimaryNavigation, relationships } from '../src/lib/catalog';

test('getPrimaryNavigation exposes the product routes in editorial order', () => {
  assert.deepEqual(
    getPrimaryNavigation().map((item) => item.href),
    ['/', '/graph', '/map', '/search', '/artists', '/albums', '/timeline', '/sources', '/research', '/curation', '/about'],
  );
});

test('getArtistBySlug finds artists for dynamic artist pages', () => {
  const artist = getArtistBySlug('ana-tijoux');
  assert.equal(artist?.name, 'Ana Tijoux');
});

test('getArtistAlbums returns albums owned by an artist slug', () => {
  const albums = getArtistAlbums('tiro-de-gracia');
  assert.ok(albums.length >= 4);
  assert.ok(albums.some((album) => album.title === 'Ser Hümano!!'));
  assert.ok(albums.some((album) => album.title === 'Decisión'));
});

test('getArtistAlbums includes Seo2 solo and associated project discography', () => {
  const albums = getArtistAlbums('seo2');
  const titles = albums.map((album) => album.title);

  assert.ok(titles.includes('Justicia Divina'));
  assert.ok(titles.includes('Hip Hop Héroes'));
  assert.ok(titles.includes('Bombas'));
  assert.ok(titles.includes('Por Puro Amor al Rap'));
  assert.ok(titles.includes('Reinicio'));
  assert.ok(titles.includes('Dusty Tapes'));
  assert.ok(titles.includes('Les Dije a Todos Que Me Iba'));
  assert.ok(titles.includes('En la Pieza de Atrás'));
  assert.ok(titles.includes('I I'));
  assert.ok(titles.includes('333'));
  assert.ok(titles.includes('Nine2Five'));
});

test('Némesis is modeled as a group with Cenzi and Seo2 plus its two albums', () => {
  const nemesis = getArtistBySlug('nemesis');
  assert.equal(nemesis?.curationStatus, 'reviewed');
  assert.ok(nemesis?.tags.includes('grupo'));

  const nemesisAlbums = getArtistAlbums('nemesis').map((album) => album.title);
  assert.deepEqual(nemesisAlbums, ['Justicia Divina', 'Hip Hop Héroes']);

  const memberIds = relationships
    .filter((relationship) => relationship.target === 'artist-nemesis' && relationship.relationshipType === 'member_of')
    .map((relationship) => relationship.source)
    .sort();

  assert.deepEqual(memberIds, ['artist-cenzi', 'artist-seo2']);
});

test('getArtistAlbums includes Némesis records in Cenzi discography', () => {
  const titles = getArtistAlbums('cenzi').map((album) => album.title);

  assert.ok(titles.includes('Justicia Divina'));
  assert.ok(titles.includes('Hip Hop Héroes'));
});

test('getAlbumArtist resolves album cards to their artist', () => {
  const album = albums.find((candidate) => candidate.id === 'album-aerolineas-makiza');
  assert.ok(album);
  assert.equal(getAlbumArtist(album)?.name, 'Makiza');
});
