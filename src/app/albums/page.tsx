import { SiteShell } from '@/components/layout/SiteShell';
import { albums, getAlbumArtist } from '@/lib/catalog';

export default function AlbumsPage() {
  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Discografía semilla</p>
          <h1>Discos</h1>
          <p>Primer grupo de álbumes para conectar artistas, eras y futuras fuentes externas como Spotify. Cada disco ya tiene estado curatorial y fuentes asociadas.</p>
        </section>
        <section className="cardGrid">
          {albums.map((album) => {
            const artist = getAlbumArtist(album);
            return (
              <article className="contentCard" key={album.id}>
                <p className="eyebrow">{album.type} · {album.year}</p>
                <h2>{album.title}</h2>
                <p>{artist?.name ?? 'Artista pendiente'}</p>
                <div className="chipGroup">
                  <span className="statusPill">{album.curationStatus}</span>
                  <span className="chip">confianza {Math.round(album.confidence * 100)}%</span>
                  <span className="chip">{album.sourceName}</span>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </SiteShell>
  );
}
