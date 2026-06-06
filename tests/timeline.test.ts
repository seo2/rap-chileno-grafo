import assert from 'node:assert/strict';
import test from 'node:test';

import {
  filterTimelineEvents,
  getTimelineDecades,
  getTimelineEventDetail,
  getTimelineStats,
  prepareTimelineEvents,
} from '../src/lib/timeline';

test('prepareTimelineEvents combines album releases, artist eras and relationship milestones chronologically', () => {
  const events = prepareTimelineEvents();

  assert.ok(events.length >= 16);
  assert.equal(events[0]?.year, 1980);
  assert.ok(events.some((event) => event.id === 'artist-artist-panteras-negras-era'));
  assert.ok(events.some((event) => event.id === 'album-album-ser-humano-release' && event.entityType === 'album'));
  assert.ok(events.some((event) => event.id === 'relationship-rel-seo2-relativo-absoluto' && event.entityType === 'relationship'));
  assert.deepEqual(
    events.map((event) => event.year),
    [...events.map((event) => event.year)].sort((a, b) => a - b),
  );
  assert.ok(events.every((event) => event.title && event.description && event.sourceIds.length > 0));
});

test('getTimelineDecades groups timeline events by decade with newest event counts', () => {
  const decades = getTimelineDecades(prepareTimelineEvents());

  assert.ok(decades.some((decade) => decade.label === '1980s'));
  assert.ok(decades.some((decade) => decade.label === '1990s'));
  assert.ok(decades.some((decade) => decade.label === '2000s'));
  assert.ok(decades.some((decade) => decade.label === '2010s'));
  const nineties = decades.find((decade) => decade.label === '1990s');
  assert.ok(nineties);
  assert.ok(nineties.events.length >= 6);
  assert.equal(nineties.startYear, 1990);
});

test('filterTimelineEvents supports artist, place/city and decade filters', () => {
  const events = prepareTimelineEvents();

  const seo2 = filterTimelineEvents(events, { artistSlug: 'seo2' });
  assert.ok(seo2.length >= 3);
  assert.ok(seo2.every((event) => event.artistSlugs.includes('seo2')));

  const castro = filterTimelineEvents(events, { placeSlug: 'castro' });
  assert.ok(castro.some((event) => event.title.includes('Seo2')));
  assert.ok(castro.every((event) => event.placeSlugs.includes('castro')));

  const nineties = filterTimelineEvents(events, { decade: 1990 });
  assert.ok(nineties.length >= 6);
  assert.ok(nineties.every((event) => event.year >= 1990 && event.year < 2000));
});

test('getTimelineEventDetail resolves labels and sources for a timeline event', () => {
  const detail = getTimelineEventDetail('album-album-relativo-absoluto-release');

  assert.ok(detail);
  assert.equal(detail.event.title, 'Relativo & absoluto. Autobiografía de un MC');
  assert.ok(detail.artists.some((artist) => artist.slug === 'seo2'));
  assert.ok(detail.sources.some((source) => source.id === 'source-musica-popular-seo2'));
});

test('getTimelineStats summarizes eras, decades and review status', () => {
  const stats = getTimelineStats(prepareTimelineEvents());

  assert.ok(stats.total >= 16);
  assert.ok(stats.decades >= 4);
  assert.ok(stats.verifiedOrReviewed >= 3);
  assert.ok(stats.pendingOrCandidate >= 1);
});
