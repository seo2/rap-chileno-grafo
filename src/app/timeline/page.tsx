import Link from 'next/link';

import { SiteShell } from '@/components/layout/SiteShell';
import {
  filterTimelineEvents,
  getTimelineDecades,
  getTimelineFilterOptions,
  getTimelineStats,
  prepareTimelineEvents,
  type TimelineEvent,
  type TimelineFilter,
} from '@/lib/timeline';

type TimelinePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const timelineImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD6P4gW116J0YoCMhf2GAAJo7mKH8TceSXvizoGS21gVOUeSa_nA9TiQpu-vHN7s8BLm99Sm8HG2YesnWNbC-9wdG78qMNEkrq5V4fmq8JYXya0Se7vgaa7aX1WRvnx4t29GP7hjTUG-Ys0tIhnOeCgR1q3h86Zq0RL0fQjNOEPlrtsFiHkMOdTF5djnct0LoTXb-V3dB7fqZOkQN0vIWe1IKEMdpM6qMWZw8E_lJeDcoRgSCGgo2VCyQ61UeVe12IylNkBClMyDyU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDU_gsvdoCgNMrTFkiLE_b2ah9I6cnPFuFnM6XGlhugN5fmPi4HcD06i1ZLzf61hkFOXPdqWpsbuAizKP9Jx3q15WHFelp5pPLnfmIAGKbfzxg6LjbuV5OIdydzsM7fV-XIgOXmV4ySEj9o5GOdpSlFA8XmwojQ0hpoWXayCfBJLWHhQ8JsAsYhyj3CpPLUKYB72R7twnteStq1Ff7KGwswY_k2v_f-oEHbcQqPkZOVGBjPNyry3XxkJkZiCXJQne_umsGhaY2_4Y4',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgIEPjAeQjQ3TZ3nss00D-kKXGwHXZplZSGae1GchglOgVAB8viMvh5NUI6mjLzj2nQgzBGIbItqnz163g9Ql64-b6qsmIk2KiXXj6A98BV7wINv18LUU1G7ukSkW2SnYEbwDIGQJcP8YNcqempyUE-dnMeu-wEkvNrxs9ANtPX80AcEYPWfDUmNk9DLzdyoFUstyIwpMiYKqgP_r5p4VYik6c5k6n1q1XvcRZ89YwWoI6zCL2jQS6Pp67wvBsIDxFFx7kmTY5dT4',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCYvwd2281PFyoXvF0K8nxqnQUHC40PrJLa1vO6-7oWl2YM82vZ3-14M6uhoH5lCjpsX4mYV6jYqZII1nu3_OqXTGTGcNNhpntdLvTmPJd86431-X395y72URFGSQvRuTvqNx4-Ap_srJirSknVimBI9je3wxy4jXRWGaCfLURCdYYFNkC5fb2qpdRHRNfkbi_zYZjcx43f-2v0G0nO9E_SfKEg6s8ukdAZS8wyBkoZM8Img3mrywMmDCVuGp0ierc4Zs1MRHcuozw',
];

const defaultEventsPerDecade = 4;

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

function getDecadeShortLabel(decade: number) {
  const decadeSuffix = String(decade).slice(2, 3);
  return `${decadeSuffix}0S`;
}

function getEventTypeLabel(event: TimelineEvent) {
  if (event.entityType === 'album') return 'Lanzamiento clave';
  if (event.entityType === 'relationship') return 'Relación documentada';
  if (event.entityType === 'artist') return 'Hito histórico';
  return 'Archivo';
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
  const allDecades = getTimelineDecades(allEvents);
  const stats = getTimelineStats(allEvents);
  const options = getTimelineFilterOptions();
  const activeFilters = [filter.artistSlug, filter.placeSlug, filter.decade].filter(Boolean).length;
  const allVisibleEvents = decades.flatMap((decade) => decade.events);
  const visibleEvents = activeFilters > 0
    ? allVisibleEvents
    : decades.flatMap((decade) => decade.events.slice(0, defaultEventsPerDecade));

  return (
    <SiteShell>
      <main className="timelinePage">
        <nav className="timelineDecadeNav" aria-label="Selector de décadas">
          <Link className={!filter.decade ? 'active' : ''} href={createFilterHref({ artistSlug: filter.artistSlug, placeSlug: filter.placeSlug })}>Todo</Link>
          {allDecades.map((decade) => (
            <Link
              className={filter.decade === decade.startYear ? 'active' : ''}
              href={createFilterHref({ ...filter, decade: decade.startYear })}
              key={decade.startYear}
            >
              {getDecadeShortLabel(decade.startYear)}
            </Link>
          ))}
        </nav>

        <section className="timelineIntro">
          <p className="homeKicker">— Línea de tiempo</p>
          <h1>Historia del rap chileno por décadas</h1>
          <p>
            Hitos, discos y relaciones cruzados por año para leer el archivo como una secuencia cultural,
            no como una lista aislada de fichas.
          </p>
          <div className="timelineStats" aria-label="Resumen de timeline">
            <span><strong>{stats.total}</strong> eventos</span>
            <span><strong>{stats.decades}</strong> décadas</span>
            <span><strong>{stats.verifiedOrReviewed}</strong> revisados</span>
            <span><strong>{stats.pendingOrCandidate}</strong> candidatos</span>
          </div>
        </section>

        <section className="timelineCanvas" aria-label="Línea de tiempo editorial">
          <div className="timelineCenterLine" aria-hidden="true" />
          <div className="timelineMilestoneStack">
            {visibleEvents.map((event, index) => {
              const reversed = index % 2 === 1;
              return (
                <article className={`timelineMilestone ${reversed ? 'timelineMilestoneReverse' : ''}`} key={event.id}>
                  <div className="timelineMilestoneCopy">
                    <time>{event.year}</time>
                    <span className={`timelineTypePill timelineType-${event.entityType}`}>{getEventTypeLabel(event)}</span>
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <small>{event.era} · {event.curationStatus} · confianza {Math.round(event.confidence * 100)}%</small>
                  </div>
                  <div className="timelineConnectorDot" aria-hidden="true" />
                  <div className="timelineMilestoneMedia">
                    <div className="timelineImage" style={{ backgroundImage: `url(${timelineImages[index % timelineImages.length]})` }} aria-hidden="true" />
                  </div>
                </article>
              );
            })}
          </div>
          {visibleEvents.length === 0 ? <p className="emptyTimeline">No hay eventos para estos filtros todavía.</p> : null}
        </section>

        <section className="timelineArchiveIndex">
          <div>
            <span>Índice de archivo</span>
            <i aria-hidden="true" />
            <strong>Folio: 001-2024</strong>
          </div>
          <p>
            {activeFilters > 0
              ? `${allVisibleEvents.length} eventos visibles con ${activeFilters} filtro(s) activo(s).`
              : `${visibleEvents.length} hitos curados de ${allVisibleEvents.length} eventos disponibles. Filtra por década, artista o ciudad para abrir más registros.`}
          </p>
        </section>

        <section className="timelineFiltersPanel" aria-label="Filtros de timeline">
          <div>
            <p className="sectionTitle">Filtros rápidos</p>
            <h2>Explorar por artista o ciudad</h2>
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
      </main>
    </SiteShell>
  );
}
