import { SiteShell } from '@/components/layout/SiteShell';
import { sources } from '@/lib/catalog';
import { getEntitiesForSource, getSourceStats } from '@/lib/sources';

export default function SourcesPage() {
  const stats = getSourceStats();

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Capa editorial</p>
          <h1>Fuentes</h1>
          <p>El sitio separa catálogo musical de evidencia histórica. Esta página registra APIs, archivos, artículos y curaduría manual con estado de revisión.</p>
          <div className="chipGroup">
            <span className="chip">{stats.total} fuentes</span>
            <span className="chip">{stats.byStatus.pending ?? 0} pendientes</span>
            <span className="chip">{stats.byType.api ?? 0} API</span>
            <span className="chip">{stats.byType.archive ?? 0} archivos</span>
          </div>
        </section>
        <section className="cardGrid">
          {sources.map((source) => {
            const linked = getEntitiesForSource(source.id);
            const linkedCount = linked.artists.length + linked.albums.length + linked.places.length + linked.relationships.length;
            return (
              <article className="contentCard" key={source.id}>
                <p className="eyebrow">{source.sourceType}</p>
                <h2>{source.name}</h2>
                <p>{source.description}</p>
                {source.url ? <a className="textLink" href={source.url} rel="noreferrer" target="_blank">Abrir fuente externa →</a> : null}
                <div className="chipGroup">
                  <span className="statusPill">{source.curationStatus}</span>
                  <span className="chip">{linkedCount} vínculos</span>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </SiteShell>
  );
}
