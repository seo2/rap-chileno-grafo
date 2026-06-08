import type { Place } from './types';

const defaultEvidence = {
  sourceIds: ['source-curaduria-inicial'],
  sourceName: 'Curaduría inicial',
  sourceType: 'manual' as const,
  confidence: 0.5,
  curationStatus: 'pending' as const,
  notes: 'Coordenadas y escena local requieren verificación editorial.',
};

export const places: Place[] = [
  { ...defaultEvidence, id: 'place-santiago', slug: 'santiago', name: 'Santiago', type: 'city', lat: -33.4489, lng: -70.6693 },
  { ...defaultEvidence, id: 'place-castro', slug: 'castro', name: 'Castro / Chiloé', type: 'city', lat: -42.4801, lng: -73.7624, sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.7, curationStatus: 'reviewed', notes: 'Música Popular registra residencia de Seo2 en Chiloé y su primer grupo Castro Familia Crew.' },
  { ...defaultEvidence, id: 'place-valparaiso', slug: 'valparaiso', name: 'Valparaíso', type: 'city', lat: -33.0472, lng: -71.6127 },
  { ...defaultEvidence, id: 'place-concepcion', slug: 'concepcion', name: 'Concepción', type: 'city', lat: -36.827, lng: -73.0503 },
  { ...defaultEvidence, id: 'place-maipu', slug: 'maipu', name: 'Maipú', type: 'commune', lat: -33.5111, lng: -70.7569, sourceIds: ['source-musica-popular-liricistas'], sourceName: 'Música Popular: Liricistas', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/grupo/liricistas/', confidence: 0.72, curationStatus: 'reviewed', notes: 'Música Popular ubica a Liricistas en Ciudad Satélite de Maipú.' },
  { ...defaultEvidence, id: 'place-conchali', slug: 'conchali', name: 'Conchalí', type: 'commune', lat: -33.3833, lng: -70.675, sourceIds: ['source-musica-popular-portavoz'], sourceName: 'Música Popular: Portavoz', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/portavoz/', confidence: 0.7, curationStatus: 'reviewed', notes: 'Música Popular menciona la población Juanita Aguirre de Conchalí en la formación de Portavoz.' },
  { ...defaultEvidence, id: 'place-recoleta', slug: 'recoleta', name: 'Recoleta', type: 'commune', lat: -33.4064, lng: -70.64, sourceIds: ['source-musica-popular-portavoz'], sourceName: 'Música Popular: Portavoz', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/portavoz/', confidence: 0.65, curationStatus: 'reviewed', notes: 'Música Popular registra infancia de Portavoz en Recoleta.' },
  { ...defaultEvidence, id: 'place-renca', slug: 'renca', name: 'Renca', type: 'commune', lat: -33.4033, lng: -70.7286, sourceIds: ['source-musica-popular-panteras-negras'], sourceName: 'Música Popular: Panteras Negras', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/grupo/panteras-negras/', confidence: 0.76, curationStatus: 'reviewed', notes: 'Música Popular sitúa el origen de Panteras Negras en la población Huamachuco de Renca.' },
  { ...defaultEvidence, id: 'place-san-joaquin', slug: 'san-joaquin', name: 'San Joaquín', type: 'commune', lat: -33.49, lng: -70.6283, sourceIds: ['source-musica-popular-hordatoj'], sourceName: 'Música Popular: Hordatoj', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/hordatoj/', confidence: 0.66, curationStatus: 'reviewed', notes: 'Música Popular indica que Hordatoj creció en San Joaquín.' },
  { ...defaultEvidence, id: 'place-teno', slug: 'teno', name: 'Teno', type: 'city', lat: -34.8708, lng: -71.1625, sourceIds: ['source-musica-popular-hordatoj'], sourceName: 'Música Popular: Hordatoj', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/hordatoj/', confidence: 0.72, curationStatus: 'reviewed', notes: 'Música Popular registra Teno como lugar de nacimiento de Hordatoj.' },
  { ...defaultEvidence, id: 'place-antofagasta', slug: 'antofagasta', name: 'Antofagasta', type: 'city', lat: -23.65, lng: -70.4, sourceIds: ['source-musica-popular-jonas-sanche'], sourceName: 'Música Popular: Jonas Sanche', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/jonas-sanche/', confidence: 0.74, curationStatus: 'reviewed', notes: 'Música Popular registra Antofagasta como origen de Jonas Sanche.' },
  { ...defaultEvidence, id: 'place-la-florida', slug: 'la-florida', name: 'La Florida', type: 'commune', lat: -33.5333, lng: -70.5833, sourceIds: ['source-musica-popular-jonas-sanche'], sourceName: 'Música Popular: Jonas Sanche', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/jonas-sanche/', confidence: 0.62, curationStatus: 'reviewed', notes: 'Música Popular menciona La Florida como lugar de inicio rapero de Jonas Sanche al llegar a Santiago.' },
  { ...defaultEvidence, id: 'place-puente-alto', slug: 'puente-alto', name: 'Puente Alto', type: 'commune', lat: -33.6167, lng: -70.5667 },
  { ...defaultEvidence, id: 'place-lo-prado', slug: 'lo-prado', name: 'Lo Prado', type: 'commune', lat: -33.4447, lng: -70.7253 },
  { ...defaultEvidence, id: 'place-la-serena', slug: 'la-serena', name: 'La Serena', type: 'city', lat: -29.9027, lng: -71.2519 },
  { ...defaultEvidence, id: 'place-temuco', slug: 'temuco', name: 'Temuco', type: 'city', lat: -38.7359, lng: -72.5904 },
  { ...defaultEvidence, id: 'place-iquique', slug: 'iquique', name: 'Iquique', type: 'city', lat: -20.2307, lng: -70.1357 }
];
