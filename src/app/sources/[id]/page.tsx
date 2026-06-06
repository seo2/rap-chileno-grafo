import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteShell } from '@/components/layout/SiteShell';
import { sources } from '@/lib/catalog';
import { getSourceDetail } from '@/lib/sources';

export function generateStaticParams() {
  return sources.map((source) => ({ id: source.id }));
}

export default async function SourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = getSourceDetail(id);
  if (!detail) notFound();

  const { source, mentionSummary, extracts, entities } = detail;

  return (
    <SiteShell>
      <main className="pageGrid twoColumns">
        <section className="heroCard">
          <p className="eyebrow">Fuente · {source.sourceType} · {source.curationStatus}</p>
          <h1>{source.name}</h1>
          <p>{source.description}</p>
          {source.notes ? <p className="muted">Nota editorial: {source.notes}</p> : null}
          <div className="chipGroup">
            <span className="chip">{mentionSummary.totalMentions} menciones</span>
            <span className="chip">{mentionSummary.reviewedMentions} revisadas</span>
            <span className="chip">{mentionSummary.byEntityType.artist} artistas</span>
            <span className="chip">{mentionSummary.byEntityType.album} discos</span>
            <span className="chip">{mentionSummary.byEntityType.place} lugares</span>
            <span className="chip">{mentionSummary.byEntityType.relationship} relaciones</span>
          </div>
          <div className="chipGroup">
            {source.url ? <a className="textLink" href={source.url} rel="noreferrer" target="_blank">Abrir fuente externa →</a> : null}
            <Link className="textLink" href="/sources">← Volver a fuentes</Link>
          </div>
        </section>

        <aside className="contentCard">
          <p className="sectionTitle">Entidades mencionadas</p>
          <h2>Qué toca esta fuente</h2>
          <div className="sourceEntityList">
            {entities.artists.map((artist) => <Link className="listCard" href={`/artists/${artist.slug}`} key={artist.id}><strong>{artist.name}</strong><span>artista · {artist.curationStatus}</span></Link>)}
            {entities.albums.map((album) => <article className="listCard" key={album.id}><strong>{album.title}</strong><span>disco · {album.year} · {album.curationStatus}</span></article>)}
            {entities.places.map((place) => <article className="listCard" key={place.id}><strong>{place.name}</strong><span>lugar · {place.type} · {place.curationStatus}</span></article>)}
            {entities.relationships.map((relationship) => <article className="listCard" key={relationship.id}><strong>{relationship.relationshipType.replaceAll('_', ' ')}</strong><span>{relationship.source} → {relationship.target} · {relationship.curationStatus}</span></article>)}
            {mentionSummary.totalMentions === 0 ? <p className="muted">Esta fuente todavía no tiene entidades enlazadas.</p> : null}
          </div>
        </aside>

        {source.id === 'source-spotify-web-api' ? (
          <section className="contentCard fullSpan">
            <p className="sectionTitle">Sprint 7 · importer</p>
            <h2>Importar catálogo real desde Spotify</h2>
            <p className="muted">
              Esta fuente ya tiene cliente y script de importación. El flujo produce candidatos de catálogo, no reemplaza datos históricos curados.
            </p>
            <code className="commandBlock">npm run spotify:import -- --artist-slug seo2 --spotify-artist &lt;spotify-artist-id-o-url&gt;</code>
          </section>
        ) : null}

        <section className="contentCard fullSpan">
          <p className="sectionTitle">Datos extraídos</p>
          <h2>Claims y evidencia en revisión</h2>
          <div className="extractGrid">
            {extracts.map((extract) => (
              <article className="extractCard" key={extract.id}>
                <p className="eyebrow">{extract.entityType} · {extract.field}</p>
                <h3>{extract.entityLabel}</h3>
                <p>{extract.value}</p>
                <span>{extract.curationStatus} · confianza {Math.round(extract.confidence * 100)}%</span>
              </article>
            ))}
            {extracts.length === 0 ? <p className="muted">Aún no hay datos extraídos para esta fuente.</p> : null}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
