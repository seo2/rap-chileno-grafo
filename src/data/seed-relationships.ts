import type { Relationship } from './types';
import { seo2DiscographyRelationships } from './seo2-discography';

type RelationshipEvidence = Pick<Relationship, 'sourceIds' | 'sourceName' | 'sourceType' | 'sourceUrl' | 'confidence' | 'curationStatus' | 'notes'>;

const manualCandidate: RelationshipEvidence = {
  sourceIds: ['source-curaduria-inicial'],
  sourceName: 'Curaduría inicial',
  sourceType: 'manual' as const,
  confidence: 0.55,
  curationStatus: 'candidate' as const,
};

const backlogCandidate: RelationshipEvidence = {
  sourceIds: ['source-backlog-curatorial-rap-chileno'],
  sourceName: 'Backlog curatorial rap chileno',
  sourceType: 'manual' as const,
  confidence: 0.34,
  curationStatus: 'pending' as const,
  notes: 'Relación agregada para amplitud del grafo; requiere fuente específica antes de subir de estado.',
};

const pendingPlace: RelationshipEvidence = {
  sourceIds: ['source-curaduria-inicial'],
  sourceName: 'Curaduría inicial',
  sourceType: 'manual' as const,
  confidence: 0.35,
  curationStatus: 'pending' as const,
  notes: 'Relación territorial pendiente de fuente externa.',
};

const reviewedArchive = (sourceId: string, sourceName: string, sourceUrl: string, confidence = 0.7): RelationshipEvidence => ({
  sourceIds: [sourceId],
  sourceName,
  sourceType: 'archive' as const,
  sourceUrl,
  confidence,
  curationStatus: 'reviewed' as const,
});

function released(id: string, source: string, target: string, year: number, evidence: RelationshipEvidence, weight = 4): Relationship {
  return { ...evidence, id, source, target, relationshipType: 'released', weight, year };
}

function fromPlace(id: string, source: string, target: string, evidence: RelationshipEvidence, weight = 3): Relationship {
  return { ...evidence, id, source, target, relationshipType: 'from_place', weight };
}

function memberOf(id: string, source: string, target: string, evidence: RelationshipEvidence, weight = 4): Relationship {
  return { ...evidence, id, source, target, relationshipType: 'member_of', weight };
}

function collaborated(id: string, source: string, target: string, evidence: RelationshipEvidence, year?: number, weight = 2): Relationship {
  return { ...evidence, id, source, target, relationshipType: 'collaborated_with', weight, year };
}

const makizaEvidence = reviewedArchive('source-musica-popular-makiza', 'Música Popular: Makiza', 'https://www.musicapopular.cl/grupo/makiza/', 0.75);
const tiroEvidence = reviewedArchive('source-musica-popular-tiro-de-gracia', 'Música Popular: Tiro de Gracia', 'https://www.musicapopular.cl/grupo/tiro-de-gracia/', 0.74);
const laPozzeEvidence = reviewedArchive('source-musica-popular-la-pozze-latina', 'Música Popular: La Pozze Latina', 'https://www.musicapopular.cl/grupo/la-pozze-latina/', 0.72);
const panterasEvidence = reviewedArchive('source-musica-popular-panteras-negras', 'Música Popular: Panteras Negras', 'https://www.musicapopular.cl/grupo/panteras-negras/', 0.74);
const portavozEvidence = reviewedArchive('source-musica-popular-portavoz', 'Música Popular: Portavoz', 'https://www.musicapopular.cl/artista/portavoz/', 0.72);
const hordatojEvidence = reviewedArchive('source-musica-popular-hordatoj', 'Música Popular: Hordatoj', 'https://www.musicapopular.cl/artista/hordatoj/', 0.72);
const anaEvidence = reviewedArchive('source-musica-popular-ana-tijoux', 'Música Popular: Ana Tijoux', 'https://www.musicapopular.cl/artista/ana-tijoux/', 0.72);
const liricistasEvidence = reviewedArchive('source-musica-popular-liricistas', 'Música Popular: Liricistas', 'https://www.musicapopular.cl/grupo/liricistas/', 0.72);
const movimientoEvidence = reviewedArchive('source-musica-popular-movimiento-original', 'Música Popular: Movimiento Original', 'https://www.musicapopular.cl/grupo/movimiento-original/', 0.68);
const cevladeEvidence = reviewedArchive('source-musica-popular-cevlade', 'Música Popular: Cevladé', 'https://www.musicapopular.cl/artista/cevlade/', 0.68);
const jonasEvidence = reviewedArchive('source-musica-popular-jonas-sanche', 'Música Popular: Jonas Sanche', 'https://www.musicapopular.cl/artista/jonas-sanche/', 0.7);
const bronkoEvidence = reviewedArchive('source-musica-popular-bronko-yotte', 'Música Popular: Bronko Yotte', 'https://www.musicapopular.cl/artista/bronko-yotte/', 0.66);
const calambreEvidence = reviewedArchive('source-musica-popular-calambre', 'Música Popular: Calambre', 'https://www.musicapopular.cl/grupo/calambre/', 0.64);
const nemesisBriefEvidence: RelationshipEvidence = {
  sourceIds: ['source-spotify-web-api', 'source-seo2-direct-brief'],
  sourceName: 'Spotify Web API + brief directo Seo2',
  sourceType: 'api',
  sourceUrl: 'https://open.spotify.com/artist/2vrVolODkhwRDYNIa7trcU',
  confidence: 0.82,
  curationStatus: 'reviewed',
  notes: 'El brief directo identifica a Némesis como grupo conformado por Cenzi y Seo2; Spotify respalda los discos Justicia Divina e Hip Hop Héroes bajo Némesis.',
};

export const relationships: Relationship[] = [
  { ...manualCandidate, id: 'rel-ana-makiza', source: 'artist-ana-tijoux', target: 'artist-makiza', relationshipType: 'member_of', weight: 5 },
  { id: 'rel-seo2-makiza', source: 'artist-seo2', target: 'artist-makiza', relationshipType: 'member_of', weight: 5, sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.75, curationStatus: 'reviewed', promotedFromCandidateId: 'candidate-musica-popular-relationship-seo2-makiza', notes: 'Promoción editorial Sprint 11 aplicada desde candidate-musica-popular-relationship-seo2-makiza. Música Popular queda como evidencia revisada para el vínculo Seo2 ↔ Makiza.' },
  { id: 'rel-seo2-relativo-absoluto', source: 'artist-seo2', target: 'album-relativo-absoluto', relationshipType: 'released', weight: 4, year: 2009, sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.75, curationStatus: 'reviewed' },
  { id: 'rel-seo2-santiago', source: 'artist-seo2', target: 'place-santiago', relationshipType: 'from_place', weight: 3, sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.7, curationStatus: 'reviewed', notes: 'Música Popular registra residencia en Santiago.' },
  { id: 'rel-seo2-castro', source: 'artist-seo2', target: 'place-castro', relationshipType: 'from_place', weight: 3, sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.7, curationStatus: 'reviewed', notes: 'Música Popular registra residencia en Chiloé y primer grupo Castro Familia Crew.' },

  released('rel-makiza-vida-salvaje', 'artist-makiza', 'album-vida-salvaje', 1998, makizaEvidence, 5),
  released('rel-makiza-aerolineas', 'artist-makiza', 'album-aerolineas-makiza', 1999, { ...manualCandidate, sourceIds: ['source-curaduria-inicial', 'source-musica-popular-makiza'], sourceName: 'Curaduría inicial + Música Popular: Makiza', sourceUrl: 'https://www.musicapopular.cl/grupo/makiza/', confidence: 0.68 }, 5),
  released('rel-makiza-casino-royale', 'artist-makiza', 'album-casino-royale', 2005, makizaEvidence, 4),
  released('rel-tiro-ser-humano', 'artist-tiro-de-gracia', 'album-ser-humano', 1997, tiroEvidence, 5),
  released('rel-tiro-decision', 'artist-tiro-de-gracia', 'album-decision', 1999, tiroEvidence, 4),
  released('rel-tiro-retorno', 'artist-tiro-de-gracia', 'album-retorno-de-misericordia', 2001, tiroEvidence, 4),
  released('rel-tiro-patron', 'artist-tiro-de-gracia', 'album-patron-del-vicio', 2003, tiroEvidence, 4),
  released('rel-la-pozze-pozzeidos', 'artist-la-pozze-latina', 'album-pozzeidos-por-la-ilusion', 1993, laPozzeEvidence, 5),
  released('rel-la-pozze-nueva-religion', 'artist-la-pozze-latina', 'album-una-nueva-religion', 1996, laPozzeEvidence, 4),
  released('rel-la-pozze-espejos', 'artist-la-pozze-latina', 'album-desde-el-mundo-de-los-espejos', 1999, laPozzeEvidence, 4),
  released('rel-la-pozze-corazon', 'artist-la-pozze-latina', 'album-corazon-de-chileno', 1999, { ...manualCandidate, confidence: 0.35, curationStatus: 'pending', notes: 'Relación heredada del seed inicial; revisar si el registro corresponde a disco oficial.' }, 2),
  released('rel-panteras-reyes', 'artist-panteras-negras', 'album-reyes-de-la-jungla', 1993, panterasEvidence, 5),
  released('rel-panteras-atacando', 'artist-panteras-negras', 'album-atacando-calles', 1996, panterasEvidence, 4),
  released('rel-panteras-ruleta', 'artist-panteras-negras', 'album-la-ruleta', 1997, panterasEvidence, 4),
  released('rel-panteras-prodigios', 'artist-panteras-negras', 'album-prodigios', 2012, panterasEvidence, 3),
  released('rel-portavoz-escribo', 'artist-portavoz', 'album-escribo-rap', 2011, portavozEvidence, 5),
  released('rel-portavoz-millanao', 'artist-portavoz', 'album-millanao', 2019, portavozEvidence, 4),
  released('rel-hordatoj-entre-habitual', 'artist-hordatoj', 'album-entre-lo-habitual-y-lo-desconocido', 2007, hordatojEvidence, 4),
  released('rel-hordatoj-teorema', 'artist-hordatoj', 'album-teorema', 2007, { ...manualCandidate, confidence: 0.38, notes: 'Registro heredado del seed inicial; revisar contra discografía oficial.' }, 2),
  released('rel-ana-kaos', 'artist-ana-tijoux', 'album-kaos', 2007, anaEvidence, 4),
  released('rel-ana-1977', 'artist-ana-tijoux', 'album-1977', 2009, anaEvidence, 5),
  released('rel-ana-la-bala', 'artist-ana-tijoux', 'album-la-bala', 2011, anaEvidence, 4),
  released('rel-ana-vengo', 'artist-ana-tijoux', 'album-vengo', 2014, anaEvidence, 4),
  released('rel-liricistas-mas-abajo', 'artist-liricistas', 'album-mas-abajo', 2008, liricistasEvidence, 3),
  released('rel-liricistas-4-life', 'artist-liricistas', 'album-4-life', 2011, liricistasEvidence, 4),
  released('rel-liricistas-no-dejes', 'artist-liricistas', 'album-no-dejes-que-se-apague', 2014, liricistasEvidence, 4),
  released('rel-liricistas-bon-voyage', 'artist-liricistas', 'album-bon-voyage', 2016, liricistasEvidence, 4),
  released('rel-liricistas-hip-hope', 'artist-liricistas', 'album-hip-hope', 2021, liricistasEvidence, 3),
  released('rel-liricistas-deja-vu', 'artist-liricistas', 'album-deja-vu', 2024, liricistasEvidence, 3),
  released('rel-movimiento-soldados', 'artist-movimiento-original', 'album-soldados-del-guetto', 2008, movimientoEvidence, 4),
  released('rel-cevlade-escritor', 'artist-cevlade', 'album-el-escritor-maldito', 2006, cevladeEvidence, 4),
  released('rel-cevlade-astaire', 'artist-cevlade', 'album-la-casa-de-astaire', 2014, cevladeEvidence, 4),
  released('rel-jonas-verdades', 'artist-jonas-sanche', 'album-verdades-la-voz-de-la-avenida', 2012, jonasEvidence, 4),
  released('rel-salvaje-barrio-sin-luz', 'artist-salvaje-decibel', 'album-barrio-sin-luz', 2010, backlogCandidate, 2),
  released('rel-luanko-rap-de-la-tierra', 'artist-luanko', 'album-rap-de-la-tierra', 2018, backlogCandidate, 2),
  released('rel-gran-rah-medio-hermano', 'artist-gran-rah', 'album-medio-hermano', 2014, backlogCandidate, 2),
  released('rel-mente-sabia-movimiento-rap', 'artist-mente-sabia-cru', 'album-movimiento-rap', 2012, backlogCandidate, 2),

  fromPlace('rel-ana-santiago', 'artist-ana-tijoux', 'place-santiago', pendingPlace),
  fromPlace('rel-makiza-santiago', 'artist-makiza', 'place-santiago', makizaEvidence),
  fromPlace('rel-tiro-santiago', 'artist-tiro-de-gracia', 'place-santiago', tiroEvidence),
  fromPlace('rel-la-pozze-santiago', 'artist-la-pozze-latina', 'place-santiago', laPozzeEvidence),
  fromPlace('rel-pantera-renca', 'artist-panteras-negras', 'place-renca', panterasEvidence),
  fromPlace('rel-pantera-santiago', 'artist-panteras-negras', 'place-santiago', pendingPlace),
  fromPlace('rel-portavoz-recoleta', 'artist-portavoz', 'place-recoleta', portavozEvidence),
  fromPlace('rel-portavoz-conchali', 'artist-portavoz', 'place-conchali', portavozEvidence),
  fromPlace('rel-hordatoj-teno', 'artist-hordatoj', 'place-teno', hordatojEvidence),
  fromPlace('rel-hordatoj-san-joaquin', 'artist-hordatoj', 'place-san-joaquin', hordatojEvidence),
  fromPlace('rel-liricistas-maipu', 'artist-liricistas', 'place-maipu', liricistasEvidence),
  fromPlace('rel-movimiento-santiago', 'artist-movimiento-original', 'place-santiago', movimientoEvidence),
  fromPlace('rel-cevlade-santiago', 'artist-cevlade', 'place-santiago', cevladeEvidence),
  fromPlace('rel-jonas-antofagasta', 'artist-jonas-sanche', 'place-antofagasta', jonasEvidence),
  fromPlace('rel-jonas-la-florida', 'artist-jonas-sanche', 'place-la-florida', jonasEvidence),
  fromPlace('rel-bronko-santiago', 'artist-bronko-yotte', 'place-santiago', bronkoEvidence),
  fromPlace('rel-calambre-santiago', 'artist-calambre', 'place-santiago', calambreEvidence),
  fromPlace('rel-adickta-maipu', 'artist-adickta-sinfonia', 'place-maipu', backlogCandidate),
  fromPlace('rel-zaturno-santiago', 'artist-zaturno', 'place-santiago', backlogCandidate),
  fromPlace('rel-lenwa-santiago', 'artist-lenwa-dura', 'place-santiago', backlogCandidate),
  fromPlace('rel-juan-sativo-santiago', 'artist-juan-sativo', 'place-santiago', backlogCandidate),
  fromPlace('rel-cenzi-santiago', 'artist-cenzi', 'place-santiago', backlogCandidate),
  fromPlace('rel-nemesis-santiago', 'artist-nemesis', 'place-santiago', backlogCandidate),
  fromPlace('rel-la-serena-primer-mandamiento', 'artist-hordatoj', 'place-la-serena', { ...hordatojEvidence, confidence: 0.52, curationStatus: 'candidate', notes: 'Música Popular menciona un primer proyecto con integrantes en La Serena; revisar entidad antes de modelar relación definitiva.' }, 1),
  fromPlace('rel-drefquila-coquimbo', 'artist-drefquila', 'place-la-serena', { ...backlogCandidate, notes: 'Usar como marcador regional amplio hasta crear Coquimbo como lugar específico.' }, 1),

  memberOf('rel-cenzi-makiza', 'artist-cenzi', 'artist-makiza', makizaEvidence, 4),
  memberOf('rel-zaturno-tiro', 'artist-zaturno', 'artist-tiro-de-gracia', tiroEvidence, 4),
  memberOf('rel-lenwa-tiro', 'artist-lenwa-dura', 'artist-tiro-de-gracia', tiroEvidence, 4),
  memberOf('rel-juan-sativo-tiro', 'artist-juan-sativo', 'artist-tiro-de-gracia', tiroEvidence, 4),
  memberOf('rel-dj-raff-la-pozze', 'artist-dj-raff', 'artist-la-pozze-latina', laPozzeEvidence, 3),
  memberOf('rel-solo-di-medina-la-pozze', 'artist-solo-di-medina', 'artist-la-pozze-latina', laPozzeEvidence, 3),
  memberOf('rel-portavoz-salvaje-decibel', 'artist-portavoz', 'artist-salvaje-decibel', portavozEvidence, 4),
  memberOf('rel-aerstame-movimiento', 'artist-aerstame', 'artist-movimiento-original', movimientoEvidence, 4),
  memberOf('rel-stailok-movimiento', 'artist-stailok', 'artist-movimiento-original', movimientoEvidence, 4),
  memberOf('rel-seo2-nemesis', 'artist-seo2', 'artist-nemesis', {
    sourceIds: ['source-musica-popular-seo2', 'source-spotify-web-api', 'source-seo2-direct-brief'],
    sourceName: 'Música Popular: Seo2 + Spotify Web API + brief directo Seo2',
    sourceType: 'archive',
    sourceUrl: 'https://www.musicapopular.cl/artista/seo2/',
    confidence: 0.82,
    curationStatus: 'reviewed',
    notes: 'Música Popular registra a Seo2 como ex integrante de Némesis; Spotify y el brief directo respaldan Justicia Divina e Hip Hop Héroes como parte de la discografía asociada. El brief directo identifica al grupo como conformado por Cenzi y Seo2.',
  }, 5),
  memberOf('rel-cenzi-nemesis', 'artist-cenzi', 'artist-nemesis', nemesisBriefEvidence, 5),

  collaborated('rel-hordatoj-ana', 'artist-hordatoj', 'artist-ana-tijoux', hordatojEvidence, 2007, 3),
  collaborated('rel-hordatoj-jonas', 'artist-hordatoj', 'artist-jonas-sanche', hordatojEvidence, undefined, 3),
  collaborated('rel-hordatoj-portavoz', 'artist-hordatoj', 'artist-portavoz', hordatojEvidence, undefined, 3),
  collaborated('rel-ana-solo-di-medina', 'artist-ana-tijoux', 'artist-solo-di-medina', anaEvidence, 2007, 2),
  collaborated('rel-ana-stailok', 'artist-ana-tijoux', 'artist-stailok', anaEvidence, 2009, 2),
  collaborated('rel-ana-bubaseta', 'artist-ana-tijoux', 'artist-bubaseta', anaEvidence, 2009, 2),
  collaborated('rel-ana-caf', 'artist-ana-tijoux', 'artist-como-asesinar-a-felipes', anaEvidence, 2009, 2),
  collaborated('rel-portavoz-ana', 'artist-portavoz', 'artist-ana-tijoux', portavozEvidence, undefined, 2),
  collaborated('rel-portavoz-panteras', 'artist-portavoz', 'artist-panteras-negras', portavozEvidence, undefined, 2),
  collaborated('rel-portavoz-luanko', 'artist-portavoz', 'artist-luanko', portavozEvidence, undefined, 2),
  collaborated('rel-portavoz-subverso', 'artist-portavoz', 'artist-subverso', portavozEvidence, undefined, 2),
  collaborated('rel-movimiento-liricistas', 'artist-movimiento-original', 'artist-liricistas', movimientoEvidence, 2016, 2),
  collaborated('rel-movimiento-hordatoj', 'artist-movimiento-original', 'artist-hordatoj', movimientoEvidence, 2016, 2),
  collaborated('rel-movimiento-portavoz', 'artist-movimiento-original', 'artist-portavoz', movimientoEvidence, 2016, 2),
  collaborated('rel-hordatoj-chystemc', 'artist-hordatoj', 'artist-chystemc', { ...manualCandidate, confidence: 0.3, notes: 'Candidato grafo; requiere evidencia de colaboración concreta.' }),
  collaborated('rel-cevlade-flor', 'artist-cevlade', 'artist-flor-de-rap', { ...manualCandidate, confidence: 0.3, notes: 'Candidato grafo; requiere evidencia de colaboración concreta.' }),
  collaborated('rel-liricistas-bascur', 'artist-liricistas', 'artist-bascur', liricistasEvidence, 2011, 2),
  collaborated('rel-liricistas-mc-unabez', 'artist-liricistas', 'artist-mc-unabez', liricistasEvidence, 2011, 2),
  collaborated('rel-liricistas-adickta', 'artist-liricistas', 'artist-adickta-sinfonia', liricistasEvidence, 2011, 2),
  collaborated('rel-bronko-gepe-placeholder', 'artist-bronko-yotte', 'artist-como-asesinar-a-felipes', { ...bronkoEvidence, confidence: 0.42, curationStatus: 'candidate', notes: 'Relación de borde para marcar cruces autorales; revisar artistas exactos antes de publicar.' }, undefined, 1),
  ...seo2DiscographyRelationships,
];
