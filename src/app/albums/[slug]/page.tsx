import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteShell } from '@/components/layout/SiteShell';
import { albums, getAlbumDetail } from '@/lib/catalog';

export function generateStaticParams() {
  return albums.map((album) => ({ slug: album.slug }));
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = getAlbumDetail(slug);
  if (!detail) notFound();

  const { album, artist, tracklist, relationshipSummaries, sources, relatedArtistSlugs } = detail;

  return (
    <SiteShell>
      <main className="pageGrid twoColumns">
        <section className="heroCard">
          <p className="eyebrow">Ficha de disco · {album.curationStatus}</p>
          <h1>{album.title}</h1>
          <p>
            {artist ? (
              <>
                Disco de <Link className="textLink" href={`/artists/${artist.slug}`}>{artist.name}</Link>,
                publicado en {album.year}. Esta ficha conecta discografía, fuentes y relaciones del grafo.
              </>
            ) : `Disco publicado en ${album.year}. Artista pendiente de resolver.`}
          </p>
          <div className="chipGroup">
            <span className="chip">{album.type}</span>
            <span className="chip">{album.year}</span>
            <span className="chip">confianza {Math.round(album.confidence * 100)}%</span>
            <span className="chip">{album.sourceType}</span>
            <span className="statusPill">{album.curationStatus}</span>
          </div>
          {album.notes ? <p className="muted">Nota editorial: {album.notes}</p> : null}
        </section>

        <section className="contentCard">
          <p className="sectionTitle">Créditos documentados</p>
          <h2>Artista principal</h2>
          {artist ? (
            <article className="listCard">
              <strong><Link className="textLink" href={`/artists/${artist.slug}`}>{artist.name}</Link></strong>
              <span>{artist.city} · {artist.region} · era {artist.era}</span>
              <small>{artist.curationStatus} · confianza {Math.round(artist.confidence * 100)}%</small>
            </article>
          ) : <p className="muted">Artista pendiente.</p>}
          <div className="chipGroup compactChips">
            {relatedArtistSlugs.map((artistSlug) => (
              <Link className="chip" href={`/artists/${artistSlug}`} key={artistSlug}>{artistSlug}</Link>
            ))}
          </div>
        </section>

        <section className="contentCard fullSpan">
          <p className="sectionTitle">Tracklist documentado</p>
          <h2>Canciones curadas</h2>
          {tracklist.length > 0 ? (
            <ol className="trackList">
              {tracklist.map((track) => (
                <li className="trackItem" key={track.id}>
                  <span className="trackNumber">{track.trackNumber}</span>
                  <div>
                    <strong>{track.title}</strong>
                    <small>{track.sourceName} · {track.curationStatus} · confianza {Math.round(track.confidence * 100)}%</small>
                  </div>
                </li>
              ))}
            </ol>
          ) : <p className="muted">Tracklist pendiente de curaduría o importación desde Spotify.</p>}
        </section>

        <section className="contentCard fullSpan">
          <p className="sectionTitle">Grafo</p>
          <h2>Relaciones conectadas</h2>
          <div className="relationshipGrid">
            {relationshipSummaries.length > 0 ? relationshipSummaries.map((relationship) => (
              <article className="listCard" key={relationship.id}>
                <strong>{relationship.display}</strong>
                <span>{relationship.year ? `${relationship.year} · ` : ''}{relationship.curationStatus}</span>
                <small>confianza {Math.round(relationship.confidence * 100)}%</small>
              </article>
            )) : <p className="muted">Todavía no hay relaciones conectadas para este disco.</p>}
          </div>
        </section>

        <section className="contentCard fullSpan">
          <p className="sectionTitle">Provenance</p>
          <h2>Fuentes de esta ficha</h2>
          <div className="sourceEntityList">
            {sources.map((source) => (
              <article className="listCard" key={source.id}>
                <strong><Link className="textLink" href={`/sources/${source.id}`}>{source.name}</Link></strong>
                <span>{source.sourceType} · {source.curationStatus}</span>
                <small>{source.description}</small>
                {source.url ? <a className="textLink" href={source.url} rel="noreferrer" target="_blank">Abrir fuente externa →</a> : null}
              </article>
            ))}
          </div>
          <div className="chipGroup">
            <Link className="textLink" href="/albums">← Volver a discos</Link>
            <Link className="textLink" href="/graph">Ver en grafo →</Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
