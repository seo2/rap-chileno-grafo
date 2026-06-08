import Link from 'next/link';

import { SiteShell } from '@/components/layout/SiteShell';
import { getSearchFilters, searchCatalog, type SearchResultType } from '@/lib/search';
import type { CurationStatus } from '@/data/types';

type SearchPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const RESULT_TYPE_LABELS: Record<SearchResultType, string> = {
  artist: 'Artista',
  album: 'Disco',
  place: 'Lugar',
  source: 'Fuente',
  relationship: 'Relación',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = getSingleParam(params?.q) ?? '';
  const activeType = getSearchType(getSingleParam(params?.type));
  const activeStatus = getCurationStatus(getSingleParam(params?.status));
  const results = searchCatalog(query, {
    types: activeType ? [activeType] : undefined,
    statuses: activeStatus ? [activeStatus] : undefined,
  });
  const filters = getSearchFilters();
  const hasQuery = query.trim().length > 0;

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Búsqueda global</p>
          <h1>Buscar en el archivo editorial</h1>
          <p>
            Encuentra artistas, discos, lugares, relaciones y fuentes desde una sola vista.
            La búsqueda respeta estados de curaduría para separar datos revisados, candidatos y pendientes.
          </p>
          <form className="searchForm" action="/search">
            <label>
              <span>Consulta</span>
              <input name="q" placeholder="Ej: Santiago, Seo2, Aerolíneas Makiza..." defaultValue={query} autoFocus />
            </label>
            <label>
              <span>Tipo</span>
              <select name="type" defaultValue={activeType ?? ''}>
                <option value="">Todos los tipos</option>
                {filters.types.map((type) => (
                  <option key={type.value} value={type.value}>{type.label} ({type.count})</option>
                ))}
              </select>
            </label>
            <label>
              <span>Estado</span>
              <select name="status" defaultValue={activeStatus ?? ''}>
                <option value="">Todos los estados</option>
                {filters.statuses.map((status) => (
                  <option key={status.value} value={status.value}>{status.label} ({status.count})</option>
                ))}
              </select>
            </label>
            <button type="submit">Buscar</button>
          </form>
        </section>

        <section className="searchLayout">
          <aside className="contentCard searchFacets">
            <p className="sectionTitle">Filtros rápidos</p>
            <h2>Explorar por capa</h2>
            <div className="facetGroup">
              <Link className={!activeType ? 'facetLink active' : 'facetLink'} href={buildSearchHref({ query, status: activeStatus })}>Todos los tipos</Link>
              {filters.types.map((type) => (
                <Link
                  className={activeType === type.value ? 'facetLink active' : 'facetLink'}
                  href={buildSearchHref({ query, type: type.value, status: activeStatus })}
                  key={type.value}
                >
                  {type.label}<span>{type.count}</span>
                </Link>
              ))}
            </div>
            <p className="sectionTitle">Estado editorial</p>
            <div className="facetGroup">
              <Link className={!activeStatus ? 'facetLink active' : 'facetLink'} href={buildSearchHref({ query, type: activeType })}>Todos los estados</Link>
              {filters.statuses.map((status) => (
                <Link
                  className={activeStatus === status.value ? 'facetLink active' : 'facetLink'}
                  href={buildSearchHref({ query, type: activeType, status: status.value })}
                  key={status.value}
                >
                  {status.label}<span>{status.count}</span>
                </Link>
              ))}
            </div>
          </aside>

          <section className="contentCard searchResultsPanel">
            <div className="resultHeader">
              <div>
                <p className="sectionTitle">Resultados</p>
                <h2>{hasQuery ? `${results.length} resultado${results.length === 1 ? '' : 's'} para “${query}”` : 'Ingresa una búsqueda'}</h2>
              </div>
              {hasQuery ? <Link className="textLink" href="/search">Limpiar búsqueda</Link> : null}
            </div>

            {!hasQuery ? (
              <div className="emptyState">
                <h3>Prueba con un artista, disco, ciudad o fuente</h3>
                <p>Ejemplos: Santiago, Seo2, Makiza, Spotify, Aerolíneas Makiza.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="emptyState">
                <h3>No encontramos resultados con esos filtros</h3>
                <p>Quita el filtro de tipo/estado o intenta con una palabra más amplia.</p>
              </div>
            ) : (
              <div className="searchResults">
                {results.map((result) => (
                  <article className="searchResultCard" key={`${result.type}-${result.id}`}>
                    <div>
                      <p className="eyebrow">{RESULT_TYPE_LABELS[result.type]} · score {result.score}</p>
                      <h3><Link className="textLink" href={result.href}>{result.title}</Link></h3>
                      <p>{result.subtitle}</p>
                      <p>{result.description}</p>
                    </div>
                    <div className="chipGroup">
                      <span className="statusPill">{result.curationStatus}</span>
                      {typeof result.confidence === 'number' ? <span className="chip">confianza {Math.round(result.confidence * 100)}%</span> : null}
                      {result.sourceName ? <span className="chip">{result.sourceName}</span> : null}
                      <span className="chip">match: {result.matchedFields.join(', ')}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </SiteShell>
  );
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getSearchType(value: string | undefined): SearchResultType | undefined {
  if (value === 'artist' || value === 'album' || value === 'place' || value === 'source' || value === 'relationship') return value;
  return undefined;
}

function getCurationStatus(value: string | undefined): CurationStatus | undefined {
  if (value === 'pending' || value === 'candidate' || value === 'reviewed' || value === 'verified' || value === 'rejected') return value;
  return undefined;
}

function buildSearchHref({ query, type, status }: { query: string; type?: SearchResultType; status?: CurationStatus }) {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query.trim());
  if (type) params.set('type', type);
  if (status) params.set('status', status);
  const suffix = params.toString();
  return suffix ? `/search?${suffix}` : '/search';
}
