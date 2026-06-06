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
