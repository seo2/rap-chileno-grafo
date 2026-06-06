import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { SiteShell } from '@/components/layout/SiteShell';

export default function GraphPage() {
  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Vista principal · Sprint 4</p>
          <h1>Grafo interactivo del rap chileno</h1>
          <p>Grafo D3 mejorado con búsqueda, relaciones legibles, selección de vecinos, arrastre de nodos y acceso directo a fichas de artista desde el panel de detalle.</p>
        </section>
        <GraphCanvas />
      </main>
    </SiteShell>
  );
}
