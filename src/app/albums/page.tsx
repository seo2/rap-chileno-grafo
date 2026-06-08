import Link from 'next/link';

import { SiteShell } from '@/components/layout/SiteShell';
import { getAlbumArtist, getAlbumsByDecade } from '@/lib/catalog';

export default function AlbumsPage() {
  const decades = getAlbumsByDecade();
  const totalAlbums = decades.reduce((sum, decade) => sum + decade.albums.length, 0);

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Discografía documentada</p>
          <h1>Discos</h1>
          <p>
            Primer grupo de álbumes para conectar artistas, eras y fuentes externas.
            Cada disco ahora abre una ficha profunda con relaciones, fuentes y trazabilidad editorial.
          </p>
          <div className="chipGroup">
            <span className="chip">{totalAlbums} discos</span>
            <span className="chip">{decades.length} décadas</span>
            <Link className="textLink" href="/graph">Ver discos en grafo →</Link>
          </div>
        </section>

        <section className="timelineBoard">
          {decades.map((decade) => (
            <div className="decadeSection" key={decade.decade}>
              <div>
                <p className="sectionTitle">Década</p>
                <h2>{decade.decade}</h2>
                <p className="muted">{decade.albums.length} lanzamiento{decade.albums.length === 1 ? '' : 's'} en archivo</p>
              </div>
              <div className="cardGrid">
                {decade.albums.map((album) => {
                  const artist = getAlbumArtist(album);
                  return (
                    <article className="contentCard" key={album.id}>
                      <p className="eyebrow">{album.type} · {album.year}</p>
                      <h2><Link className="textLink" href={`/albums/${album.slug}`}>{album.title}</Link></h2>
                      <p>{artist ? <Link className="textLink" href={`/artists/${artist.slug}`}>{artist.name}</Link> : 'Artista pendiente'}</p>
                      <div className="chipGroup">
                        <span className="statusPill">{album.curationStatus}</span>
                        <span className="chip">confianza {Math.round(album.confidence * 100)}%</span>
                        <span className="chip">{album.sourceName}</span>
                      </div>
                      <Link className="textLink" href={`/albums/${album.slug}`}>Abrir ficha →</Link>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </main>
    </SiteShell>
  );
}
