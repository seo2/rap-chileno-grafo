import Link from 'next/link';

import { SiteShell } from '@/components/layout/SiteShell';
import { getCurationDashboard, getCurationStageLabel } from '@/lib/curation';

export default function CurationPage() {
  const dashboard = getCurationDashboard();

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Mesa editorial</p>
          <h1>Consola de curaduría editorial</h1>
          <p>
            Una sola mesa para seguir el flujo completo: fuentes pendientes, hallazgos externos,
            paquetes de promoción y datos ya publicados en el grafo con provenance editorial.
          </p>
          <div className="curationStats" aria-label="Resumen de curaduría">
            <span><strong>{dashboard.summary.sources}</strong> fuentes</span>
            <span><strong>{dashboard.summary.researchCandidates}</strong> candidatos</span>
            <span><strong>{dashboard.summary.readyPromotions}</strong> listos</span>
            <span><strong>{dashboard.summary.appliedPromotions}</strong> aplicados</span>
            <span><strong>{dashboard.summary.blockedPromotions}</strong> bloqueados</span>
            <span><strong>{dashboard.summary.reviewCoveragePercent}%</strong> cobertura revisión</span>
          </div>
          <div className="chipGroup">
            <Link className="textLink" href="/sources">Fuentes →</Link>
            <Link className="textLink" href="/research">Investigación →</Link>
            <Link className="textLink" href="/research/promote">Promoción editorial →</Link>
            <Link className="textLink" href="/graph">Grafo publicado →</Link>
          </div>
        </section>

        <section className="contentCard sourceQueue">
          <div>
            <p className="sectionTitle">Próximas acciones</p>
            <h2>Qué conviene tocar primero</h2>
            <p className="muted">
              Esta lista mezcla prioridad editorial de fuentes, candidatos y promociones para no perder el hilo entre vistas.
            </p>
          </div>
          <div className="queueList">
            {dashboard.nextActions.map((item) => (
              <article className={`queueItem curationTone-${item.tone}`} key={item.id}>
                <strong><Link className="textLink" href={item.href}>{item.title}</Link></strong>
                <span>{item.badge} · prioridad {item.priority}</span>
                <small>{item.meta}</small>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="curationLaneGrid" aria-label="Carriles editoriales">
          {dashboard.lanes.map((lane) => (
            <article className="contentCard curationLane" key={lane.id}>
              <p className="sectionTitle">{getCurationStageLabel(lane.id)}</p>
              <h2>{lane.title}</h2>
              <p>{lane.description}</p>
              <div className="curationLaneList">
                {lane.items.map((item) => (
                  <Link className={`curationLaneItem curationTone-${item.tone}`} href={item.href} key={item.id}>
                    <span className="curationBadge">{item.badge}</span>
                    <strong>{item.title}</strong>
                    <small>{item.meta}</small>
                    <p>{item.description}</p>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="contentCard fullSpan">
          <p className="sectionTitle">Lectura editorial</p>
          <h2>Estado del flujo editorial</h2>
          <div className="extractGrid">
            <article className="extractCard">
              <p className="eyebrow">Fuentes</p>
              <h3>{dashboard.sourceBacklog.byStatus.pending ?? 0} pendientes</h3>
              <p>
                Las fuentes siguen siendo la entrada de evidencia. Las pendientes o candidatas deben pasar por detalle
                de fuente antes de convertirse en hallazgos publicables.
              </p>
              <span>{dashboard.sourceBacklog.byStatus.reviewed ?? 0} revisadas · {dashboard.sourceBacklog.byStatus.verified ?? 0} verificadas</span>
            </article>
            <article className="extractCard">
              <p className="eyebrow">Investigación</p>
              <h3>{dashboard.researchBacklog.total} hallazgos candidatos</h3>
              <p>
                Cada hallazgo debe conservar fuente, cita, entidades relacionadas y decisión editorial antes de entrar al grafo.
              </p>
              <span>{dashboard.researchBacklog.byStatus.candidate ?? 0} candidatos · {dashboard.researchBacklog.byStatus.pending ?? 0} pendientes</span>
            </article>
            <article className="extractCard">
              <p className="eyebrow">Publicación</p>
              <h3>{dashboard.summary.appliedPromotions} promoción aplicada</h3>
              <p>
                Seo2 ↔ Makiza queda como primer ejemplo real: visible en el grafo, trazable a Música Popular y no re-aplicable.
              </p>
              <span>{dashboard.summary.blockedPromotions} promociones aún bloqueadas</span>
            </article>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
