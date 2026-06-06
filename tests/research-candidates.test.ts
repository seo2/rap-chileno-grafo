import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getCandidateStats,
  getCandidatesBySource,
  getResearchCandidateQueue,
  getResearchSources,
} from '../src/lib/research';

test('getResearchCandidateQueue exposes external research candidates without publishing them as verified data', () => {
  const queue = getResearchCandidateQueue();

  assert.ok(queue.length >= 6);
  assert.ok(queue.some((candidate) => candidate.kind === 'candidate_artist'));
  assert.ok(queue.some((candidate) => candidate.kind === 'candidate_album'));
  assert.ok(queue.some((candidate) => candidate.kind === 'candidate_relationship'));
  assert.ok(queue.some((candidate) => candidate.kind === 'candidate_event'));
  assert.ok(queue.some((candidate) => candidate.kind === 'candidate_source_quote'));
  assert.ok(queue.every((candidate) => candidate.curationStatus === 'candidate' || candidate.curationStatus === 'pending'));
  assert.ok(queue.every((candidate) => candidate.confidence < 0.9));
});

test('getResearchCandidateQueue sorts by priority, confidence and label for review work', () => {
  const queue = getResearchCandidateQueue();

  assert.ok(queue[0]);
  assert.ok(queue.at(-1));
  assert.ok(queue[0]!.priority >= queue.at(-1)!.priority);
  assert.equal(queue[0]!.reviewAction, 'verificar contra segunda fuente antes de publicar');
});

test('getCandidatesBySource groups source-backed candidates with extracted claims and URLs', () => {
  const redBullCandidates = getCandidatesBySource('source-redbull-cronologia');

  assert.ok(redBullCandidates.length >= 2);
  assert.ok(redBullCandidates.every((candidate) => candidate.sourceId === 'source-redbull-cronologia'));
  assert.ok(redBullCandidates.every((candidate) => candidate.sourceUrl?.startsWith('https://')));
  assert.ok(redBullCandidates.some((candidate) => candidate.kind === 'candidate_event'));
});

test('getCandidateStats counts research candidates by type, source and status', () => {
  const stats = getCandidateStats();

  assert.ok(stats.total >= 6);
  assert.ok((stats.byKind.candidate_artist ?? 0) >= 1);
  assert.ok((stats.byKind.candidate_album ?? 0) >= 1);
  assert.ok((stats.byKind.candidate_relationship ?? 0) >= 1);
  assert.ok((stats.byKind.candidate_event ?? 0) >= 1);
  assert.ok((stats.byKind.candidate_source_quote ?? 0) >= 1);
  assert.ok((stats.byStatus.candidate ?? 0) >= 1);
  assert.ok((stats.bySource['source-redbull-cronologia'] ?? 0) >= 1);
});

test('getResearchSources returns the external source backlog in review order', () => {
  const researchSources = getResearchSources();

  assert.ok(researchSources.length >= 5);
  assert.equal(researchSources[0]!.id, 'source-redbull-cronologia');
  assert.ok(researchSources.every((source) => source.curationStatus !== 'verified'));
});
