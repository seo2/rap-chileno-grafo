import Link from 'next/link';

import { SiteShell } from '@/components/layout/SiteShell';
import {
  getCandidateKindLabel,
  getCandidateStats,
  getCandidatesBySource,
  getResearchCandidateQueue,
  getResearchSources,
} from '@/lib/research';

export default function ResearchPage() {
  const stats = getCandidateStats();
  const queue = getResearchCandidateQueue();
  const researchSources = getResearchSources();

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Sprint 8/9 · Investigación externa</p>
          <h1>Cola de investigación</h1>
          <p>
            Esta vista transforma fuentes externas en candidatos editoriales. Nada de esta cola se publica como dato
            verificado hasta contrastarlo, guardar cita/URL específica y decidir si entra al grafo, timeline o ficha.
          </p>
          <div className="chipGroup">
            <span className="chip">{stats.total} candidatos</span>
            <span className="chip">{stats.byKind.candidate_artist ?? 0} artistas</span>
            <span className="chip">{stats.byKind.candidate_album ?? 0} discos</span>
            <span className="chip">{stats.byKind.candidate_relationship ?? 0} relaciones</span>
            <span className="chip">{stats.byKind.candidate_event ?? 0} hitos</span>
            <span className="chip">{stats.byKind.candidate_source_quote ?? 0} citas</span>
          </div>
          <div className="chipGroup">
            <Link className="textLink" href="/research/promote">Abrir paquetes de promoción Sprint 10 →</Link>
          </div>
        </section>

        <section className="contentCard sourceQueue">
          <div>
            <p className="sectionTitle">Prioridad editorial</p>
            <h2>Qué revisar primero</h2>
            <p className="muted">
              La cola ordena por prioridad y confianza. Los primeros ítems abren el camino para poblar historia,
              territorios y colaboraciones sin contaminar los datos curados.
            </p>
          </div>
          <div className="queueList">
            {queue.slice(0, 5).map((candidate) => (
              <article className="queueItem" key={candidate.id}>
                <strong><Link className="textLink" href={`/research/${candidate.id}`}>{candidate.label}</Link></strong>
                <span>{getCandidateKindLabel(candidate.kind)} · prioridad {candidate.priority}</span>
                <small>{candidate.sourceName} · {candidate.curationStatus} · confianza {Math.round(candidate.confidence * 100)}%</small>
                <p>{candidate.reviewAction}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="researchBoard">
          <div className="contentCard">
            <p className="sectionTitle">Fuentes externas</p>
            <h2>Backlog por procesar</h2>
            <div className="sourceEntityList">
              {researchSources.map((source) => {
                const count = stats.bySource[source.id] ?? 0;
                return (
                  <article className="listCard" key={source.id}>
                    <strong>{source.name}</strong>
                    <span>{source.sourceType} · {source.curationStatus} · {count} candidatos</span>
                    <small>{source.description}</small>
                    <div className="chipGroup compactChips">
                      {source.url ? <a className="textLink" href={source.url} rel="noreferrer" target="_blank">Abrir externa →</a> : null}
                      <Link className="textLink" href={`/sources/${source.id}`}>Detalle fuente →</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="contentCard">
            <p className="sectionTitle">Candidatos</p>
            <h2>Claims antes del grafo</h2>
            <div className="candidateList">
              {queue.map((candidate) => (
                <article className="candidateCard" key={candidate.id}>
                  <p className="eyebrow">{getCandidateKindLabel(candidate.kind)} · {candidate.curationStatus}</p>
                  <h3><Link className="textLink" href={`/research/${candidate.id}`}>{candidate.label}</Link></h3>
                  <p>{candidate.claim}</p>
                  {candidate.extractedText ? <blockquote>{candidate.extractedText}</blockquote> : null}
                  <span>{candidate.sourceName} · confianza {Math.round(candidate.confidence * 100)}%</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contentCard fullSpan">
          <p className="sectionTitle">Agrupado por fuente</p>
          <h2>Próximo flujo de curaduría</h2>
          <div className="extractGrid">
            {researchSources.map((source) => {
              const candidates = getCandidatesBySource(source.id);
              return (
                <article className="extractCard" key={source.id}>
                  <p className="eyebrow">{source.sourceType} · {source.curationStatus}</p>
                  <h3>{source.name}</h3>
                  <p>{candidates.length ? `${candidates.length} candidatos listos para revisar.` : 'Sin candidatos específicos todavía: primero localizar URL/ficha concreta.'}</p>
                  <span>{source.url ? 'tiene URL base' : 'falta URL específica'} · no publicar automáticamente</span>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
