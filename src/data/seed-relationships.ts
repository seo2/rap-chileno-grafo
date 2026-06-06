import type { Relationship } from './types';

const manualCandidate = {
  sourceIds: ['source-curaduria-inicial'],
  sourceName: 'Curaduría inicial',
  sourceType: 'manual' as const,
  confidence: 0.55,
  curationStatus: 'candidate' as const,
};

const pendingPlace = {
  sourceIds: ['source-curaduria-inicial'],
  sourceName: 'Curaduría inicial',
  sourceType: 'manual' as const,
  confidence: 0.35,
  curationStatus: 'pending' as const,
  notes: 'Relación territorial pendiente de fuente externa.',
};

export const relationships: Relationship[] = [
  { ...manualCandidate, id: 'rel-ana-makiza', source: 'artist-ana-tijoux', target: 'artist-makiza', relationshipType: 'member_of', weight: 5 },
  { id: 'rel-seo2-makiza', source: 'artist-seo2', target: 'artist-makiza', relationshipType: 'member_of', weight: 5, sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.75, curationStatus: 'reviewed' },
  { id: 'rel-seo2-relativo-absoluto', source: 'artist-seo2', target: 'album-relativo-absoluto', relationshipType: 'released', weight: 4, year: 2009, sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.75, curationStatus: 'reviewed' },
  { id: 'rel-seo2-santiago', source: 'artist-seo2', target: 'place-santiago', relationshipType: 'from_place', weight: 3, sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.7, curationStatus: 'reviewed', notes: 'Música Popular registra residencia en Santiago.' },
  { id: 'rel-seo2-castro', source: 'artist-seo2', target: 'place-castro', relationshipType: 'from_place', weight: 3, sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.7, curationStatus: 'reviewed', notes: 'Música Popular registra residencia en Chiloé y primer grupo Castro Familia Crew.' },
  { ...manualCandidate, id: 'rel-makiza-aerolineas', source: 'artist-makiza', target: 'album-aerolineas-makiza', relationshipType: 'released', weight: 5, year: 1999 },
  { ...manualCandidate, id: 'rel-tiro-ser-humano', source: 'artist-tiro-de-gracia', target: 'album-ser-humano', relationshipType: 'released', weight: 5, year: 1997 },
  { ...manualCandidate, id: 'rel-portavoz-escribo', source: 'artist-portavoz', target: 'album-escribo-rap', relationshipType: 'released', weight: 4, year: 2012 },
  { ...pendingPlace, id: 'rel-ana-santiago', source: 'artist-ana-tijoux', target: 'place-santiago', relationshipType: 'from_place', weight: 3 },
  { ...pendingPlace, id: 'rel-tiro-santiago', source: 'artist-tiro-de-gracia', target: 'place-santiago', relationshipType: 'from_place', weight: 3 },
  { ...pendingPlace, id: 'rel-portavoz-santiago', source: 'artist-portavoz', target: 'place-santiago', relationshipType: 'from_place', weight: 3 },
  { ...pendingPlace, id: 'rel-la-pozze-santiago', source: 'artist-la-pozze-latina', target: 'place-santiago', relationshipType: 'from_place', weight: 3 },
  { ...pendingPlace, id: 'rel-pantera-santiago', source: 'artist-panteras-negras', target: 'place-santiago', relationshipType: 'from_place', weight: 3 },
  { ...manualCandidate, id: 'rel-movimiento-liricistas', source: 'artist-movimiento-original', target: 'artist-liricistas', relationshipType: 'collaborated_with', weight: 2, confidence: 0.3, notes: 'Candidato grafo; requiere evidencia de colaboración concreta.' },
  { ...manualCandidate, id: 'rel-hordatoj-chystemc', source: 'artist-hordatoj', target: 'artist-chystemc', relationshipType: 'collaborated_with', weight: 2, confidence: 0.3, notes: 'Candidato grafo; requiere evidencia de colaboración concreta.' },
  { ...manualCandidate, id: 'rel-cevlade-flor', source: 'artist-cevlade', target: 'artist-flor-de-rap', relationshipType: 'collaborated_with', weight: 1, confidence: 0.3, notes: 'Candidato grafo; requiere evidencia de colaboración concreta.' }
];
