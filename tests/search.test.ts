import assert from 'node:assert/strict';
import test from 'node:test';

import { getSearchFilters, searchCatalog } from '../src/lib/search';

test('searchCatalog returns ranked matches across artists, albums, places, sources and relationships', () => {
  const results = searchCatalog('Santiago');

  assert.ok(results.length >= 4);
  assert.equal(results[0]?.title, 'Santiago');
  assert.equal(results[0]?.type, 'place');
  assert.ok(results.some((result) => result.type === 'artist' && result.title === 'Ana Tijoux'));
  assert.ok(results.some((result) => result.type === 'relationship'));
  assert.ok(results.every((result) => result.matchedFields.length > 0));
});

test('searchCatalog supports type and curation status filters', () => {
  const albums = searchCatalog('Seo2', { types: ['album'], statuses: ['reviewed'] });

  assert.ok(albums.length > 0);
  assert.ok(albums.every((result) => result.type === 'album'));
  assert.ok(albums.every((result) => result.curationStatus === 'reviewed'));
  assert.ok(albums.some((result) => result.href === '/albums/relativo-absoluto-autobiografia-mc'));
});

test('searchCatalog normalizes accents and partial terms', () => {
  const results = searchCatalog('aerolineas makiza');

  assert.ok(results.some((result) => result.type === 'album' && result.title === 'Aerolíneas Makiza'));
});

test('searchCatalog returns empty state for blank queries', () => {
  assert.deepEqual(searchCatalog('   '), []);
});

test('getSearchFilters exposes available result types and editorial statuses', () => {
  const filters = getSearchFilters();

  assert.deepEqual(filters.types.map((type) => type.value), ['artist', 'album', 'place', 'source', 'relationship']);
  assert.ok(filters.statuses.some((status) => status.value === 'reviewed'));
  assert.ok(filters.statuses.some((status) => status.value === 'pending'));
});
