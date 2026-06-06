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
  { ...defaultEvidence, id: 'place-concepcion', slug: 'concepcion', name: 'Concepción', type: 'city', lat: -36.827, lng: -73.0503 }
];
