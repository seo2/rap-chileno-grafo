import type { Artist } from './types';

const defaultEvidence = {
  sourceIds: ['source-curaduria-inicial'],
  sourceName: 'Curaduría inicial',
  sourceType: 'manual' as const,
  confidence: 0.55,
  curationStatus: 'candidate' as const,
};

export const artists: Artist[] = [
  { ...defaultEvidence, id: 'artist-ana-tijoux', slug: 'ana-tijoux', name: 'Ana Tijoux', city: 'Santiago', region: 'Metropolitana', era: '90s', summary: 'MC y compositora, figura clave desde Makiza hacia una carrera solista internacional.', tags: ['rap político', 'makiza', 'internacional'], notes: 'Ficha semilla; requiere separar trayectoria solista y Makiza con fuentes específicas.' },
  { ...defaultEvidence, id: 'artist-makiza', slug: 'makiza', name: 'Makiza', city: 'Santiago', region: 'Metropolitana', era: '90s', summary: 'Grupo fundamental del rap chileno de fines de los 90.', tags: ['grupo', 'vieja escuela'] },
  { id: 'artist-seo2', slug: 'seo2', name: 'Seo2', city: 'Santiago / Castro', region: 'Metropolitana / Los Lagos', era: '90s', summary: 'MC chileno, también conocido como Cristián Bórquez, ex integrante de Makiza y Némesis, con trayectoria solista y colaborativa desde los años noventa.', tags: ['mc', 'makiza', 'némesis', 'chiloé', 'colaboraciones'], sourceIds: ['source-musica-popular-seo2'], sourceName: 'Música Popular: Seo2', sourceType: 'archive', sourceUrl: 'https://www.musicapopular.cl/artista/seo2/', confidence: 0.75, curationStatus: 'reviewed', notes: 'Música Popular registra nacimiento en Chile, formación hip-hop en Ginebra y residencias posteriores en Chiloé y Santiago; mantener doble territorio hasta mayor precisión editorial.' },
  { ...defaultEvidence, id: 'artist-tiro-de-gracia', slug: 'tiro-de-gracia', name: 'Tiro de Gracia', city: 'Santiago', region: 'Metropolitana', era: '90s', summary: 'Grupo masivo y fundacional para la entrada del rap chileno al mainstream.', tags: ['grupo', 'clásico'] },
  { ...defaultEvidence, id: 'artist-la-pozze-latina', slug: 'la-pozze-latina', name: 'La Pozze Latina', city: 'Santiago', region: 'Metropolitana', era: '90s', summary: 'Pioneros en llevar rap chileno a radios y televisión en los años 90.', tags: ['pioneros', 'vieja escuela'] },
  { ...defaultEvidence, id: 'artist-panteras-negras', slug: 'panteras-negras', name: 'Panteras Negras', city: 'Santiago', region: 'Metropolitana', era: '80s', summary: 'Agrupación temprana asociada a la raíz social y poblacional del rap chileno.', tags: ['pioneros', 'población'] },
  { ...defaultEvidence, id: 'artist-portavoz', slug: 'portavoz', name: 'Portavoz', city: 'Santiago', region: 'Metropolitana', era: '2000s', summary: 'MC asociado al rap social y político chileno.', tags: ['rap social', 'salvaje decibel'] },
  { ...defaultEvidence, id: 'artist-hordatoj', slug: 'hordatoj', name: 'Hordatoj', city: 'Santiago', region: 'Metropolitana', era: '2000s', summary: 'MC y productor con obra relevante para el rap independiente chileno.', tags: ['independiente', 'productor'] },
  { ...defaultEvidence, id: 'artist-chystemc', slug: 'chystemc', name: 'Chystemc', city: 'Santiago', region: 'Metropolitana', era: '2000s', summary: 'Referente lírico del rap chileno de circuito independiente.', tags: ['lírica', 'underground'] },
  { ...defaultEvidence, id: 'artist-movimiento-original', slug: 'movimiento-original', name: 'Movimiento Original', city: 'Santiago', region: 'Metropolitana', era: '2010s', summary: 'Grupo que cruza rap, reggae y canción urbana desde una base hip-hop.', tags: ['grupo', 'reggae rap'], confidence: 0.45, notes: 'Cruce reggae/rap: mantener bandera editorial para filtros futuros.' },
  { ...defaultEvidence, id: 'artist-liricistas', slug: 'liricistas', name: 'Liricistas', city: 'Santiago', region: 'Metropolitana', era: '2010s', summary: 'Grupo importante para nuevas generaciones de rap chileno.', tags: ['grupo', 'nueva escuela'] },
  { ...defaultEvidence, id: 'artist-cevlade', slug: 'cevlade', name: 'Cevladé', city: 'Santiago', region: 'Metropolitana', era: '2010s', summary: 'MC conocido por escritura introspectiva y estética autoral.', tags: ['autor', 'introspectivo'] },
  { ...defaultEvidence, id: 'artist-flor-de-rap', slug: 'flor-de-rap', name: 'Flor de Rap', city: 'Santiago', region: 'Metropolitana', era: '2010s', summary: 'MC chilena con fuerte presencia popular y lírica directa.', tags: ['mc femenina', 'popular'] },
  { ...defaultEvidence, id: 'artist-pablo-chill-e', slug: 'pablo-chill-e', name: 'Pablo Chill-E', city: 'Santiago', region: 'Metropolitana', era: '2020s', summary: 'Artista de raíz rap que cruza hacia trap/urbano; queda marcado para futuras capas.', tags: ['cruce urbano', 'trap'], urbanCrossover: true, confidence: 0.4, curationStatus: 'pending', notes: 'Incluido como cruce urbano futuro, no visible por defecto en solo rap.' }
];