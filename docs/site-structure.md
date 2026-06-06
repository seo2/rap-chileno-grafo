# Estructura del sitio — El País Más Rapero

## Principio

El sitio se organiza como una experiencia de exploración, no como un blog tradicional. La portada funciona como tablero vivo; desde ahí el usuario entra a redes, mapas, timelines, artistas, discos y fuentes.

## Rutas principales

```text
/
/graph
/map
/timeline
/artists
/artists/[slug]
/albums
/albums/[slug]
/places
/places/[slug]
/scenes
/scenes/[slug]
/sources
/about
```

## 1. Home `/`

**Rol:** entrada editorial + dashboard visual.

Debe mostrar:

- nombre: El País Más Rapero;
- resumen del proyecto;
- grafo destacado;
- métricas: artistas, discos, relaciones, ciudades, fuentes;
- accesos a Red, Mapa, Cronología y Discografía;
- artista/disco destacado;
- bloque editorial: “solo rap por ahora; cruces urbanos marcados aparte”.

## 2. Red Viva `/graph`

**Rol:** vista principal del proyecto.

Contenido:

- grafo interactivo de artistas, discos, ciudades, eras y colaboraciones;
- filtros por década, ciudad, tipo de relación, fuente y confianza;
- panel lateral con ficha del nodo seleccionado;
- leyenda visual;
- modo “rutas”: de un artista a otro;
- modo “colaboraciones”;
- modo “discografía”.

Tipos de nodos:

```text
artist
album
track
place
scene
era
source
```

Tipos de relaciones:

```text
released
appears_on
collaborated_with
member_of
from_place
associated_with_scene
influenced_by
produced_by
mentioned_in_source
```

## 3. Mapa `/map`

**Rol:** territorio y escenas.

Contenido:

- mapa de Chile;
- clusters por ciudad/comuna/barrio;
- artistas por territorio;
- discos asociados a lugares;
- rutas de colaboración entre ciudades;
- capas: vieja escuela, 90s, 2000s, 2010s, actualidad.

## 4. Cronología `/timeline`

**Rol:** historia por eras.

Contenido:

- línea de tiempo por años/décadas;
- discos clave;
- aparición de grupos/escenas;
- hitos culturales;
- fuentes que respaldan cada hito;
- opción de filtrar por ciudad, artista o tipo de evento.

## 5. Artistas `/artists` y `/artists/[slug]`

### `/artists`

Listado visual de artistas.

Filtros:

- era;
- ciudad;
- grupo/solista;
- cantidad de colaboraciones;
- fuente verificada;
- cruce urbano/trap, oculto por defecto.

### `/artists/[slug]`

Ficha profunda del artista.

Debe incluir:

- nombre;
- imagen;
- ciudad/comuna/región;
- era principal;
- biografía curatorial;
- discos;
- canciones destacadas;
- colaboraciones;
- red personal;
- mapa de relaciones;
- fuentes;
- estado de verificación.

## 6. Discos `/albums` y `/albums/[slug]`

### `/albums`

Vista tipo museo/discografía nacional.

Filtros:

- año;
- década;
- artista;
- sello;
- tipo: album, EP, single, compilación;
- disponible/no disponible en Spotify.

### `/albums/[slug]`

Ficha del disco.

Debe incluir:

- portada;
- artista;
- año;
- sello;
- tracklist;
- colaboradores;
- lugar/escena;
- fuentes;
- conexión con otros discos/artistas.

## 7. Lugares `/places` y `/places/[slug]`

**Rol:** páginas de ciudades, comunas o barrios.

Ejemplos:

```text
/places/santiago
/places/valparaiso
/places/concepcion
```

Contenido:

- mapa;
- artistas vinculados;
- discos vinculados;
- escenas locales;
- timeline local;
- relaciones con otros lugares.

## 8. Escenas `/scenes` y `/scenes/[slug]`

**Rol:** agrupar movimientos que no son solo geográficos.

Ejemplos:

```text
vieja-escuela
rap-politico
underground-2000s
rap-femenino
regiones
```

Contenido:

- descripción editorial;
- artistas asociados;
- discos clave;
- lugares;
- fuentes;
- grafo filtrado por escena.

## 9. Fuentes `/sources`

**Rol:** transparencia y curaduría.

Debe mostrar:

- Spotify Web API;
- Red Bull cronología;
- SHIA;
- RapChileno.cl;
- Imperio H2;
- Chile Vieja Escuela;
- Música Popular;
- tesis académicas;
- fuentes manuales.

Cada fuente tendrá estado:

```text
pending
extracted
reviewed
verified
rejected
```

## 10. About `/about`

**Rol:** explicar el proyecto.

Debe incluir:

- qué es El País Más Rapero;
- alcance: solo rap inicialmente;
- cómo se tratan trap/urbano y cruces;
- metodología de fuentes;
- contacto/colaboración;
- criterios editoriales.

## Navegación principal

```text
Red
Mapa
Cronología
Artistas
Discos
Fuentes
```

## Estructura técnica Next.js propuesta

```text
src/
  app/
    page.tsx
    graph/page.tsx
    map/page.tsx
    timeline/page.tsx
    artists/page.tsx
    artists/[slug]/page.tsx
    albums/page.tsx
    albums/[slug]/page.tsx
    places/page.tsx
    places/[slug]/page.tsx
    scenes/page.tsx
    scenes/[slug]/page.tsx
    sources/page.tsx
    about/page.tsx
  components/
    layout/
      SiteHeader.tsx
      SiteShell.tsx
      SidePanel.tsx
    graph/
      GraphCanvas.tsx
      GraphLegend.tsx
      GraphFilters.tsx
      NodeDetailPanel.tsx
    map/
      ChileSceneMap.tsx
      PlaceCluster.tsx
    timeline/
      EraTimeline.tsx
      TimelineEventCard.tsx
    catalog/
      ArtistCard.tsx
      AlbumCard.tsx
      SourceBadge.tsx
  lib/
    catalog.ts
    graph.ts
    filters.ts
    sources.ts
    spotify.ts
  data/
    seed-artists.ts
    seed-albums.ts
    seed-relationships.ts
    seed-places.ts
```

## MVP navegable recomendado

Primera versión navegable:

```text
/
/graph
/artists
/artists/ana-tijoux
/albums
/timeline
/sources
/about
```

Después agregamos:

```text
/map
/places/[slug]
/scenes/[slug]
```

## Experiencia ideal

El usuario entra y puede hacer tres cosas rápidamente:

1. Explorar el grafo y descubrir conexiones.
2. Buscar un artista y ver su ficha profunda.
3. Viajar por eras, discos y ciudades con fuentes verificables.
