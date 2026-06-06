# Rap Chileno Grafo — Plan de Producto y MVP

> **Para Hermes/Codex:** si implementamos este plan en código, usar `subagent-driven-development` tarea por tarea y mantener cada entrega verificable.

**Goal:** construir una plataforma visual para explorar la historia, geografía, discografía y red de colaboraciones del rap chileno.

**Architecture:** separar datos curatoriales de datos importados. Spotify y fuentes externas alimentan entidades normalizadas; la visualización consume una API propia que devuelve nodos, relaciones y vistas agregadas.

**Tech Stack propuesto:** Next.js + TypeScript, Supabase/Postgres, Prisma o Drizzle, Spotify Web API, scripts de investigación/importación, D3/Sigma/Cytoscape para grafo, Mapbox/Leaflet para mapa, Framer Motion para transiciones.

---

## 1. Principio editorial

El sitio no debe ser solo “un catálogo de Spotify”. Debe ser una **cartografía cultural** del rap chileno.

Cada dato importante debe tener:

- `source_url`: fuente exacta;
- `source_name`: Spotify, Música Popular, Red Bull, tesis, blog, curador, etc.;
- `confidence`: alta/media/baja;
- `curation_status`: pendiente, verificado, discutible, descartado;
- `notes`: contexto humano.

Esto permite usar internet como materia prima sin convertir errores en verdad definitiva.

---

## 2. Vistas visuales iniciales

### Vista A — Red Viva

Grafo central con artistas, discos y canciones.

- Nodos grandes: artistas.
- Nodos medianos: discos.
- Nodos pequeños: canciones/colaboraciones.
- Color por era.
- Grosor de arista por cantidad de colaboraciones.
- Filtro por década, ciudad, tipo de relación.

### Vista B — Mapa de Escenas

Mapa de Chile con clusters por ciudad/comuna.

- Santiago, Valparaíso, Concepción, Antofagasta, Temuco, etc.
- Al hacer zoom: artistas, crews, discos nacidos en esa zona.
- Rutas entre ciudades cuando hay colaboraciones interregionales.

### Vista C — Cronología

Timeline horizontal/vertical de hitos.

- décadas: 80s, 90s, 2000s, 2010s, 2020s;
- discos claves;
- aparición de crews/escenas;
- hitos mediáticos, sellos, festivales, internacionalización.

### Vista D — Discografía Nacional

Explorador visual de discos.

- grilla por portada;
- filtros por año, artista, sello, formato;
- “modo museo”: discos clásicos destacados con ficha extendida.

### Vista E — Ruta de Influencias

Vista narrativa para contar caminos:

- de vieja escuela a nueva escuela;
- de una ciudad a otra;
- de un grupo a artistas solistas;
- genealogías de crews.

---

## 3. Modelo de datos inicial

```text
artists
- id
- name
- slug
- spotify_id
- image_url
- bio
- country
- city
- commune
- era_start
- era_label
- genres
- popularity
- official_links
- curation_status

albums
- id
- spotify_id
- title
- slug
- artist_credit
- release_date
- release_year
- album_type
- label
- cover_url
- source_url

tracks
- id
- spotify_id
- title
- album_id
- duration_ms
- popularity
- isrc

places
- id
- name
- type          -- país, región, ciudad, comuna, barrio
- lat
- lng

relationships
- id
- source_type
- source_id
- target_type
- target_id
- relationship_type
- weight
- year
- source_url
- confidence
- notes

sources
- id
- url
- name
- source_type   -- spotify, article, academic, blog, manual
- fetched_at
- extraction_status
- notes
```

Tipos de relación:

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

---

## 4. Fuentes y uso esperado

| Fuente | Uso principal | Riesgo |
|---|---|---|
| Spotify Web API | catálogo, imágenes, álbumes, tracks, colaboraciones | no entrega geografía/historia profunda |
| Red Bull cronología | hitos históricos y eras | texto narrativo, requiere extracción manual/semiautomática |
| rapchileno.cl | noticias, artistas, escena reciente | estructura variable |
| SHIA discos nacionales | discografía nacional | requiere normalización y verificación |
| Imperio H2 | cultura hip hop, entrevistas, escena | estructura variable |
| Chile Vieja Escuela | archivo histórico vieja escuela | blog antiguo, posible scraping delicado |
| Tesis académicas | contexto social, territorio, historia | extracción PDF y citas cuidadosas |
| Música Popular | perfiles biográficos, discografía | excelente para fichas verificables |

---

## 5. MVP recomendado

### Objetivo MVP

Tener una demo navegable con 30–50 artistas, 100–200 discos/tracks y colaboraciones básicas, más 3 vistas visuales:

1. red de colaboraciones;
2. mapa de origen/escenas;
3. timeline de eras/discos.

### Dataset semilla

Empezar con artistas “ancla” por era:

- Vieja escuela / 80s-90s: Panteras Negras, La Pozze Latina, Tiro de Gracia, Makiza.
- 2000s: Ana Tijoux, Hordatoj, FDA, Cómo Asesinar a Felipes, Portavoz.
- 2010s: Movimiento Original, Liricistas, Chystemc, Jonas Sanche, Cevladé, Bronko Yotte.
- 2020s: Flor de Rap, Akriila, Young Cister, Pablo Chill-E, Marcianeke, etc. Solo si decidimos incluir cruces con trap/urbano.

Hay que definir editorialmente si el sitio incluye solo rap/hip-hop o también trap/urbano chileno.

---

## 6. Fases de implementación

### Fase 0 — Prototipo visual

**Objetivo:** definir look & feel y tipos de vistas sin backend.

- Crear HTML/React mock con datos inventados/mínimos.
- Validar lenguaje visual: grafo + mapa + timeline.
- Definir identidad: dark, urbana, “archivo vivo”.

### Fase 1 — App base

- Crear Next.js app.
- Configurar Tailwind o CSS modules.
- Crear rutas:
  - `/`
  - `/graph`
  - `/map`
  - `/timeline`
  - `/artists/[slug]`
  - `/albums/[slug]`
- Crear dataset local `data/seed.json`.

### Fase 2 — Base de datos

- Crear Supabase/Postgres.
- Migrar modelo: artists, albums, tracks, places, relationships, sources.
- Crear API interna para nodos/aristas.

### Fase 3 — Spotify importer

- Configurar app Spotify.
- Script: buscar artista por nombre.
- Script: importar artista, álbumes y tracks.
- Detectar colaboraciones por tracks con múltiples artistas.
- Guardar `spotify_id` para evitar duplicados.

### Fase 4 — Investigación externa

- Crear tabla `source_documents`.
- Extraer texto de páginas/PDFs.
- Guardar candidatos: artista, disco, lugar, año, relación.
- Todo candidato queda como `pending` hasta revisión.

### Fase 5 — Admin/curaduría

- Panel simple para aprobar/rechazar datos.
- Edición de fichas de artista/disco.
- Control de fuentes y notas.

---

## 7. Spikes técnicos recomendados

| # | Spike | Valida | Riesgo |
|---|---|---|---|
| 001 | grafo-interactivo | si D3/Sigma/Cytoscape permite una visual novedosa y fluida | Alto |
| 002 | spotify-importer | si podemos detectar colaboraciones útiles desde Spotify | Alto |
| 003 | source-extraction | si podemos extraer datos razonables desde sitios/PDFs | Alto |
| 004 | mapa-escenas | si mapa + red se siente distinto y no genérico | Medio |
| 005 | admin-curaduria | si el flujo de validar datos es rápido | Medio |

---

## 8. Decisiones pendientes

1. Nombre del proyecto.
2. Si incluimos trap/urbano o solo rap/hip-hop.
3. Si será público desde el inicio o primero archivo privado.
4. Nivel de automatización: ¿importar todo automáticamente o semiautomático con curaduría?
5. Estética final: más “Spotify dark”, más “archivo académico”, más “calle/collage”, o mezcla.

---

## 9. Primer criterio de éxito

La primera demo debe lograr esto:

> “Entro, busco un artista chileno, veo su red, su ciudad, sus discos, su era y conexiones históricas; siento que estoy explorando una escena viva, no una tabla de datos.”
