import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getCurationDashboard,
  getCurationStageLabel,
  getCurationStatusTone,
} from '../src/lib/curation';

test('getCurationDashboard summarizes sources, research candidates and promotion packages in one editorial console', () => {
  const dashboard = getCurationDashboard();

  assert.equal(dashboard.summary.sources, dashboard.sourceBacklog.total);
  assert.equal(dashboard.summary.researchCandidates, dashboard.researchBacklog.total);
  assert.equal(dashboard.summary.appliedPromotions, 1);
  assert.ok(dashboard.summary.blockedPromotions >= 1);
  assert.ok(dashboard.summary.nextActions >= dashboard.nextActions.length);
  assert.ok(dashboard.summary.reviewCoveragePercent >= 0);
  assert.ok(dashboard.summary.reviewCoveragePercent <= 100);
});

test('getCurationDashboard exposes ordered editorial lanes for the /curation view', () => {
  const dashboard = getCurationDashboard();

  assert.deepEqual(
    dashboard.lanes.map((lane) => lane.id),
    ['sources', 'research', 'promotion', 'published'],
  );
  assert.ok(dashboard.lanes.every((lane) => lane.title && lane.description && lane.items.length > 0));
  assert.equal(dashboard.lanes[0]?.items[0]?.href.startsWith('/sources/'), true);
  assert.equal(dashboard.lanes[1]?.items[0]?.href.startsWith('/research/'), true);
  assert.ok(dashboard.lanes[2]?.items.some((item) => item.badge === 'aplicado' && item.href === '/research/promote'));
  assert.ok(dashboard.lanes[3]?.items.some((item) => item.title.includes('Seo2 ↔ Makiza')));
});

test('curation labels and tones make status copy explicit for the UI', () => {
  assert.equal(getCurationStageLabel('sources'), 'Fuentes');
  assert.equal(getCurationStageLabel('research'), 'Investigación');
  assert.equal(getCurationStageLabel('promotion'), 'Promoción');
  assert.equal(getCurationStageLabel('published'), 'Publicado');

  assert.equal(getCurationStatusTone('verified'), 'success');
  assert.equal(getCurationStatusTone('reviewed'), 'info');
  assert.equal(getCurationStatusTone('candidate'), 'warning');
  assert.equal(getCurationStatusTone('pending'), 'danger');
  assert.equal(getCurationStatusTone('rejected'), 'neutral');
});
