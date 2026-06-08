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
          <p>Directorio editorial de artistas de rap chileno, preparado para cruzar biografía, territorio, discos, relaciones y fuentes verificadas.</p>
        </section>
        <section className="contentCard">
          <ArtistList artists={artists} />
        </section>
      </main>
    </SiteShell>
  );
}
