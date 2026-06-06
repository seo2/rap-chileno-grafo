import assert from 'node:assert/strict';
import test from 'node:test';

import { relationships } from '../src/lib/catalog';
import { getRelationshipSummary } from '../src/lib/graph';
import { getSourceDetail } from '../src/lib/sources';
import {
  buildCandidatePromotionPackage,
  getResearchPromotionQueue,
} from '../src/lib/research';

const promotedCandidateId = 'candidate-musica-popular-relationship-seo2-makiza';

test('Sprint 11 applies the Seo2 ↔ Makiza promotion to the existing relationship without duplicating it', () => {
  const matchingRelationships = relationships.filter((relationship) => (
    relationship.source === 'artist-seo2'
    && relationship.target === 'artist-makiza'
    && relationship.sourceIds.includes('source-musica-popular-seo2')
  ));

  assert.equal(matchingRelationships.length, 1);

  const [relationship] = matchingRelationships;
  assert.equal(relationship.id, 'rel-seo2-makiza');
  assert.equal(relationship.curationStatus, 'reviewed');
  assert.equal(relationship.promotedFromCandidateId, promotedCandidateId);
  assert.match(relationship.notes ?? '', /Promoción editorial Sprint 11/);
});

test('promoted relationship remains visible in graph summaries with promotion provenance', () => {
  const summary = getRelationshipSummary('rel-seo2-makiza');

  assert.ok(summary);
  assert.equal(summary.display, 'Seo2 → integrante de → Makiza');
  assert.equal(summary.promotedFromCandidateId, promotedCandidateId);
  assert.match(summary.notes ?? '', /Música Popular/);
});

test('source detail exposes the promoted relationship as reviewed evidence', () => {
  const detail = getSourceDetail('source-musica-popular-seo2');

  assert.ok(detail);
  assert.ok(detail.entities.relationships.some((relationship) => relationship.promotedFromCandidateId === promotedCandidateId));
  assert.ok(detail.extracts.some((extract) => (
    extract.entityId === 'rel-seo2-makiza'
    && extract.value.includes('Promoción editorial Sprint 11')
  )));
});

test('promotion queue marks the applied candidate as already promoted instead of ready to apply', () => {
  const promotionPackage = buildCandidatePromotionPackage(promotedCandidateId);

  assert.ok(promotionPackage);
  assert.equal(promotionPackage.ready, false);
  assert.deepEqual(promotionPackage.blockers, ['promoción ya aplicada al grafo editorial']);
  assert.equal(promotionPackage.appliedRelationshipId, 'rel-seo2-makiza');

  const queueItem = getResearchPromotionQueue().find((item) => item.candidateId === promotedCandidateId);
  assert.ok(queueItem);
  assert.equal(queueItem.ready, false);
  assert.equal(queueItem.appliedRelationshipId, 'rel-seo2-makiza');
});
