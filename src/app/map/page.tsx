import Link from 'next/link';
import type { CSSProperties } from 'react';

import { SiteShell } from '@/components/layout/SiteShell';
import {
  getMapFilterOptions,
  getTerritorialMap,
  getTerritorialMapStats,
  type MapStatusFilter,
} from '@/lib/map';

const statusLabels: Record<MapStatusFilter, string> = {
  all: 'Todas',
  reviewed: 'Revisadas',
  candidate: 'Candidatas',
  pending: 'Pendientes',
};

type MapPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getStatusParam(value: string | undefined): MapStatusFilter {
  if (value === 'reviewed' || value === 'candidate' || value === 'pending') return value;
  return 'all';
}

function createMapHref(filter: { status?: MapStatusFilter; place?: string }) {
  const params = new URLSearchParams();
  if (filter.status && filter.status !== 'all') params.set('status', filter.status);
  if (filter.place) params.set('place', filter.place);
  return `/map${params.size ? `?${params.toString()}` : ''}`;
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const activeStatus = getStatusParam(getSingleParam(params?.status));
  const activePlace = getSingleParam(params?.place);
  const scenes = getTerritorialMap({ status: activeStatus });
  const visibleScenes = activePlace ? scenes.filter((scene) => scene.place.slug === activePlace) : scenes;
  const stats = getTerritorialMapStats(getTerritorialMap());
  const options = getMapFilterOptions();

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Sprint 15 · Mapa territorial</p>
          <h1>Mapa del rap chileno por escenas</h1>
          <p>
            Una vista territorial para leer de dónde salen los artistas, qué ciudades ya tienen evidencia y cuáles siguen como
            candidatos editoriales. El mapa se arma desde relaciones <code>from_place</code>, no desde texto libre, para mantener trazabilidad.
          </p>
          <div className="timelineStats" aria-label="Resumen territorial">
            <span><strong>{stats.places}</strong> lugares</span>
            <span><strong>{stats.artists}</strong> artistas</span>
            <span><strong>{stats.reviewedOrVerified}</strong> relaciones revisadas</span>
            <span><strong>{stats.pendingOrCandidate}</strong> pendientes/candidatas</span>
            <span><strong>{stats.sources}</strong> fuentes</span>
          </div>
        </section>

        <section className="contentCard mapFilters" aria-label="Filtros del mapa territorial">
          <div>
            <p className="sectionTitle">Filtros rápidos</p>
            <h2>Escenas por estado y ciudad</h2>
            <p className="muted">
              {visibleScenes.length} escena(s) visibles. Usa estos filtros para separar evidencia revisada de territorios pendientes.
            </p>
          </div>
          <div className="filterColumn">
            <span>Estado curatorial</span>
            <div className="chipGroup compactChips">
              {options.statuses.map((status) => (
                <Link className={activeStatus === status ? 'chip activeChip' : 'chip'} href={createMapHref({ status, place: activePlace })} key={status}>
                  {statusLabels[status]}
                </Link>
              ))}
            </div>
          </div>
          <div className="filterColumn">
            <span>Lugar</span>
            <div className="chipGroup compactChips">
              <Link className={!activePlace ? 'chip activeChip' : 'chip'} href={createMapHref({ status: activeStatus })}>Todos</Link>
              {options.places.map((place) => (
                <Link className={activePlace === place.slug ? 'chip activeChip' : 'chip'} href={createMapHref({ status: activeStatus, place: place.slug })} key={place.id}>
                  {place.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="contentCard territorialMapBoard">
          <div className="mapCanvas" aria-label="Mapa esquemático de escenas territoriales">
            {visibleScenes.map((scene, index) => (
              <Link
                aria-label={`Ver escena ${scene.place.name}`}
                className={`mapPin mapPin-${index + 1}`}
                href={`#scene-${scene.place.slug}`}
                key={scene.place.id}
                style={{ '--pin-x': `${normalizeLng(scene.coordinates.lng)}%`, '--pin-y': `${normalizeLat(scene.coordinates.lat)}%` } as CSSProperties}
              >
                <strong>{scene.artists.length}</strong>
                <span>{scene.place.name}</span>
              </Link>
            ))}
          </div>

          <div className="territorialSceneGrid">
            {visibleScenes.map((scene) => (
              <article className="territorialSceneCard" id={`scene-${scene.place.slug}`} key={scene.place.id}>
                <header>
                  <p className="eyebrow">{scene.place.type} · {scene.primaryCurationStatus}</p>
                  <h2>{scene.place.name}</h2>
                  <span>{scene.coordinates.lat}, {scene.coordinates.lng} · confianza promedio {Math.round(scene.averageConfidence * 100)}%</span>
                </header>

                <div className="mapStatusGrid" aria-label={`Estados de ${scene.place.name}`}>
                  <span><strong>{scene.statusCounts.reviewed}</strong> reviewed</span>
                  <span><strong>{scene.statusCounts.candidate}</strong> candidate</span>
                  <span><strong>{scene.statusCounts.pending}</strong> pending</span>
                </div>

                <div className="sceneArtistList">
                  {scene.artists.map((artist) => (
                    <Link className="listCard" href={`/artists/${artist.slug}`} key={artist.id}>
                      <strong>{artist.name}</strong>
                      <span>{artist.era} · {artist.tags.slice(0, 2).join(' / ')}</span>
                    </Link>
                  ))}
                </div>

                <div className="sourceEntityList">
                  {scene.sources.map((source) => (
                    <Link className="textLink" href={`/sources/${source.id}`} key={source.id}>{source.name}</Link>
                  ))}
                </div>
              </article>
            ))}
            {visibleScenes.length === 0 ? <p className="muted">No hay escenas territoriales para estos filtros todavía.</p> : null}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

function normalizeLng(lng: number) {
  const min = -76;
  const max = -66;
  return Math.min(92, Math.max(8, ((lng - min) / (max - min)) * 100));
}

function normalizeLat(lat: number) {
  const min = -44;
  const max = -17;
  return Math.min(92, Math.max(8, 100 - ((lat - min) / (max - min)) * 100));
}
