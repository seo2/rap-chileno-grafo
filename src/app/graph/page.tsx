import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { SiteShell } from '@/components/layout/SiteShell';

export default function GraphPage() {
  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Vista principal · red viva</p>
          <h1>Grafo interactivo del rap chileno</h1>
          <p>Un mapa de relaciones para leer artistas, discos, ciudades y fuentes como parte de una misma memoria musical. Busca, filtra, arrastra nodos y abre cada ficha para seguir la evidencia.</p>
        </section>
        <GraphCanvas />
      </main>
    </SiteShell>
  );
}
