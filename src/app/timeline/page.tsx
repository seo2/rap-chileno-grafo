import Link from 'next/link';

import { SiteShell } from '@/components/layout/SiteShell';
import {
  filterTimelineEvents,
  getTimelineDecades,
  getTimelineFilterOptions,
  getTimelineStats,
  prepareTimelineEvents,
  type TimelineFilter,
} from '@/lib/timeline';

type TimelinePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function createFilterHref(filter: TimelineFilter) {
  const params = new URLSearchParams();
  if (filter.artistSlug) params.set('artist', filter.artistSlug);
  if (filter.placeSlug) params.set('place', filter.placeSlug);
  if (filter.decade) params.set('decade', String(filter.decade));
  return `/timeline${params.size ? `?${params.toString()}` : ''}`;
}

export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  const params = await searchParams;
  const decadeParam = getSingleParam(params?.decade);
  const filter: TimelineFilter = {
    artistSlug: getSingleParam(params?.artist),
    placeSlug: getSingleParam(params?.place),
    decade: decadeParam ? Number(decadeParam) : undefined,
  };

  const allEvents = prepareTimelineEvents();
  const events = filterTimelineEvents(allEvents, filter);
  const decades = getTimelineDecades(events);
  const stats = getTimelineStats(allEvents);
  const options = getTimelineFilterOptions();
  const activeFilters = [filter.artistSlug, filter.placeSlug, filter.decade].filter(Boolean).length;

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Sprint 5 · Historia por eras</p>
          <h1>Timeline del rap chileno</h1>
          <p>
            Una línea de tiempo curatorial que cruza discos, artistas, hitos y relaciones para leer la historia por décadas,
            escenas territoriales y protagonistas. Los datos siguen marcados con estado de revisión para crecer sin perder trazabilidad.
          </p>
          <div className="timelineStats" aria-label="Resumen de timeline">
            <span><strong>{stats.total}</strong> eventos</span>
            <span><strong>{stats.decades}</strong> décadas</span>
            <span><strong>{stats.verifiedOrReviewed}</strong> revisados</span>
            <span><strong>{stats.pendingOrCandidate}</strong> candidatos</span>
          </div>
        </section>

        <section className="contentCard timelineFilters" aria-label="Filtros de timeline">
          <div>
            <p className="sectionTitle">Filtros rápidos</p>
            <h2>Explorar por década, artista o ciudad</h2>
            <p className="muted">
              {activeFilters > 0 ? `${events.length} eventos visibles con ${activeFilters} filtro(s) activo(s).` : `${events.length} eventos visibles en la línea base.`}
            </p>
          </div>
          <div className="filterColumn">
            <span>Década</span>
            <div className="chipGroup compactChips">
              <Link className={!filter.decade ? 'chip activeChip' : 'chip'} href={createFilterHref({ artistSlug: filter.artistSlug, placeSlug: filter.placeSlug })}>Todas</Link>
              {options.decades.map((decade) => (
                <Link className={filter.decade === decade ? 'chip activeChip' : 'chip'} href={createFilterHref({ ...filter, decade })} key={decade}>{decade}s</Link>
              ))}
            </div>
          </div>
          <div className="filterColumn">
            <span>Artista</span>
            <div className="chipGroup compactChips">
              {options.artists.slice(0, 8).map((artist) => (
                <Link className={filter.artistSlug === artist.slug ? 'chip activeChip' : 'chip'} href={createFilterHref({ ...filter, artistSlug: artist.slug })} key={artist.id}>{artist.name}</Link>
              ))}
            </div>
          </div>
          <div className="filterColumn">
            <span>Ciudad</span>
            <div className="chipGroup compactChips">
              {options.places.map((place) => (
                <Link className={filter.placeSlug === place.slug ? 'chip activeChip' : 'chip'} href={createFilterHref({ ...filter, placeSlug: place.slug })} key={place.id}>{place.name}</Link>
              ))}
              <Link className="chip" href="/timeline">Limpiar filtros</Link>
            </div>
          </div>
        </section>

        <section className="contentCard timelineBoard">
          {decades.map((decade) => (
            <article className="decadeSection" key={decade.startYear}>
              <header>
                <p className="eyebrow">{decade.events.length} eventos</p>
                <h2>{decade.label}</h2>
              </header>
              <div className="timelineRail">
                {decade.events.map((event) => (
                  <article className={`timelineItem timelineItem-${event.entityType}`} key={event.id}>
                    <time>{event.year}</time>
                    <div>
                      <strong>{event.title}</strong>
                      <p>{event.description}</p>
                      <span>{event.entityType} · {event.era} · {event.curationStatus} · confianza {Math.round(event.confidence * 100)}%</span>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          ))}
          {decades.length === 0 ? <p className="muted">No hay eventos para estos filtros todavía.</p> : null}
        </section>
      </main>
    </SiteShell>
  );
}
