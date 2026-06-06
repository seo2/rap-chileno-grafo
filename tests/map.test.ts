import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getMapFilterOptions,
  getTerritorialMap,
  getTerritorialMapStats,
} from '../src/lib/map';

test('getTerritorialMap groups artists by place using sourced from_place relationships', () => {
  const scenes = getTerritorialMap();

  const santiago = scenes.find((scene) => scene.place.slug === 'santiago');
  assert.ok(santiago);
  assert.equal(santiago.place.name, 'Santiago');
  assert.equal(santiago.coordinates.lat, -33.4489);
  assert.equal(santiago.coordinates.lng, -70.6693);
  assert.ok(santiago.artists.some((artist) => artist.slug === 'seo2'));
  assert.ok(santiago.artists.some((artist) => artist.slug === 'ana-tijoux'));
  assert.ok(santiago.relationships.every((relationship) => relationship.relationshipType === 'from_place'));
  assert.ok(santiago.sources.some((source) => source.id === 'source-curaduria-inicial'));
  assert.ok(santiago.sources.some((source) => source.id === 'source-musica-popular-seo2'));
});

test('getTerritorialMap keeps reviewed territorial evidence separate from pending candidate scenes', () => {
  const scenes = getTerritorialMap();
  const castro = scenes.find((scene) => scene.place.slug === 'castro');

  assert.ok(castro);
  assert.deepEqual(castro.artists.map((artist) => artist.slug), ['seo2']);
  assert.equal(castro.statusCounts.reviewed, 1);
  assert.equal(castro.statusCounts.pending, 0);
  assert.equal(castro.primaryCurationStatus, 'reviewed');
  assert.equal(castro.averageConfidence, 0.7);
});

test('getTerritorialMapStats summarizes populated places, artists and review state', () => {
  const stats = getTerritorialMapStats(getTerritorialMap());

  assert.ok(stats.places >= 2);
  assert.ok(stats.artists >= 6);
  assert.ok(stats.reviewedOrVerified >= 2);
  assert.ok(stats.pendingOrCandidate >= 5);
  assert.ok(stats.sources >= 2);
});

test('getMapFilterOptions exposes scenes in UI-friendly order', () => {
  const options = getMapFilterOptions();

  assert.deepEqual(options.statuses, ['all', 'reviewed', 'candidate', 'pending']);
  assert.ok(options.places.find((place) => place.slug === 'santiago'));
  assert.ok(options.places.find((place) => place.slug === 'castro'));
});
