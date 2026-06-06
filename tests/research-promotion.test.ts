import assert from 'node:assert/strict';
import test from 'node:test';

import { albums, artists, relationships } from '../src/lib/catalog';
import {
  buildCandidatePromotionPackage,
  getPromotionReadiness,
  getResearchPromotionQueue,
} from '../src/lib/research';

test('getPromotionReadiness requires candidate status, source URL, quote and second-source verification', () => {
  const ready = getPromotionReadiness('candidate-musica-popular-relationship-seo2-makiza');
  assert.ok(ready);

  assert.equal(ready.ready, true);
  assert.equal(ready.blockers.length, 0);
  assert.match(ready.summary, /lista para promoción editorial/i);

  const blocked = getPromotionReadiness('candidate-shia-album-ser-humano');
  assert.ok(blocked);

  assert.equal(blocked.ready, false);
  assert.deepEqual(blocked.blockers, [
    'estado editorial todavía pendiente',
    'falta URL específica de fuente primaria',
    'falta cita textual verificable',
    'requiere segunda fuente o nota de verificación cruzada',
  ]);
});

test('buildCandidatePromotionPackage creates a non-mutating editorial patch for a ready relationship candidate', () => {
  const beforeCounts = {
    artists: artists.length,
    albums: albums.length,
    relationships: relationships.length,
  };

  const promotionPackage = buildCandidatePromotionPackage('candidate-musica-popular-relationship-seo2-makiza');

  assert.ok(promotionPackage);
  assert.equal(promotionPackage.candidateId, 'candidate-musica-popular-relationship-seo2-makiza');
  assert.equal(promotionPackage.ready, true);
  assert.equal(promotionPackage.target, 'relationship');
  assert.match(promotionPackage.title, /Seo2 ↔ Makiza/);
  assert.match(promotionPackage.patchPreview, /relationshipType: 'associated_with_era'|relationshipType: 'collaborated_with'/);
  assert.match(promotionPackage.auditTrail.join('\n'), /Música Popular: Seo2/);
  assert.match(promotionPackage.safetyWarning, /No muta el dataset semilla/);

  assert.deepEqual({
    artists: artists.length,
    albums: albums.length,
    relationships: relationships.length,
  }, beforeCounts);
});

test('getResearchPromotionQueue ranks ready promotion packages before blocked drafts', () => {
  const queue = getResearchPromotionQueue();

  assert.ok(queue.length >= 4);
  assert.equal(queue[0].ready, true);
  assert.equal(queue[0].candidateId, 'candidate-musica-popular-relationship-seo2-makiza');
  assert.ok(queue.some((item) => item.ready === false));
  assert.ok(queue.every((item) => item.patchPreview.includes('curationStatus')));
});

test('buildCandidatePromotionPackage returns undefined for unknown candidates', () => {
  assert.equal(buildCandidatePromotionPackage('missing-candidate'), undefined);
  assert.equal(getPromotionReadiness('missing-candidate'), undefined);
});
