import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { SiteShell } from '@/components/layout/SiteShell';

export default function GraphPage() {
  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Vista principal · Sprint 3</p>
          <h1>Grafo interactivo del rap chileno</h1>
          <p>Primera versión D3 de la red: nodos de artistas, discos y lugares; enlaces por relaciones reales del dataset; filtros por tipo y estado curatorial; panel de detalle al seleccionar un nodo.</p>
        </section>
        <GraphCanvas />
      </main>
    </SiteShell>
  );
}
