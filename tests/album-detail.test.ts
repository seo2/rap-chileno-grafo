import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAlbumBySlug,
  getAlbumDetail,
  getAlbumRelationships,
  getAlbumsByDecade,
} from '../src/lib/catalog';
import { getGraphNodes } from '../src/lib/graph';

test('getAlbumBySlug resolves album detail slugs for static album pages', () => {
  const album = getAlbumBySlug('relativo-absoluto-autobiografia-mc');

  assert.ok(album);
  assert.equal(album.title, 'Relativo & absoluto. Autobiografía de un MC');
  assert.equal(album.artistId, 'artist-seo2');
  assert.equal(album.curationStatus, 'reviewed');
});

test('getAlbumDetail combines album, artist, relationships and source provenance', () => {
  const detail = getAlbumDetail('relativo-absoluto-autobiografia-mc');

  assert.ok(detail);
  assert.equal(detail.album.title, 'Relativo & absoluto. Autobiografía de un MC');
  assert.equal(detail.artist?.name, 'Seo2');
  assert.ok(detail.relationships.some((relationship) => relationship.id === 'rel-seo2-relativo-absoluto'));
  assert.ok(detail.relationshipSummaries.some((summary) => summary.display.includes('Seo2 → publicó')));
  assert.ok(detail.sources.some((source) => source.name === 'Música Popular: Seo2'));
  assert.ok(detail.relatedArtistSlugs.includes('seo2'));
});

test('getAlbumRelationships returns graph relationships connected to an album id', () => {
  const relationships = getAlbumRelationships('album-aerolineas-makiza');

  assert.ok(relationships.length >= 1);
  assert.ok(relationships.every((relationship) => relationship.source === 'album-aerolineas-makiza' || relationship.target === 'album-aerolineas-makiza'));
  assert.ok(relationships.some((relationship) => relationship.relationshipType === 'released'));
});

test('getAlbumsByDecade groups albums chronologically for discography navigation', () => {
  const decades = getAlbumsByDecade();

  assert.ok(decades.some((decade) => decade.decade === '1990s' && decade.albums.some((album) => album.slug === 'ser-humano')));
  assert.ok(decades.some((decade) => decade.decade === '2000s' && decade.albums.some((album) => album.slug === 'relativo-absoluto-autobiografia-mc')));
  assert.deepEqual(decades.map((decade) => decade.decade), [...decades.map((decade) => decade.decade)].sort());
});

test('graph album nodes link to album detail pages', () => {
  const node = getGraphNodes().find((candidate) => candidate.id === 'album-relativo-absoluto');

  assert.ok(node);
  assert.equal(node.href, '/albums/relativo-absoluto-autobiografia-mc');
});
