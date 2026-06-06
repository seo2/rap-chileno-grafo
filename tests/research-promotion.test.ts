import assert from 'node:assert/strict';
import test from 'node:test';

import { albums, artists, relationships } from '../src/lib/catalog';
import {
  buildCandidatePromotionPackage,
  getPromotionReadiness,
  getResearchPromotionQueue,
} from '../src/lib/research';

test('getPromotionReadiness blocks already-applied promotions and still validates missing editorial requirements', () => {
  const applied = getPromotionReadiness('candidate-musica-popular-relationship-seo2-makiza');
  assert.ok(applied);

  assert.equal(applied.ready, false);
  assert.deepEqual(applied.blockers, ['promoción ya aplicada al grafo editorial']);
  assert.match(applied.summary, /ya fue aplicada/i);

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

test('buildCandidatePromotionPackage reports an applied relationship promotion without mutating catalog counts', () => {
  const beforeCounts = {
    artists: artists.length,
    albums: albums.length,
    relationships: relationships.length,
  };

  const promotionPackage = buildCandidatePromotionPackage('candidate-musica-popular-relationship-seo2-makiza');

  assert.ok(promotionPackage);
  assert.equal(promotionPackage.candidateId, 'candidate-musica-popular-relationship-seo2-makiza');
  assert.equal(promotionPackage.ready, false);
  assert.equal(promotionPackage.target, 'relationship');
  assert.equal(promotionPackage.appliedRelationshipId, 'rel-seo2-makiza');
  assert.match(promotionPackage.title, /Seo2 ↔ Makiza/);
  assert.match(promotionPackage.patchPreview, /promotedFromCandidateId: 'candidate-musica-popular-relationship-seo2-makiza'/);
  assert.match(promotionPackage.auditTrail.join('\n'), /Música Popular: Seo2/);
  assert.match(promotionPackage.safetyWarning, /ya fue aplicada/);

  assert.deepEqual({
    artists: artists.length,
    albums: albums.length,
    relationships: relationships.length,
  }, beforeCounts);
});

test('getResearchPromotionQueue keeps applied and blocked packages visible after ready items', () => {
  const queue = getResearchPromotionQueue();

  assert.ok(queue.length >= 4);
  assert.ok(queue.every((item) => item.patchPreview.includes('curationStatus') || item.patchPreview.includes('promotedFromCandidateId')));
  assert.ok(queue.some((item) => item.ready === false));
  assert.ok(queue.some((item) => item.appliedRelationshipId === 'rel-seo2-makiza'));
});

test('buildCandidatePromotionPackage returns undefined for unknown candidates', () => {
  assert.equal(buildCandidatePromotionPackage('missing-candidate'), undefined);
  assert.equal(getPromotionReadiness('missing-candidate'), undefined);
});
