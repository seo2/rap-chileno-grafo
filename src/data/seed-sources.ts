import type { Source } from './types';

export const sources: Source[] = [
  {
    id: 'source-curaduria-inicial',
    name: 'Curaduría inicial',
    sourceType: 'manual',
    description: 'Dataset semilla creado para probar navegación, grafo y flujo editorial antes de importar fuentes externas.',
    curationStatus: 'candidate',
  },
  {
    id: 'source-spotify-web-api',
    name: 'Spotify Web API',
    sourceType: 'api',
    url: 'https://developer.spotify.com/documentation/web-api',
    description: 'Fuente futura para catálogo musical: artistas, imágenes, álbumes, tracks y popularidad.',
    curationStatus: 'pending',
    notes: 'No debe usarse como fuente única de historia, territorio o pertenencia de escena.',
  },
  {
    id: 'source-redbull-cronologia',
    name: 'Red Bull cronología del rap chileno',
    sourceType: 'article',
    url: 'https://www.redbull.com/cl-es/music-cronologia-del-rap-chileno',
    description: 'Artículo candidato para hitos históricos y eras.',
    curationStatus: 'pending',
  },
  {
    id: 'source-shia-discos',
    name: 'SHIA discos nacionales',
    sourceType: 'archive',
    description: 'Archivo candidato para discografías nacionales.',
    curationStatus: 'pending',
  },
  {
    id: 'source-musica-popular',
    name: 'Música Popular',
    sourceType: 'archive',
    description: 'Archivo candidato para biografías, proyectos y referencias históricas.',
    curationStatus: 'pending',
  },
  {
    id: 'source-musica-popular-seo2',
    name: 'Música Popular: Seo2',
    sourceType: 'archive',
    url: 'https://www.musicapopular.cl/artista/seo2/',
    description: 'Ficha biográfica y discográfica de Seo2 usada como primera fuente externa para su nodo de artista.',
    curationStatus: 'reviewed',
    notes: 'Indica a Cristián Bórquez / Seo2 como ex integrante de Makiza y Némesis, con residencias en Chiloé y Santiago, y una trayectoria solista y colaborativa.',
  },
  {
    id: 'source-tesis-academicas',
    name: 'Tesis académicas',
    sourceType: 'academic',
    description: 'Capa futura para contexto histórico, social y territorial.',
    curationStatus: 'pending',
  },
];
