import type { Album } from './types';

const defaultEvidence = {
  sourceIds: ['source-curaduria-inicial'],
  sourceName: 'Curaduría inicial',
  sourceType: 'manual' as const,
  confidence: 0.55,
  curationStatus: 'candidate' as const,
};

export const albums: Album[] = [
  { ...defaultEvidence, id: 'album-aerolineas-makiza', slug: 'aerolineas-makiza', title: 'Aerolíneas Makiza', artistId: 'artist-makiza', year: 1999, type: 'album' },
  { id: 'album-relativo-absoluto', slug: 'relativo-absoluto-autobiografia-mc', title: 'Relativo & absoluto. Autobiografía de un MC', artistId: 'artist-seo2', year: 2009, type: 'album', sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.75, curationStatus: 'reviewed' },
  { ...defaultEvidence, id: 'album-ser-humano', slug: 'ser-humano', title: 'Ser Hümano!!', artistId: 'artist-tiro-de-gracia', year: 1997, type: 'album' },
  { ...defaultEvidence, id: 'album-corazon-de-chileno', slug: 'corazon-de-chileno', title: 'Corazón de Chileno', artistId: 'artist-la-pozze-latina', year: 1999, type: 'album' },
  { ...defaultEvidence, id: 'album-escribo-rap', slug: 'escribo-rap-con-r-de-revolucion', title: 'Escribo Rap con R de Revolución', artistId: 'artist-portavoz', year: 2012, type: 'album' },
  { ...defaultEvidence, id: 'album-teorema', slug: 'teorema', title: 'Teorema', artistId: 'artist-hordatoj', year: 2007, type: 'album' }
];
