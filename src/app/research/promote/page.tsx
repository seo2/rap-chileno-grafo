import Link from 'next/link';

import { SiteShell } from '@/components/layout/SiteShell';
import { getResearchPromotionQueue } from '@/lib/research';

export default function ResearchPromotionPage() {
  const queue = getResearchPromotionQueue();
  const readyCount = queue.filter((item) => item.ready).length;
  const blockedCount = queue.length - readyCount;

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Sprint 10 · Promoción editorial manual</p>
          <h1>Paquetes de promoción</h1>
          <p>
            Esta mesa convierte candidatos revisados en parches editoriales copiables. El sistema no aplica cambios al
            catálogo: solo muestra preparación, bloqueos, auditoría y un preview para que la curaduría humana decida.
          </p>
          <div className="chipGroup">
            <span className="chip">{queue.length} paquetes</span>
            <span className="chip">{readyCount} listos</span>
            <span className="chip">{blockedCount} bloqueados</span>
            <span className="chip">0 mutaciones automáticas</span>
          </div>
          <div className="chipGroup">
            <Link className="textLink" href="/research">← Volver a investigación</Link>
          </div>
        </section>

        <section className="contentCard fullSpan">
          <p className="sectionTitle">Orden de trabajo</p>
          <h2>Listos primero, bloqueados después</h2>
          <div className="promotionQueue">
            {queue.map((item) => (
              <article className="promotionCard" key={item.candidateId}>
                <div className="promotionHeader">
                  <div>
                    <p className="eyebrow">{item.ready ? 'listo' : 'bloqueado'} · {item.target}</p>
                    <h3>{item.title}</h3>
                  </div>
                  <span className={item.ready ? 'readyPill' : 'blockedPill'}>{item.ready ? 'promovible' : `${item.blockers.length} bloqueos`}</span>
                </div>
                <p>{item.summary}</p>

                {item.blockers.length ? (
                  <div className="blockerList">
                    {item.blockers.map((blocker) => (
                      <span key={blocker}>{blocker}</span>
                    ))}
                  </div>
                ) : null}

                <div className="promotionColumns">
                  <div>
                    <strong>Auditoría</strong>
                    <ul>
                      {item.auditTrail.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Patch preview</strong>
                    <pre className="patchPreview"><code>{item.patchPreview}</code></pre>
                  </div>
                </div>
                <small>{item.safetyWarning}</small>
                <div className="chipGroup compactChips">
                  <Link className="textLink" href={`/research/${item.candidateId}`}>Abrir ficha de revisión →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
