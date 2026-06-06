import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { filterGraphData, getGraphNodeDetail, prepareGraphCanvasData } from '../src/lib/graph';

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

test('getGraphNodeDetail resolves selected node metadata and neighborhood', () => {
  const detail = getGraphNodeDetail('artist-ana-tijoux');

  assert.equal(detail?.label, 'Ana Tijoux');
  assert.equal(detail?.kind, 'artist');
  assert.ok(detail?.sources.some((source) => source.name === 'Curaduría inicial'));
  assert.ok(detail?.relationships.some((relationship) => relationship.id === 'rel-ana-makiza'));
});
