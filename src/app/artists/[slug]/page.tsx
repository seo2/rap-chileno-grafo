import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteShell } from '@/components/layout/SiteShell';
import { artists, getArtistAlbums, getArtistBySlug, getArtistRelationships } from '@/lib/catalog';
import { getSourcesForEntity, getSourcesForRelationship } from '@/lib/sources';

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();

  const albums = getArtistAlbums(slug);
  const relationships = getArtistRelationships(artist.id);
  const artistSources = getSourcesForEntity(artist.id);

  return (
    <SiteShell>
      <main className="pageGrid twoColumns">
        <section className="heroCard">
          <p className="eyebrow">Ficha de artista · {artist.curationStatus}</p>
          <h1>{artist.name}</h1>
          <p>{artist.summary}</p>
          <div className="chipGroup">
            <span className="chip">{artist.city}</span>
            <span className="chip">{artist.region}</span>
            <span className="chip">era {artist.era}</span>
            <span className="chip">confianza {Math.round(artist.confidence * 100)}%</span>
            {artist.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
          </div>
          {artist.notes ? <p className="muted">Nota editorial: {artist.notes}</p> : null}
        </section>
        <section className="contentCard">
          <h2>Discos en el dataset</h2>
          {albums.length > 0 ? albums.map((album) => (
            <article className="listCard" key={album.id}>
              <strong>{album.title}</strong>
              <span>{album.year} · {album.type} · {album.curationStatus}</span>
            </article>
          )) : <p className="muted">Todavía no hay discos asociados en el seed.</p>}
        </section>
        <section className="contentCard fullSpan">
          <h2>Relaciones candidatas</h2>
          <div className="relationshipGrid">
            {relationships.map((relationship) => {
              const sources = getSourcesForRelationship(relationship.id);
              return (
                <article className="listCard" key={relationship.id}>
                  <strong>{relationship.relationshipType}</strong>
                  <span>{relationship.source} → {relationship.target}</span>
                  <small>{relationship.curationStatus} · confianza {Math.round(relationship.confidence * 100)}%</small>
                  <small>{sources.map((source) => source.name).join(', ')}</small>
                </article>
              );
            })}
          </div>
          <h2>Fuentes de esta ficha</h2>
          <div className="chipGroup">
            {artistSources.map((source) => <span className="chip" key={source.id}>{source.name}</span>)}
          </div>
          <Link className="textLink" href="/sources">Ver capa de fuentes →</Link>
        </section>
      </main>
    </SiteShell>
  );
}
