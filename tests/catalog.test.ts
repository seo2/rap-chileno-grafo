import assert from 'node:assert/strict';
import test from 'node:test';

import { getGraphStats, getRapOnlyArtists, getRelationshipEdges } from '../src/lib/catalog';

test('getRapOnlyArtists excludes future urban/trap crossover artists by default', () => {
  const artists = getRapOnlyArtists();
  assert.ok(artists.length >= 8);
  assert.equal(artists.some((artist) => artist.urbanCrossover === true), false);
  assert.ok(artists.some((artist) => artist.slug === 'ana-tijoux'));
});

test('getRelationshipEdges returns graph-ready edges between existing nodes', () => {
  const edges = getRelationshipEdges();
  assert.ok(edges.length >= 10);
  assert.ok(edges.every((edge) => edge.source && edge.target && edge.relationshipType));
  assert.ok(edges.some((edge) => edge.relationshipType === 'collaborated_with'));
});

test('getGraphStats summarizes seed data for dashboard cards', () => {
  const stats = getGraphStats();
  assert.ok(stats.artists >= 8);
  assert.ok(stats.relationships >= 10);
  assert.ok(stats.places >= 3);
  assert.ok(stats.eras >= 4);
});
