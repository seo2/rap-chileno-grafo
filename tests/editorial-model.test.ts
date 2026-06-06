import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { albums, artists, relationships } from '../src/lib/catalog';
import { getGraphNodes } from '../src/lib/graph';
import { getSourceById, getSourcesForEntity, getSourcesForRelationship, getSourceStats } from '../src/lib/sources';

test('seed entities expose editorial evidence fields', () => {
  const ana = artists.find((artist) => artist.slug === 'ana-tijoux');
  assert.ok(ana);
  assert.equal(ana.curationStatus, 'candidate');
  assert.ok(ana.sourceIds.includes('source-curaduria-inicial'));
  assert.equal(typeof ana.confidence, 'number');

  const album = albums.find((candidate) => candidate.id === 'album-ser-humano');
  assert.ok(album);
  assert.ok(album.sourceIds.includes('source-curaduria-inicial'));
  assert.equal(album.curationStatus, 'candidate');
});

test('relationships point to sources and have curation status', () => {
  const relationship = relationships.find((candidate) => candidate.id === 'rel-ana-makiza');
  assert.ok(relationship);
  assert.equal(relationship.curationStatus, 'candidate');
  assert.deepEqual(relationship.sourceIds, ['source-curaduria-inicial']);
});

test('source helpers connect entities and relationships to source records', () => {
  const spotify = getSourceById('source-spotify-web-api');
  assert.equal(spotify?.sourceType, 'api');

  const artistSources = getSourcesForEntity('artist-ana-tijoux');
  assert.ok(artistSources.some((source) => source.id === 'source-curaduria-inicial'));

  const relationshipSources = getSourcesForRelationship('rel-ana-makiza');
  assert.ok(relationshipSources.some((source) => source.name === 'Curaduría inicial'));
});

test('source stats summarize review pipeline', () => {
  const stats = getSourceStats();
  assert.ok(stats.total >= 5);
  assert.ok(stats.byStatus.pending >= 1);
  assert.ok(stats.byType.api >= 1);
});

test('graph helpers return typed nodes for artists, albums and places', () => {
  const nodes = getGraphNodes();
  assert.ok(nodes.some((node) => node.id === 'artist-ana-tijoux' && node.kind === 'artist'));
  assert.ok(nodes.some((node) => node.id === 'album-ser-humano' && node.kind === 'album'));
  assert.ok(nodes.some((node) => node.id === 'place-santiago' && node.kind === 'place'));
  assert.ok(nodes.every((node) => node.label && node.curationStatus));
});
