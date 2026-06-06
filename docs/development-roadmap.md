# Roadmap de desarrollo — El País Más Rapero

## Objetivo inmediato

Convertir la demo visual actual en un MVP navegable de Next.js con estructura real, dataset semilla ampliable y primeras páginas de exploración.

## Principio de trabajo

Avanzar por fases pequeñas, verificables y con build pasando siempre:

```bash
npm run build
npm test
npm run typecheck
npm run lint
```

Cada fase debe dejar el sitio usable, aunque todavía tenga datos semilla.

---

## Fase 1 — Estructura navegable

**Objetivo:** crear la arquitectura base del sitio.

Rutas a crear:

```text
/
/graph
/artists
/artists/[slug]
/albums
/timeline
/sources
/about
```

Tareas:

1. Extraer layout compartido:
   - `src/components/layout/SiteHeader.tsx`
   - `src/components/layout/SiteShell.tsx`

2. Extraer componentes actuales:
   - `src/components/graph/GraphPreview.tsx`
   - `src/components/catalog/ArtistList.tsx`
   - `src/components/catalog/MetricCards.tsx`

3. Crear páginas base:
   - `src/app/graph/page.tsx`
   - `src/app/artists/page.tsx`
   - `src/app/artists/[slug]/page.tsx`
   - `src/app/albums/page.tsx`
   - `src/app/timeline/page.tsx`
   - `src/app/sources/page.tsx`
   - `src/app/about/page.tsx`

4. Validar navegación y build.

**Resultado esperado:** el usuario puede moverse por el sitio aunque las páginas usen todavía datos semilla.

---

## Fase 2 — Modelo de datos más sólido

**Objetivo:** ordenar el dataset para que soporte grafo, artistas, discos, fuentes y futuras importaciones.

Crear:

```text
src/data/seed-artists.ts
src/data/seed-albums.ts
src/data/seed-places.ts
src/data/seed-relationships.ts
src/data/seed-sources.ts
src/lib/catalog.ts
src/lib/graph.ts
src/lib/sources.ts
```

Agregar campos editoriales:

```ts
sourceUrl
sourceName
sourceType
confidence
curationStatus
notes
```

Estados:

```text
pending
candidate
reviewed
verified
rejected
```

**Resultado esperado:** cada artista/disco/relación puede estar asociado a fuentes y estado de curaduría.

---

## Fase 3 — Páginas de artista y disco

**Objetivo:** que el sitio tenga fichas profundas.

### Artista `/artists/[slug]`

Debe mostrar:

- nombre;
- ciudad/región;
- era;
- tags;
- bio curatorial;
- discos;
- relaciones;
- fuentes;
- indicador si es rap puro o cruce urbano futuro.

### Disco `/albums/[slug]`

Debe mostrar:

- título;
- artista;
- año;
- tipo;
- tracklist futuro;
- colaboradores;
- fuentes;
- relaciones en grafo.

**Resultado esperado:** una ficha usable para Ana Tijoux, Makiza, Tiro de Gracia, Portavoz y algunos discos.

---

## Fase 4 — Grafo interactivo real

**Objetivo:** reemplazar el SVG fijo por un grafo interactivo.

Opciones técnicas:

1. **D3 force graph** — máximo control visual.
2. **Sigma.js** — mejor rendimiento para grafos grandes.
3. **Cytoscape.js** — más estructurado para redes complejas.

Recomendación inicial: **D3** para la primera versión, porque queremos una gráfica novedosa y control estético.

Tareas:

- crear `GraphCanvas.tsx` como client component;
- convertir artistas/discos/lugares en nodos;
- convertir relaciones en links;
- click en nodo muestra panel;
- filtros por era/tipo de nodo;
- animación suave.

**Resultado esperado:** `/graph` se siente como la vista principal del producto.

---

## Fase 5 — Timeline

**Objetivo:** construir una línea de tiempo visual por eras.

Datos:

```text
era
year
title
description
entityType
entityId
sourceId
```

Vista:

- scroll horizontal o vertical;
- décadas agrupadas;
- discos e hitos destacados;
- filtros por artista/ciudad.

**Resultado esperado:** navegar la historia del rap chileno desde vieja escuela a actualidad rap.

---

## Fase 6 — Fuentes y curaduría

**Objetivo:** hacer transparente de dónde salen los datos.

Páginas:

```text
/sources
/sources/[id]  -- futuro
```

Mostrar:

- fuente;
- tipo;
- URL;
- qué entidades menciona;
- qué datos extrajo;
- estado de revisión.

**Resultado esperado:** el proyecto gana credibilidad y queda preparado para scraping/imports.

---

## Fase 7 — Spotify importer

**Objetivo:** traer catálogo real desde Spotify.

Crear:

```text
src/lib/spotify.ts
scripts/import-spotify-artist.ts
```

Importar:

- Spotify artist ID;
- imágenes;
- popularidad;
- géneros;
- álbumes;
- tracks;
- colaboraciones visibles.

Variables necesarias:

```text
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
```

**Resultado esperado:** podemos enriquecer artistas semilla con datos reales.

---

## Fase 8 — Investigación externa

**Objetivo:** empezar a procesar las fuentes que compartiste.

Fuentes iniciales:

- Red Bull cronología;
- rapchileno.cl;
- SHIA discos nacionales;
- Imperio H2;
- Chile Vieja Escuela;
- tesis académicas;
- Música Popular.

En esta fase no conviene publicar datos automáticamente. Mejor crear candidatos:

```text
candidate_artist
candidate_album
candidate_relationship
candidate_event
candidate_source_quote
```

**Resultado esperado:** cola de datos candidatos para revisar antes de incorporar al grafo.

---

## Orden recomendado para empezar ya

### Sprint 1

1. Crear layout compartido.
2. Crear rutas base.
3. Crear `/artists` y `/artists/[slug]` con datos semilla.
4. Crear `/sources` y `/about`.
5. Validar build/test/lint.

### Sprint 2

1. Separar dataset en archivos por entidad.
2. Crear helpers de grafo.
3. Crear `/graph` dedicado.
4. Añadir filtros básicos.
5. Validar.

### Sprint 3

1. Implementar D3 graph client component.
2. Agregar panel de nodo seleccionado.
3. Mejorar visualmente la red.
4. Empezar fichas de disco.

### Sprint 4

1. Spotify importer.
2. Fuentes externas como candidatos.
3. Capa de curaduría.

---

## Decisión para la próxima acción

La próxima tarea concreta debería ser:

> **Fase 1 / Sprint 1: crear rutas base, layout compartido y páginas iniciales usando el dataset actual.**

Esto nos da una estructura real sobre la cual construir el grafo, el mapa, timeline, artistas, discos y fuentes.
