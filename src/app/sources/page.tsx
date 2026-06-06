import Link from 'next/link';

import { SiteShell } from '@/components/layout/SiteShell';
import { sources } from '@/lib/catalog';
import { getCurationQueue, getEntitiesForSource, getSourceMentionSummary, getSourceStats } from '@/lib/sources';

function linkedCount(sourceId: string) {
  const linked = getEntitiesForSource(sourceId);
  return linked.artists.length + linked.albums.length + linked.places.length + linked.relationships.length;
}

export default function SourcesPage() {
  const stats = getSourceStats();
  const queue = getCurationQueue().slice(0, 6);
  const sortedSources = [...sources].sort((a, b) => linkedCount(b.id) - linkedCount(a.id) || a.name.localeCompare(b.name));

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Sprint 6 · Fuentes y curaduría</p>
          <h1>Fuentes</h1>
          <p>
            El sitio separa catálogo musical de evidencia histórica. Cada fuente muestra qué entidades menciona,
            qué datos extrajo y qué queda pendiente para revisar antes de convertirlo en conocimiento verificado.
          </p>
          <div className="chipGroup">
            <span className="chip">{stats.total} fuentes</span>
            <span className="chip">{stats.byStatus.pending ?? 0} pendientes</span>
            <span className="chip">{stats.byStatus.reviewed ?? 0} revisadas</span>
            <span className="chip">{stats.byType.api ?? 0} API</span>
            <span className="chip">{stats.byType.archive ?? 0} archivos</span>
          </div>
        </section>

        <section className="contentCard sourceQueue">
          <div>
            <p className="sectionTitle">Cola editorial</p>
            <h2>Próximas revisiones sugeridas</h2>
            <p className="muted">Priorizamos fuentes pendientes y datos con baja confianza para preparar imports y scraping sin publicar afirmaciones débiles.</p>
          </div>
          <div className="queueList">
            {queue.map((item) => (
              <article className="queueItem" key={item.id}>
                <strong>{item.entityLabel}</strong>
                <span>{item.reason} · prioridad {item.priority}</span>
                <small>{item.sourceName} · {item.curationStatus}{typeof item.confidence === 'number' ? ` · confianza ${Math.round(item.confidence * 100)}%` : ''}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="cardGrid">
          {sortedSources.map((source) => {
            const summary = getSourceMentionSummary(source.id);
            return (
              <article className="contentCard sourceCard" key={source.id}>
                <p className="eyebrow">{source.sourceType}</p>
                <h2>{source.name}</h2>
                <p>{source.description}</p>
                {source.notes ? <p className="muted">Nota: {source.notes}</p> : null}
                <div className="sourceMentionGrid" aria-label={`Menciones de ${source.name}`}>
                  <span><strong>{summary.totalMentions}</strong> menciones</span>
                  <span>{summary.byEntityType.artist} artistas</span>
                  <span>{summary.byEntityType.album} discos</span>
                  <span>{summary.byEntityType.place} lugares</span>
                  <span>{summary.byEntityType.relationship} relaciones</span>
                </div>
                <div className="chipGroup">
                  <span className="statusPill">{source.curationStatus}</span>
                  {source.url ? <a className="textLink" href={source.url} rel="noreferrer" target="_blank">Abrir externa →</a> : null}
                  <Link className="textLink" href={`/sources/${source.id}`}>Ver detalle →</Link>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </SiteShell>
  );
}
