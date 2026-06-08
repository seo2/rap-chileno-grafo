import { SiteShell } from '@/components/layout/SiteShell';

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="pageGrid twoColumns">
        <section className="heroCard">
          <p className="eyebrow">Proyecto</p>
          <h1>Acerca de El País Más Rapero</h1>
          <p>Una cartografía visual del rap chileno: artistas, discos, ciudades, colaboraciones, eras y evidencia curatorial.</p>
          <p>Este es también un proyecto personal de Seo2: una forma de ordenar memoria, relaciones y territorio desde dentro de la cultura hip-hop chilena.</p>
        </section>
        <section className="contentCard">
          <h2>Principio editorial</h2>
          <p>No dejaremos que Spotify defina la historia. Spotify será una fuente de catálogo; la historia se construirá con fuentes, revisión y decisiones editoriales explícitas.</p>
        </section>
        <section className="contentCard">
          <h2>Autoría y mirada</h2>
          <p>El País Más Rapero nace como una iniciativa de Seo2 para mapear el rap chileno como una red viva: artistas, barrios, ciudades, discos, crews, colaboraciones y fuentes que permitan seguir ampliando la historia con criterio curatorial.</p>
        </section>
        <section className="contentCard fullSpan">
          <h2>Estado del proyecto</h2>
          <p>Esta versión deja una base navegable con grafo interactivo, catálogo curatorial, fichas dinámicas, discos, timeline, fuentes y una primera capa de evidencia editorial.</p>
        </section>
      </main>
    </SiteShell>
  );
}
