import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SiteShell } from '@/components/layout/SiteShell';
import { artists, getArtistAlbums, getArtistBySlug, getArtistRelationships, getEntityLabel, getRelationshipTypeLabel } from '@/lib/catalog';
import { getSourcesForEntity } from '@/lib/sources';

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

const artistPortraits = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8KerNIBZ8X7W3kzMeahOHxXyCCi0HggV-U6yq5Q8_haz0IfCw31ZH9RZYsIuBs22yOiUFWbIo5_9si8Co0ryp0NiakuqvukriD3gNuoW4qASfCOE6wXrzfSKuLy5q4K_mFC0cOEVd4nwmPZyjZ9x-VnxaPWm4IJrypEnpozv1idXLfF0gmJuqsBbdxdUi5S4VIie-r-fg9jX0ST0wQmWLOJ7iT2LVYNhtfZxWSF19vvnIXOlNrFnF7mHq6uZ4WVgiEeFK2olcK20',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAnS56MwERBWb37W1QhbrQ-VduU-GRMkY0NbnTFoD_-WuJKWttJHjxjCyy3J9fBuF4SZMqtSSnf9EoOA5Q_DWuw4h_uIu3pexbmmgBT1k_OBJtl2hepiceE9oZThNZ9lxyC2H2RkdXNlGJH3YJJlNAuqZlrGnJpSzDOH7yCjlKeRDJhQgtFCwl8RZ9Aesz2KHyBkVLY7U5j4PrITZvqkzI_lsgi6NPQD0qSoGSOV9EN1MEBhlBAEXHYu8VGq_et_SEmHNXTsAKqQEY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD6A3jGMRAjgQSLTDM30e1gVTxN5fLUsem3_io2WYfURSrnD8pQzN-XTas0ivBW8yePIfH25EzMfgSAgs0-07VB_wNx4XO9gyeyNH07mSBVWIZeKox9jsPd9RF6NHQhit2_F3IJqjIeItnZx83xq-jDk4rxf130n5lWVlzhg8eNoF1_Nw-BzTpZggv9RPONes_yzNafQr3M_meRWCt1ZFoh3W8VQ9ISYzrMcJjzc83tiF8Yxh9OfQSA0Zs3XsxVn6ifBpd3J3IN_f8',
];

const studioImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYaN9TVeN6S-PgFZVvxbHJ5JRJnmIrf8e2leWS2qegspJil6SF8W0bn4ojUUCxA7Gy7VgKiDJVsarqkRDOMoxWiOQezzZoi1S8LMMM8uOOPE-R-pQxhOCNB5hMldEuTHOm5hyBE0K-Ivry4MTjGmTDFnncs7OdUp5ms8TYMa8AV-U75pFoP7d8zB5FMGA3FNIZGJThXQULYvruyaPfdZDq67hw1-J8ZmPvKGXzcy54xK_8ecGtMPw-rLaYqnBULYhUWO8vYjSdlEk';

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    verified: 'Verified archive',
    reviewed: 'Reviewed archive',
    candidate: 'Candidate file',
    pending: 'Pending review',
    rejected: 'Rejected',
  };
  return labels[status] ?? status;
}

function getPortraitForArtist(slug: string) {
  const index = Math.abs(slug.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % artistPortraits.length;
  return artistPortraits[index];
}

function getRelationshipEntityHref(entityId: string) {
  const artist = artists.find((candidate) => candidate.id === entityId);
  if (artist) return `/artists/${artist.slug}`;
  return undefined;
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();

  const albums = getArtistAlbums(slug).sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
  const relationships = getArtistRelationships(artist.id);
  const artistSources = getSourcesForEntity(artist.id);
  const reviewedCount = [artist, ...albums, ...relationships].filter((item) => item.curationStatus === 'verified' || item.curationStatus === 'reviewed').length;
  const primaryYear = albums[0]?.year ?? `${artist.era}`;
  const relationshipPreview = relationships.slice(0, 5);

  return (
    <SiteShell>
      <main className="artistProfilePage">
        <section className="artistIdentityColumn" aria-label={`Identidad de ${artist.name}`}>
          <div className="artistIdentitySticky">
            <figure className="artistPortraitFrame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getPortraitForArtist(artist.slug)} alt={`Retrato editorial de archivo para ${artist.name}`} />
              <figcaption className={`artistArchiveStamp status-${artist.curationStatus}`}>
                <span aria-hidden="true">✓</span>
                {getStatusLabel(artist.curationStatus)}
              </figcaption>
            </figure>
            <h1>{artist.name}</h1>
            <p className="artistOriginLine">{artist.city} · {artist.region} · {artist.era}</p>
            <div className="artistTagSet" aria-label="Etiquetas editoriales">
              <span>{artist.curationStatus}</span>
              <span>Confianza {Math.round(artist.confidence * 100)}%</span>
              {artist.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        </section>

        <section className="artistChronicleColumn" aria-label="Crónica del archivo">
          <p className="artistSectionKicker">Crónica del archivo</p>
          <article className="artistChronicle">
            <p className="artistDropCap">{artist.summary}</p>
            <p>
              El registro sitúa a {artist.name} en la escena de {artist.city}, con una ficha asociada a la era {artist.era}
              y a un nivel de confianza editorial de {Math.round(artist.confidence * 100)}%. Esta lectura cruza biografía,
              discografía y relaciones documentadas para entender su posición dentro del mapa del rap chileno.
            </p>
            {artist.notes ? <p>{artist.notes}</p> : null}
            <figure className="artistStudioPlate">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={studioImage} alt="Archivo visual de estudio, consola y apuntes de producción" />
            </figure>
            <p>
              La ficha reúne {albums.length} lanzamiento(s), {relationships.length} conexión(es) y {artistSources.length} fuente(s)
              vinculadas. Los datos todavía conservan su estado de curaduría para que la lectura editorial no oculte
              qué está verificado, revisado o pendiente.
            </p>
          </article>
        </section>

        <aside className="artistMetadataColumn" aria-label="Metadatos y conexiones">
          <section className="artistSideBlock">
            <h2>Discografía clave</h2>
            {albums.length > 0 ? (
              <ul className="artistDiscographyList">
                {albums.map((album) => (
                  <li key={album.id}>
                    <Link href={`/albums/${album.slug}`}>
                      <span>{album.year}</span>
                      <strong>{album.title}</strong>
                      <small>{album.type} · {album.curationStatus}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="artistMutedText">Todavía no hay discos asociados en el archivo.</p>}
          </section>

          <section className="artistSideBlock">
            <h2>Conexiones</h2>
            {relationshipPreview.length > 0 ? (
              <div className="artistConnectionList">
                {relationshipPreview.map((relationship) => {
                  const otherEntityId = relationship.source === artist.id ? relationship.target : relationship.source;
                  const href = getRelationshipEntityHref(otherEntityId);
                  const body = (
                    <>
                      <span className="connectionAvatar" aria-hidden="true">{getEntityLabel(otherEntityId).slice(0, 1)}</span>
                      <span>
                        <strong>{getEntityLabel(otherEntityId)}</strong>
                        <small>{getRelationshipTypeLabel(relationship.relationshipType)} · {relationship.curationStatus}</small>
                      </span>
                    </>
                  );
                  return href ? <Link href={href} key={relationship.id}>{body}</Link> : <div key={relationship.id}>{body}</div>;
                })}
              </div>
            ) : <p className="artistMutedText">Sin conexiones documentadas todavía.</p>}
          </section>

          <section className="artistFieldData">
            <h2>Datos de campo</h2>
            <div>
              <span>Año base</span>
              <strong>{primaryYear}</strong>
            </div>
            <div>
              <span>Registros</span>
              <strong>{albums.length + relationships.length}</strong>
            </div>
            <div>
              <span>Revisados</span>
              <strong>{reviewedCount}</strong>
            </div>
            <div>
              <span>Fuentes</span>
              <strong>{artistSources.length}</strong>
            </div>
          </section>
        </aside>

        <footer className="artistSourceFooter">
          <h2>Fuentes y referencias</h2>
          <div className="artistSourceGrid">
            {artistSources.length > 0 ? artistSources.map((source, index) => (
              <article key={source.id}>
                <p>[REF-{String(index + 1).padStart(3, '0')}]</p>
                <h3>{source.name}</h3>
                <span>{source.sourceType} · {source.curationStatus}</span>
                {source.url ? <Link href={source.url}>Abrir fuente</Link> : null}
              </article>
            )) : <p className="artistMutedText">Esta ficha todavía no tiene fuentes conectadas.</p>}
          </div>
          <div className="artistFolioLine">
            <strong>{primaryYear}</strong>
            <span>Proyecto El País Más Rapero · archivo de artistas</span>
            <Link href="/sources">Ver mesa editorial</Link>
          </div>
        </footer>
      </main>
    </SiteShell>
  );
}
