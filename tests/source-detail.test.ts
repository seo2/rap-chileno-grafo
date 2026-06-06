import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getCurationQueue,
  getSourceDetail,
  getSourceExtracts,
  getSourceMentionSummary,
} from '../src/lib/sources';

test('getSourceMentionSummary counts every entity type mentioned by a source', () => {
  const summary = getSourceMentionSummary('source-musica-popular-seo2');

  assert.equal(summary.sourceId, 'source-musica-popular-seo2');
  assert.equal(summary.totalMentions, 7);
  assert.equal(summary.byEntityType.artist, 1);
  assert.equal(summary.byEntityType.album, 1);
  assert.equal(summary.byEntityType.place, 1);
  assert.equal(summary.byEntityType.relationship, 4);
  assert.equal(summary.reviewedMentions, 7);
});

test('getSourceExtracts exposes readable facts extracted from source-backed evidence', () => {
  const extracts = getSourceExtracts('source-musica-popular-seo2');

  assert.ok(extracts.some((extract) => extract.entityLabel === 'Seo2' && extract.field === 'bio / resumen'));
  assert.ok(extracts.some((extract) => extract.entityLabel === 'Relativo & absoluto. Autobiografía de un MC' && extract.field === 'lanzamiento'));
  assert.ok(extracts.some((extract) => extract.entityLabel === 'Seo2 → Makiza' && extract.field === 'relación'));
  assert.ok(extracts.every((extract) => extract.sourceId === 'source-musica-popular-seo2'));
  assert.ok(extracts.every((extract) => extract.confidence >= 0 && extract.confidence <= 1));
});

test('getSourceDetail resolves source, mentions, extracts and review metadata', () => {
  const detail = getSourceDetail('source-musica-popular-seo2');

  assert.ok(detail);
  assert.equal(detail.source.name, 'Música Popular: Seo2');
  assert.equal(detail.mentionSummary.totalMentions, 7);
  assert.ok(detail.extracts.length >= 5);
  assert.ok(detail.entities.artists.some((artist) => artist.slug === 'seo2'));
  assert.ok(detail.entities.albums.some((album) => album.slug === 'relativo-absoluto-autobiografia-mc'));
});

test('getCurationQueue prioritizes pending sources and low-confidence extracted facts', () => {
  const queue = getCurationQueue();

  assert.ok(queue.length >= 5);
  assert.ok(queue[0]?.priority >= queue.at(-1)!.priority);
  assert.ok(queue.some((item) => item.sourceId === 'source-spotify-web-api' && item.reason.includes('pendiente')));
  assert.ok(queue.some((item) => item.entityLabel.includes('Movimiento Original') || item.entityLabel.includes('Liricistas')));
});
