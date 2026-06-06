import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCandidatePromotionDraft,
  getCandidateReviewChecklist,
  getCandidateReviewDetail,
  getResearchCandidateById,
} from '../src/lib/research';

test('getResearchCandidateById resolves one external research candidate for detail pages', () => {
  const candidate = getResearchCandidateById('candidate-redbull-event-old-school-era');

  assert.ok(candidate);
  assert.equal(candidate.kind, 'candidate_event');
  assert.equal(candidate.sourceId, 'source-redbull-cronologia');
});

test('getCandidateReviewChecklist creates mandatory review steps before publishing a candidate', () => {
  const candidate = getResearchCandidateById('candidate-redbull-event-old-school-era');
  assert.ok(candidate);

  const checklist = getCandidateReviewChecklist(candidate);

  assert.ok(checklist.length >= 5);
  assert.deepEqual(
    checklist.map((item) => item.id),
    ['open-source', 'capture-quote', 'verify-second-source', 'resolve-entities', 'decide-target'],
  );
  assert.ok(checklist.every((item) => item.required));
  assert.ok(checklist.some((item) => item.label.includes('segunda fuente')));
});

test('buildCandidatePromotionDraft describes target entity without mutating curated catalog', () => {
  const candidate = getResearchCandidateById('candidate-shia-album-ser-humano');
  assert.ok(candidate);

  const draft = buildCandidatePromotionDraft(candidate);

  assert.equal(draft.target, 'album');
  assert.equal(draft.statusAfterPromotion, 'candidate');
  assert.ok(draft.suggestedFields.some((field) => field.name === 'sourceIds' && field.value.includes('source-shia-discos')));
  assert.ok(draft.warning.includes('No crear automáticamente'));
});

test('getCandidateReviewDetail combines candidate, source, checklist and promotion draft', () => {
  const detail = getCandidateReviewDetail('candidate-musica-popular-quote-seo2');

  assert.ok(detail);
  assert.equal(detail.candidate.kind, 'candidate_source_quote');
  assert.equal(detail.source?.id, 'source-musica-popular-seo2');
  assert.ok(detail.checklist.length >= 5);
  assert.equal(detail.promotionDraft.target, 'source_quote');
  assert.ok(detail.relatedEntityLabels.includes('Seo2'));
});

test('getCandidateReviewDetail returns undefined for unknown candidate ids', () => {
  assert.equal(getCandidateReviewDetail('missing-candidate'), undefined);
});
