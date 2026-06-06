import { relationships } from './catalog';
import type { CurationStatus } from './catalog';
import { getCurationQueue, getSourceStats } from './sources';
import {
  getCandidateStats,
  getResearchCandidateQueue,
  getResearchPromotionQueue,
  getResearchSources,
} from './research';

export type CurationStage = 'sources' | 'research' | 'promotion' | 'published';
export type CurationTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

export type CurationLaneItem = {
  id: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  badge: string;
  tone: CurationTone;
  priority: number;
};

export type CurationLane = {
  id: CurationStage;
  title: string;
  description: string;
  items: CurationLaneItem[];
};

export type CurationDashboard = {
  summary: {
    sources: number;
    researchCandidates: number;
    readyPromotions: number;
    appliedPromotions: number;
    blockedPromotions: number;
    nextActions: number;
    reviewCoveragePercent: number;
  };
  sourceBacklog: ReturnType<typeof getSourceStats>;
  researchBacklog: ReturnType<typeof getCandidateStats>;
  lanes: CurationLane[];
  nextActions: CurationLaneItem[];
};

const stageLabels: Record<CurationStage, string> = {
  sources: 'Fuentes',
  research: 'Investigación',
  promotion: 'Promoción',
  published: 'Publicado',
};

export function getCurationStageLabel(stage: CurationStage) {
  return stageLabels[stage];
}

export function getCurationStatusTone(status: CurationStatus): CurationTone {
  const tones: Record<CurationStatus, CurationTone> = {
    verified: 'success',
    reviewed: 'info',
    candidate: 'warning',
    pending: 'danger',
    rejected: 'neutral',
  };
  return tones[status] ?? 'neutral';
}

export function getCurationDashboard(): CurationDashboard {
  const sourceStats = getSourceStats();
  const candidateStats = getCandidateStats();
  const sourceQueue = getCurationQueue();
  const researchQueue = getResearchCandidateQueue();
  const researchSources = getResearchSources();
  const promotionQueue = getResearchPromotionQueue();
  const appliedPromotions = promotionQueue.filter((item) => item.appliedRelationshipId);
  const readyPromotions = promotionQueue.filter((item) => item.ready);
  const blockedPromotions = promotionQueue.filter((item) => !item.ready && !item.appliedRelationshipId);
  const publishedRelationships = relationships.filter((relationship) => relationship.promotedFromCandidateId);

  const lanes: CurationLane[] = [
    {
      id: 'sources',
      title: '1. Fuentes por revisar',
      description: 'Entrada editorial: archivos, APIs y referencias que necesitan revisión o extracción de datos.',
      items: sourceQueue.slice(0, 5).map((item) => ({
        id: item.id,
        title: item.entityLabel,
        description: item.reason,
        meta: `${item.sourceName} · prioridad ${item.priority}${typeof item.confidence === 'number' ? ` · confianza ${Math.round(item.confidence * 100)}%` : ''}`,
        href: `/sources/${item.sourceId}`,
        badge: item.curationStatus,
        tone: getCurationStatusTone(item.curationStatus),
        priority: item.priority,
      })),
    },
    {
      id: 'research',
      title: '2. Claims candidatos',
      description: 'Claims externos separados del catálogo hasta capturar cita, URL específica y verificación cruzada.',
      items: researchQueue.slice(0, 5).map((candidate) => ({
        id: candidate.id,
        title: candidate.label,
        description: candidate.reviewAction,
        meta: `${candidate.sourceName} · prioridad ${candidate.priority} · confianza ${Math.round(candidate.confidence * 100)}%`,
        href: `/research/${candidate.id}`,
        badge: candidate.curationStatus,
        tone: getCurationStatusTone(candidate.curationStatus),
        priority: candidate.priority,
      })),
    },
    {
      id: 'promotion',
      title: '3. Promoción editorial',
      description: 'Paquetes manuales: listos, bloqueados o ya aplicados sin mutar automáticamente los seeds.',
      items: promotionQueue.slice(0, 5).map((promotionPackage) => ({
        id: promotionPackage.candidateId,
        title: promotionPackage.title,
        description: promotionPackage.summary,
        meta: promotionPackage.appliedRelationshipId
          ? `aplicada como ${promotionPackage.appliedRelationshipId}`
          : promotionPackage.blockers.length
            ? `${promotionPackage.blockers.length} bloqueos editoriales`
            : 'lista para parche manual',
        href: '/research/promote',
        badge: promotionPackage.appliedRelationshipId ? 'aplicado' : promotionPackage.ready ? 'listo' : 'bloqueado',
        tone: promotionPackage.appliedRelationshipId ? 'success' : promotionPackage.ready ? 'info' : 'danger',
        priority: promotionPackage.priority,
      })),
    },
    {
      id: 'published',
      title: '4. Grafo publicado',
      description: 'Datos ya integrados al grafo con provenance editorial para auditoría y navegación pública.',
      items: publishedRelationships.map((relationship) => ({
        id: relationship.id,
        title: getPublishedRelationshipTitle(relationship),
        description: relationship.notes ?? 'Relación publicada con trazabilidad editorial.',
        meta: `${relationship.id} · ${relationship.curationStatus} · confianza ${Math.round(relationship.confidence * 100)}%`,
        href: '/graph',
        badge: relationship.curationStatus,
        tone: getCurationStatusTone(relationship.curationStatus),
        priority: Math.round(relationship.confidence * 100),
      })),
    },
  ];

  const nextActions = lanes
    .flatMap((lane) => lane.items.map((item) => ({ ...item, id: `${lane.id}-${item.id}` })))
    .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title))
    .slice(0, 8);

  const reviewedSources = (sourceStats.byStatus.reviewed ?? 0) + (sourceStats.byStatus.verified ?? 0);
  const reviewCoveragePercent = sourceStats.total === 0 ? 0 : Math.round((reviewedSources / sourceStats.total) * 100);

  return {
    summary: {
      sources: sourceStats.total,
      researchCandidates: candidateStats.total,
      readyPromotions: readyPromotions.length,
      appliedPromotions: appliedPromotions.length,
      blockedPromotions: blockedPromotions.length,
      nextActions: sourceQueue.length + researchSources.length + promotionQueue.length,
      reviewCoveragePercent,
    },
    sourceBacklog: sourceStats,
    researchBacklog: candidateStats,
    lanes,
    nextActions,
  };
}

function getPublishedRelationshipTitle(relationship: typeof relationships[number]) {
  if (relationship.id === 'rel-seo2-makiza') return 'Seo2 ↔ Makiza';
  return `${relationship.source} ↔ ${relationship.target}`;
}
