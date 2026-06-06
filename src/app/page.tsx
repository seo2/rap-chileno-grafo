import Link from 'next/link';

import { ArtistList } from '@/components/catalog/ArtistList';
import { MetricCards } from '@/components/catalog/MetricCards';
import { GraphPreview } from '@/components/graph/GraphPreview';
import { SiteShell } from '@/components/layout/SiteShell';
import { getRapOnlyArtists } from '@/lib/catalog';

export default function Home() {
  const rapArtists = getRapOnlyArtists();

  return (
    <SiteShell variant="dashboard">
      <aside className="dashboardPanel">
        <SectionTitle>Dataset semilla</SectionTitle>
        <MetricCards />
        <SectionTitle>Filtros</SectionTitle>
        <div className="chipGroup">
          {['solo rap', '90s', '2000s', '2010s', 'colaboraciones', 'discos clásicos', 'Santiago', 'Valparaíso'].map((filter) => (
            <span className="chip" key={filter}>{filter}</span>
          ))}
        </div>
        <SectionTitle>Artistas iniciales</SectionTitle>
        <ArtistList artists={rapArtists} limit={8} />
      </aside>

      <GraphPreview />

      <aside className="dashboardPanel">
        <SectionTitle>Entidad seleccionada</SectionTitle>
        <div className="entityCard">
          <div className="cover" />
          <div>
            <h2>Ana Tijoux</h2>
            <p>artista · Santiago / Francia · 90s–presente</p>
          </div>
        </div>
        <p className="copyCard">Ficha curatorial con biografía, origen, discos, colaboraciones y fuentes verificadas. Spotify aporta catálogo; la capa editorial agrega historia, territorio y contexto.</p>
        <SectionTitle>Relaciones visibles</SectionTitle>
        <Relation label="miembro/relación" value="Makiza" />
        <Relation label="disco" value="Aerolíneas Makiza" />
        <Relation label="ciudad/escena" value="Santiago" />
        <Relation label="decisión editorial" value="solo rap" />
        <SectionTitle>Fuentes candidatas</SectionTitle>
        {['Spotify Web API', 'Red Bull cronología', 'SHIA discos nacionales', 'Música Popular', 'Tesis académicas'].map((source) => (
          <div className="source" key={source}>{source}<small>pendiente extracción/verificación</small></div>
        ))}
      </aside>

      <section className="playerBar">
        <div><strong>Modo demo</strong><span>Next.js · datos semilla reales del repo</span></div>
        <div className="wave" aria-hidden="true">{Array.from({ length: 70 }, (_, index) => <i key={index} style={{ ['--h' as string]: `${8 + Math.round(Math.abs(Math.sin(index * 0.55)) * 34)}px` }} />)}</div>
        <Link href="/artists">Entrar al catálogo →</Link>
      </section>
    </SiteShell>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="sectionTitle">{children}</h2>;
}

function Relation({ label, value }: { label: string; value: string }) {
  return <div className="relation"><span>{label}</span><strong>{value}</strong></div>;
}
