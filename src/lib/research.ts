import { researchCandidates } from '@/data/seed-research-candidates';
import { albums, artists, places, relationships, sources } from './catalog';
import type { CurationStatus, ResearchCandidate, ResearchCandidateKind, Source } from './catalog';

export { researchCandidates };

export type ResearchCandidateStats = {
  total: number;
  byKind: Partial<Record<ResearchCandidateKind, number>>;
  byStatus: Partial<Record<CurationStatus, number>>;
  bySource: Record<string, number>;
};

export type CandidateReviewChecklistItem = {
  id: 'open-source' | 'capture-quote' | 'verify-second-source' | 'resolve-entities' | 'decide-target';
  label: string;
  description: string;
  required: boolean;
};

export type CandidatePromotionTarget = 'artist' | 'album' | 'relationship' | 'timeline_event' | 'source_quote';

export type CandidatePromotionDraft = {
  target: CandidatePromotionTarget;
  statusAfterPromotion: 'candidate';
  suggestedFields: Array<{ name: string; value: string }>;
  warning: string;
};

export type CandidateReviewDetail = {
  candidate: ResearchCandidate;
  source?: Source;
  checklist: CandidateReviewChecklistItem[];
  promotionDraft: CandidatePromotionDraft;
  relatedEntityLabels: string[];
};

export type CandidatePromotionReadiness = {
  ready: boolean;
  blockers: string[];
  summary: string;
};

export type CandidatePromotionPackage = CandidatePromotionReadiness & {
  candidateId: string;
  title: string;
  target: CandidatePromotionTarget;
  priority: number;
  patchPreview: string;
  auditTrail: string[];
  safetyWarning: string;
};

const externalResearchSourceIds = [
  'source-redbull-cronologia',
  'source-rapchileno-cl',
  'source-shia-discos',
  'source-imperio-h2',
  'source-chile-vieja-escuela',
  'source-tesis-academicas',
  'source-musica-popular',
  'source-musica-popular-seo2',
];

export function getResearchCandidateQueue(): ResearchCandidate[] {
  return [...researchCandidates].sort((a, b) => (
    b.priority - a.priority
    || b.confidence - a.confidence
    || a.label.localeCompare(b.label)
  ));
}

export function getResearchCandidateById(id: string): ResearchCandidate | undefined {
  return researchCandidates.find((candidate) => candidate.id === id);
}

export function getCandidateReviewChecklist(candidate: ResearchCandidate): CandidateReviewChecklistItem[] {
  return [
    {
      id: 'open-source',
      label: candidate.sourceUrl ? 'Abrir fuente primaria' : 'Localizar URL específica de la fuente',
      description: candidate.sourceUrl
        ? `Revisar ${candidate.sourceUrl} y confirmar que el claim está respaldado.`
        : 'Buscar la ficha, nota o documento exacto antes de avanzar.',
      required: true,
    },
    {
      id: 'capture-quote',
      label: 'Capturar cita textual y fecha de consulta',
      description: 'Guardar fragmento exacto, autor/medio si aparece, URL y fecha de consulta para trazabilidad.',
      required: true,
    },
    {
      id: 'verify-second-source',
      label: 'Verificar con segunda fuente independiente',
      description: 'Contrastar el claim con otra fuente antes de convertirlo en dato del grafo o timeline.',
      required: true,
    },
    {
      id: 'resolve-entities',
      label: 'Resolver entidades relacionadas',
      description: candidate.relatedEntityIds.length
        ? `Confirmar estos enlaces: ${candidate.relatedEntityIds.map(getEntityLabel).join(', ')}.`
        : 'Definir si el claim crea nuevas entidades o se vincula con entidades existentes.',
      required: true,
    },
    {
      id: 'decide-target',
      label: 'Decidir destino editorial',
      description: `Evaluar si corresponde crear ${getPromotionTargetLabel(getPromotionTarget(candidate.kind))}, descartarlo o mantenerlo pendiente.`,
      required: true,
    },
  ];
}

export function buildCandidatePromotionDraft(candidate: ResearchCandidate): CandidatePromotionDraft {
  const target = getPromotionTarget(candidate.kind);
  return {
    target,
    statusAfterPromotion: 'candidate',
    suggestedFields: [
      { name: 'label', value: candidate.label },
      { name: 'sourceIds', value: [candidate.sourceId].join(', ') },
      { name: 'confidence', value: String(candidate.confidence) },
      { name: 'curationStatus', value: 'candidate' },
      { name: 'relatedEntityIds', value: candidate.relatedEntityIds.join(', ') || 'pendiente' },
      { name: 'notes', value: candidate.notes ?? candidate.reviewAction },
    ],
    warning: 'No crear automáticamente: este borrador solo orienta una promoción manual después de completar el checklist.',
  };
}

export function getCandidateReviewDetail(id: string): CandidateReviewDetail | undefined {
  const candidate = getResearchCandidateById(id);
  if (!candidate) return undefined;

  return {
    candidate,
    source: sources.find((source) => source.id === candidate.sourceId),
    checklist: getCandidateReviewChecklist(candidate),
    promotionDraft: buildCandidatePromotionDraft(candidate),
    relatedEntityLabels: candidate.relatedEntityIds.map(getEntityLabel),
  };
}

export function getPromotionReadiness(id: string): CandidatePromotionReadiness | undefined {
  const candidate = getResearchCandidateById(id);
  if (!candidate) return undefined;

  const blockers: string[] = [];
  const extractedText = candidate.extractedText?.trim();
  const notes = candidate.notes?.toLowerCase() ?? '';

  if (candidate.curationStatus !== 'candidate') blockers.push('estado editorial todavía pendiente');
  if (!candidate.sourceUrl) blockers.push('falta URL específica de fuente primaria');
  if (!extractedText || /^pendiente/i.test(extractedText)) blockers.push('falta cita textual verificable');
  if (!notes.includes('segunda') && !notes.includes('verificación') && !notes.includes('evidencia revisada')) {
    blockers.push('requiere segunda fuente o nota de verificación cruzada');
  }

  const ready = blockers.length === 0;
  return {
    ready,
    blockers,
    summary: ready
      ? 'Lista para promoción editorial manual: tiene estado candidato, URL primaria, texto extraído y nota de verificación cruzada.'
      : `Bloqueada por ${blockers.length} requisito${blockers.length === 1 ? '' : 's'} editorial${blockers.length === 1 ? '' : 'es'}.`,
  };
}

export function buildCandidatePromotionPackage(id: string): CandidatePromotionPackage | undefined {
  const candidate = getResearchCandidateById(id);
  const readiness = getPromotionReadiness(id);
  if (!candidate || !readiness) return undefined;

  const draft = buildCandidatePromotionDraft(candidate);
  return {
    ...readiness,
    candidateId: candidate.id,
    title: candidate.label,
    target: draft.target,
    priority: candidate.priority,
    patchPreview: buildPatchPreview(candidate, draft.target),
    auditTrail: [
      `Fuente primaria: ${candidate.sourceName}${candidate.sourceUrl ? ` (${candidate.sourceUrl})` : ''}`,
      `Claim revisado: ${candidate.claim}`,
      `Texto/cita: ${candidate.extractedText ?? 'pendiente de capturar'}`,
      `Entidades: ${candidate.relatedEntityIds.map(getEntityLabel).join(', ') || 'pendiente de resolver'}`,
      `Confianza: ${Math.round(candidate.confidence * 100)}%`,
    ],
    safetyWarning: 'No muta el dataset semilla: este paquete es un parche editorial para copiar, revisar y aplicar manualmente.',
  };
}

export function getResearchPromotionQueue(): CandidatePromotionPackage[] {
  return getResearchCandidateQueue()
    .map((candidate) => buildCandidatePromotionPackage(candidate.id))
    .filter((candidate): candidate is CandidatePromotionPackage => Boolean(candidate))
    .sort((a, b) => Number(b.ready) - Number(a.ready) || b.priority - a.priority || a.title.localeCompare(b.title));
}

export function getCandidatesBySource(sourceId: string): ResearchCandidate[] {
  return getResearchCandidateQueue().filter((candidate) => candidate.sourceId === sourceId);
}

export function getResearchSources(): Source[] {
  const candidateCounts = getCandidateStats().bySource;
  return sources
    .filter((source) => externalResearchSourceIds.includes(source.id) || candidateCounts[source.id])
    .filter((source) => source.curationStatus !== 'verified')
    .sort((a, b) => {
      const aHasCandidates = candidateCounts[a.id] ? 1 : 0;
      const bHasCandidates = candidateCounts[b.id] ? 1 : 0;
      return bHasCandidates - aHasCandidates
        || externalResearchSourceIds.indexOf(a.id) - externalResearchSourceIds.indexOf(b.id)
        || a.name.localeCompare(b.name);
    });
}

export function getCandidateStats(): ResearchCandidateStats {
  return {
    total: researchCandidates.length,
    byKind: countBy<ResearchCandidateKind>(researchCandidates.map((candidate) => candidate.kind)),
    byStatus: countBy<CurationStatus>(researchCandidates.map((candidate) => candidate.curationStatus)),
    bySource: countBy<string>(researchCandidates.map((candidate) => candidate.sourceId)),
  };
}

export function getCandidateKindLabel(kind: ResearchCandidateKind) {
  const labels: Record<ResearchCandidateKind, string> = {
    candidate_artist: 'artista candidato',
    candidate_album: 'disco candidato',
    candidate_relationship: 'relación candidata',
    candidate_event: 'hito candidato',
    candidate_source_quote: 'cita candidata',
  };
  return labels[kind];
}

function getPromotionTarget(kind: ResearchCandidateKind): CandidatePromotionTarget {
  const targets: Record<ResearchCandidateKind, CandidatePromotionTarget> = {
    candidate_artist: 'artist',
    candidate_album: 'album',
    candidate_relationship: 'relationship',
    candidate_event: 'timeline_event',
    candidate_source_quote: 'source_quote',
  };
  return targets[kind];
}

function getPromotionTargetLabel(target: CandidatePromotionTarget) {
  const labels: Record<CandidatePromotionTarget, string> = {
    artist: 'una ficha de artista candidata',
    album: 'una ficha de disco candidata',
    relationship: 'una relación candidata',
    timeline_event: 'un hito candidato del timeline',
    source_quote: 'una cita de fuente candidata',
  };
  return labels[target];
}

function buildPatchPreview(candidate: ResearchCandidate, target: CandidatePromotionTarget) {
  const baseFields = [
    `sourceIds: ['${candidate.sourceId}']`,
    `sourceName: '${escapePatchValue(candidate.sourceName)}'`,
    `sourceUrl: '${escapePatchValue(candidate.sourceUrl ?? 'pendiente')}'`,
    `confidence: ${candidate.confidence}`,
    `curationStatus: 'candidate'`,
    `notes: '${escapePatchValue(candidate.notes ?? candidate.reviewAction)}'`,
  ];

  if (target === 'relationship') {
    const [source = 'pendiente', targetEntity = 'pendiente'] = candidate.relatedEntityIds;
    return [
      'relationships.push({',
      `  id: '${candidate.id.replace('candidate-', 'relationship-candidate-')}',`,
      `  source: '${source}',`,
      `  target: '${targetEntity}',`,
      "  relationshipType: 'associated_with_era',",
      '  weight: 1,',
      ...baseFields.map((field) => `  ${field},`),
      '});',
    ].join('\n');
  }

  if (target === 'album') {
    return [
      'albums.push({',
      `  id: '${candidate.id.replace('candidate-', 'album-candidate-')}',`,
      `  slug: '${slugify(candidate.label)}',`,
      `  title: '${escapePatchValue(candidate.label)}',`,
      `  artistId: '${candidate.relatedEntityIds.find((id) => id.startsWith('artist-')) ?? 'pendiente'}',`,
      '  year: 0,',
      "  type: 'album',",
      ...baseFields.map((field) => `  ${field},`),
      '});',
    ].join('\n');
  }

  if (target === 'artist') {
    return [
      'artists.push({',
      `  id: '${candidate.id.replace('candidate-', 'artist-candidate-')}',`,
      `  slug: '${slugify(candidate.label)}',`,
      `  name: '${escapePatchValue(candidate.label)}',`,
      "  city: 'pendiente',",
      "  region: 'pendiente',",
      "  era: '2020s',",
      `  summary: '${escapePatchValue(candidate.claim)}',`,
      '  tags: [],',
      ...baseFields.map((field) => `  ${field},`),
      '});',
    ].join('\n');
  }

  if (target === 'timeline_event') {
    return [
      'timelineEvents.push({',
      `  id: '${candidate.id.replace('candidate-', 'event-candidate-')}',`,
      "  year: 0,",
      `  title: '${escapePatchValue(candidate.label)}',`,
      `  description: '${escapePatchValue(candidate.claim)}',`,
      "  curationStatus: 'candidate',",
      `  sourceId: '${candidate.sourceId}',`,
      '});',
    ].join('\n');
  }

  return [
    'sourceQuotes.push({',
    `  id: '${candidate.id.replace('candidate-', 'quote-candidate-')}',`,
    `  entityIds: [${candidate.relatedEntityIds.map((id) => `'${id}'`).join(', ')}],`,
    `  quote: '${escapePatchValue(candidate.extractedText ?? candidate.claim)}',`,
    ...baseFields.map((field) => `  ${field},`),
    '});',
  ].join('\n');
}

function escapePatchValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'pendiente';
}

function getEntityLabel(entityId: string) {
  return artists.find((artist) => artist.id === entityId)?.name
    ?? albums.find((album) => album.id === entityId)?.title
    ?? places.find((place) => place.id === entityId)?.name
    ?? relationships.find((relationship) => relationship.id === entityId)?.relationshipType.replaceAll('_', ' ')
    ?? entityId;
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}
