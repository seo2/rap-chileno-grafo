import { ArtistList } from '@/components/catalog/ArtistList';
import { SiteShell } from '@/components/layout/SiteShell';
import { getRapOnlyArtists } from '@/lib/catalog';

export default function ArtistsPage() {
  const artists = getRapOnlyArtists();

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Catálogo curatorial</p>
          <h1>Artistas</h1>
          <p>Listado semilla de artistas de rap chileno. Las fichas dinámicas ya quedan preparadas para sumar discos, relaciones y fuentes verificadas.</p>
        </section>
        <section className="contentCard">
          <ArtistList artists={artists} />
        </section>
      </main>
    </SiteShell>
  );
}
