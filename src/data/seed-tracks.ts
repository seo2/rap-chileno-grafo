import type { AlbumTrack } from './types';

const defaultTrackEvidence = {
  sourceIds: ['source-curaduria-inicial'],
  sourceName: 'Curaduría tracklist semilla',
  sourceType: 'manual' as const,
  confidence: 0.55,
  curationStatus: 'candidate' as const,
};

export const tracks: AlbumTrack[] = [
  {
    ...defaultTrackEvidence,
    id: 'track-relativo-intro',
    albumId: 'album-relativo-absoluto',
    trackNumber: 1,
    title: 'Intro',
  },
  {
    ...defaultTrackEvidence,
    id: 'track-relativo-mi-testimonio',
    albumId: 'album-relativo-absoluto',
    trackNumber: 2,
    title: 'Mi testimonio',
  },
  {
    ...defaultTrackEvidence,
    id: 'track-relativo-rap-para-mi-gente',
    albumId: 'album-relativo-absoluto',
    trackNumber: 3,
    title: 'Rap para mi gente',
  },
  {
    ...defaultTrackEvidence,
    id: 'track-relativo-relativo-absoluto',
    albumId: 'album-relativo-absoluto',
    trackNumber: 4,
    title: 'Relativo & absoluto',
  },
];
