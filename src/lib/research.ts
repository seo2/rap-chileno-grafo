import { researchCandidates } from '@/data/seed-research-candidates';
import { sources } from './catalog';
import type { CurationStatus, ResearchCandidate, ResearchCandidateKind, Source } from './catalog';

export { researchCandidates };

export type ResearchCandidateStats = {
  total: number;
  byKind: Partial<Record<ResearchCandidateKind, number>>;
  byStatus: Partial<Record<CurationStatus, number>>;
  bySource: Record<string, number>;
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

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}
