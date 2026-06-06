import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteShell } from '@/components/layout/SiteShell';
import {
  getCandidateKindLabel,
  getCandidateReviewDetail,
  getResearchCandidateQueue,
} from '@/lib/research';

export function generateStaticParams() {
  return getResearchCandidateQueue().map((candidate) => ({ id: candidate.id }));
}

export default async function ResearchCandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = getCandidateReviewDetail(id);
  if (!detail) notFound();

  const { candidate, source, checklist, promotionDraft, relatedEntityLabels } = detail;

  return (
    <SiteShell>
      <main className="pageGrid twoColumns">
        <section className="heroCard">
          <p className="eyebrow">Sprint 9 · Revisión de candidato · {getCandidateKindLabel(candidate.kind)}</p>
          <h1>{candidate.label}</h1>
          <p>{candidate.claim}</p>
          {candidate.extractedText ? <blockquote className="reviewQuote">{candidate.extractedText}</blockquote> : null}
          <div className="chipGroup">
            <span className="chip">{candidate.curationStatus}</span>
            <span className="chip">prioridad {candidate.priority}</span>
            <span className="chip">confianza {Math.round(candidate.confidence * 100)}%</span>
            <span className="chip">destino: {promotionDraft.target}</span>
          </div>
          <div className="chipGroup">
            {candidate.sourceUrl ? <a className="textLink" href={candidate.sourceUrl} rel="noreferrer" target="_blank">Abrir fuente primaria →</a> : null}
            <Link className="textLink" href="/research">← Volver a investigación</Link>
          </div>
        </section>

        <aside className="contentCard">
          <p className="sectionTitle">Fuente y entidades</p>
          <h2>Contexto del claim</h2>
          <div className="sourceEntityList">
            <article className="listCard">
              <strong>{source?.name ?? candidate.sourceName}</strong>
              <span>{source?.sourceType ?? 'fuente externa'} · {source?.curationStatus ?? 'pendiente'}</span>
              <small>{source?.description ?? 'Fuente pendiente de registrar en catálogo.'}</small>
            </article>
            <article className="listCard">
              <strong>Entidades relacionadas</strong>
              <span>{relatedEntityLabels.length ? relatedEntityLabels.join(' · ') : 'pendiente de resolver'}</span>
              <small>{candidate.relatedEntityIds.length ? candidate.relatedEntityIds.join(', ') : 'sin IDs enlazados todavía'}</small>
            </article>
          </div>
        </aside>

        <section className="contentCard fullSpan">
          <p className="sectionTitle">Checklist obligatorio</p>
          <h2>Antes de publicar o promover</h2>
          <div className="reviewChecklist">
            {checklist.map((item, index) => (
              <article className="reviewStep" key={item.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                  <small>{item.required ? 'obligatorio' : 'opcional'}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contentCard fullSpan">
          <p className="sectionTitle">Borrador de promoción</p>
          <h2>No se aplica automáticamente</h2>
          <p className="muted">{promotionDraft.warning}</p>
          <div className="extractGrid">
            {promotionDraft.suggestedFields.map((field) => (
              <article className="extractCard" key={field.name}>
                <p className="eyebrow">campo sugerido</p>
                <h3>{field.name}</h3>
                <p>{field.value}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
