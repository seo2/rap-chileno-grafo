import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { filterGraphData, getGraphNodeDetail, getGraphNeighborhood, getRelationshipSummary, prepareGraphCanvasData } from '../src/lib/graph';

test('prepareGraphCanvasData returns nodes and edges ready for the interactive canvas', () => {
  const graph = prepareGraphCanvasData();

  assert.ok(graph.nodes.length >= 15);
  assert.ok(graph.edges.length >= 10);
  assert.ok(graph.nodes.some((node) => node.id === graph.initialSelectedNodeId));
  assert.ok(graph.nodes.every((node) => typeof node.radius === 'number' && node.radius >= 8));
  assert.ok(graph.edges.every((edge) => graph.nodeIds.has(edge.source) && graph.nodeIds.has(edge.target)));
});

test('filterGraphData can keep only artists and relationships between visible nodes', () => {
  const graph = prepareGraphCanvasData();
  const filtered = filterGraphData(graph, { kinds: ['artist'], statuses: ['candidate', 'pending', 'reviewed', 'verified'] });

  assert.ok(filtered.nodes.length > 0);
  assert.ok(filtered.nodes.every((node) => node.kind === 'artist'));
  assert.ok(filtered.edges.every((edge) => filtered.nodeIds.has(edge.source) && filtered.nodeIds.has(edge.target)));
});

test('filterGraphData can focus reviewed pipeline by curation status', () => {
  const graph = prepareGraphCanvasData();
  const pending = filterGraphData(graph, { statuses: ['pending'] });

  assert.ok(pending.nodes.length > 0);
  assert.ok(pending.nodes.every((node) => node.curationStatus === 'pending'));
  assert.ok(pending.edges.every((edge) => pending.nodeIds.has(edge.source) && pending.nodeIds.has(edge.target)));
});

test('filterGraphData can search by artist, album, place and tag text', () => {
  const graph = prepareGraphCanvasData();
  const seo2 = filterGraphData(graph, { query: 'chiloé' });

  assert.ok(seo2.nodes.some((node) => node.id === 'artist-seo2'));
  assert.ok(seo2.nodes.some((node) => node.id === 'place-castro'));
  assert.equal(seo2.nodes.some((node) => node.id === 'artist-ana-tijoux'), false);
  assert.ok(seo2.edges.every((edge) => seo2.nodeIds.has(edge.source) && seo2.nodeIds.has(edge.target)));
});

test('getRelationshipSummary returns human readable labels instead of raw ids', () => {
  const summary = getRelationshipSummary('rel-seo2-makiza');

  assert.equal(summary?.typeLabel, 'integrante de');
  assert.equal(summary?.sourceLabel, 'Seo2');
  assert.equal(summary?.targetLabel, 'Makiza');
  assert.equal(summary?.display, 'Seo2 → integrante de → Makiza');
});

test('getGraphNeighborhood identifies the selected node and its direct neighbors', () => {
  const neighborhood = getGraphNeighborhood('artist-seo2');

  assert.ok(neighborhood.selectedNodeIds.has('artist-seo2'));
  assert.ok(neighborhood.neighborNodeIds.has('artist-makiza'));
  assert.ok(neighborhood.neighborNodeIds.has('album-relativo-absoluto'));
  assert.ok(neighborhood.edgeIds.has('rel-seo2-makiza'));
  assert.equal(neighborhood.isDimmedNode('artist-seo2'), false);
  assert.equal(neighborhood.isDimmedNode('artist-ana-tijoux'), true);
});

test('getGraphNodeDetail resolves selected node metadata, readable relationships and neighborhood', () => {
  const detail = getGraphNodeDetail('artist-seo2');

  assert.equal(detail?.label, 'Seo2');
  assert.equal(detail?.kind, 'artist');
  assert.equal(detail?.href, '/artists/seo2');
  assert.ok(detail?.sources.some((source) => source.name === 'Música Popular: Seo2'));
  assert.ok(detail?.relationships.some((relationship) => relationship.id === 'rel-seo2-makiza'));
  assert.ok(detail?.relationshipSummaries.some((relationship) => relationship.display === 'Seo2 → integrante de → Makiza'));
  assert.ok(detail?.neighborNodeIds.includes('artist-makiza'));
});
