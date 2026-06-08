import Link from 'next/link';

import { SiteShell } from '@/components/layout/SiteShell';

const heroImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmlnPREesixDY8w07PQzZVw6VHRgyanngYujG-5vBYVs_tnQg_rGafy7bQ8ljKm3OnA-NKk6HFAAjkPDYFrGiTZ7Xg3G65TR4RHF4iqRELB_qLNKNUhIScM7k3lkSv-MckSW_IJ0F5-7nbIACImC8QEgDc-lFTdfua2oRgtL_hd64IwWZvEl63gB_PnJ8JhULauRjtfL18bj1KMb9Ps83WfeqhhrSqlLg4ZIEVDCihsN0z-cvq780DSHGa4cZiyWwRKLiSMINmpJs';

const archiveNav = [
  { label: 'Grafo', href: '/graph', index: '01' },
  { label: 'Directorio', href: '/artists', index: '02' },
  { label: 'Mapa', href: '/map', index: '03' },
  { label: 'Timeline', href: '/timeline', index: '04' },
  { label: 'Fuentes', href: '/sources', index: '05' },
];

const latestAdditions = [
  {
    title: 'Makiza',
    detail: 'Aerolíneas Makiza (1999)',
    status: 'Verificado',
    id: 'ARCH-772',
    href: '/artists/makiza',
    verified: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnS56MwERBWb37W1QhbrQ-VduU-GRMkY0NbnTFoD_-WuJKWttJHjxjCyy3J9fBuF4SZMqtSSnf9EoOA5Q_DWuw4h_uIu3pexbmmgBT1k_OBJtl2hepiceE9oZThNZ9lxyC2H2RkdXNlGJH3YJJlNAuqZlrGnJpSzDOH7yCjlKeRDJhQgtFCwl8RZ9Aesz2KHyBkVLY7U5j4PrITZvqkzI_lsgi6NPQD0qSoGSOV9EN1MEBhlBAEXHYu8VGq_et_SEmHNXTsAKqQEY',
  },
  {
    title: 'Tiro de Gracia',
    detail: 'Ser hümano!! (1997)',
    status: 'Archivo',
    id: 'ARCH-401',
    href: '/artists/tiro-de-gracia',
    verified: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDce648e8ygeiotb8eCZ0OF_aKA85ylqonFVwe-gUlYg-oojdMPBwR-4HfzH8IUNZCrnkVQUG2qI-7XFhyLTCzDtflY4L1x3E9kEEeXHLiCsTld5fe_rJF6hDawacKUp5_9kvIPS4jSkRoKdsqC5XTIu8xdYgAWuFhtlhbzk5aqn49-g2OP7Tz_f0BbbaH5fIqCFxFFbYGPXYn-y6h-lwa-DSmuVHPtMplhy3EQQrkN0ly8sXp5YxP9pKzvbKS9HHRcrg532hZLI_s',
  },
  {
    title: 'Panteras Negras',
    detail: 'Reyes de la Selva (1994)',
    status: 'Verificado',
    id: 'ARCH-118',
    href: '/artists/panteras-negras',
    verified: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6A3jGMRAjgQSLTDM30e1gVTxN5fLUsem3_io2WYfURSrnD8pQzN-XTas0ivBW8yePIfH25EzMfgSAgs0-07VB_wNx4XO9gyeyNH07mSBVWIZeKox9jsPd9RF6NHQhit2_F3IJqjIeItnZx83xq-jDk4rxf130n5lWVlzhg8eNoF1_Nw-BzTpZggv9RPONes_yzNafQr3M_meRWCt1ZFoh3W8VQ9ISYzrMcJjzc83tiF8Yxh9OfQSA0Zs3XsxVn6ifBpd3J3IN_f8',
  },
  {
    title: 'Portavoz',
    detail: 'Escribo Rap con R de Revolución',
    status: 'Candidato',
    id: 'ARCH-892',
    href: '/artists/portavoz',
    verified: false,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzeRINup5usACf0_pTH4BRD6VZA3xLSrrGk7AacuDW0_qJgAEdowArwavMGpZThsHBM0KP8_2kog3JmE1wOGHQQWPhg__5sgTRG5qrgHUvE7RYnmnS85nbadayWyLJZRKCu8ztA6AvV12UQrlVcIYwVv3EXXUvqd6nYvOw-BH9H8N5yQHPdzagl-wtkpRHiJW7MFcTEwt11CewzDrMiVSWU1PiLkDcQs4geOdV93rrns0AjT9WJW-B7euQCakSyIjLy4fXZ31S2ac',
  },
];

const methodTags = ['Maipú', 'La Florida', 'Puente Alto', 'Quilicura'];

export default function Home() {
  return (
    <SiteShell>
      <main className="homePage">
        <section className="homeHero">
          <div className="homeHeroImage">
            <div className="homeHeroMedia" style={{ backgroundImage: `url(${heroImageUrl})` }} aria-hidden="true" />
            <div className="homeHeroOverlay" aria-hidden="true" />
            <div className="homeHeroTitle">
              <h1>La cartografía<br />viva del rap<br />chileno.</h1>
            </div>
          </div>

          <div className="homeHeroNav">
            <p className="homeKicker">— El archivo central</p>
            <nav className="homeArchiveNav" aria-label="Áreas principales del archivo">
              {archiveNav.map((item) => (
                <Link className="homeArchiveLink" href={item.href} key={item.href}>
                  <span>{item.label}</span>
                  <strong>{item.index}</strong>
                </Link>
              ))}
            </nav>
            <p className="homeIntro">
              Un registro exhaustivo de la lírica, el ritmo y el territorio. Investigando las raíces del hip-hop nacional desde 1980 hasta el presente.
            </p>
          </div>
        </section>

        <section className="latestSection">
          <div className="homeSectionHeader">
            <h2>Últimas adiciones</h2>
            <Link href="/artists">Ver todo el archivo</Link>
          </div>
          <div className="archiveGrid">
            {latestAdditions.map((item) => (
              <Link className="archiveCard" href={item.href} key={item.id}>
                <div className="archiveImage" style={{ backgroundImage: `url(${item.imageUrl})` }} aria-hidden="true" />
                <span className={item.verified ? 'archiveBadge archiveBadgeVerified' : 'archiveBadge'}>
                  {item.verified ? <i aria-hidden="true" /> : null}
                  {item.status}
                </span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <div className="archiveCardMeta">
                  <span>ID: {item.id}</span>
                  <strong aria-hidden="true">→</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="methodSection">
          <div className="methodCopy">
            <h2>El Método.</h2>
            <p>No somos un blog. Somos un repositorio cartográfico que utiliza el análisis de grafos para conectar líricas, productores y territorios.</p>
            <p>Cada entrada en el Directorio es sometida a un proceso de verificación documental antes de ser indexada permanentemente.</p>
            <Link className="homeButton" href="/about">Sobre el proyecto</Link>
          </div>
          <div className="methodGraph">
            <div className="fakeGraph" aria-hidden="true">
              <span className="fakeNode fakeNodeMain" />
              <span className="fakeNode fakeNodeA" />
              <span className="fakeNode fakeNodeB" />
              <span className="fakeNode fakeNodeC" />
              <i className="fakeEdge fakeEdgeA" />
              <i className="fakeEdge fakeEdgeB" />
              <i className="fakeEdge fakeEdgeC" />
            </div>
            <div className="methodGraphContent">
              <span className="methodGraphIcon">✣</span>
              <h3>Visualización de Relaciones</h3>
              <p>Navega a través de las conexiones entre artistas y barrios de Santiago.</p>
              <div className="methodTags">
                {methodTags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
            <span className="systemStamp">Sistema v2.0.4</span>
          </div>
        </section>
      </main>

      <footer className="homeFooter">
        <div className="homeFooterGrid">
          <div className="homeFooterBrand">
            <h2>El País Más Rapero</h2>
            <p>Iniciativa de investigación independiente dedicada a la preservación de la memoria histórica del rap en Chile. Santiago, 2024.</p>
          </div>
          <div>
            <h3>Navegación</h3>
            <ul>
              <li><Link href="/artists">Directorio de MCs</Link></li>
              <li><Link href="/graph">Productores & Beats</Link></li>
              <li><Link href="/map">Mapa Territorial</Link></li>
              <li><Link href="/sources">Archivo de Revistas</Link></li>
            </ul>
          </div>
          <div>
            <h3>Contacto</h3>
            <ul>
              <li><a href="https://www.instagram.com/" rel="noreferrer" target="_blank">Instagram</a></li>
              <li><a href="https://x.com/" rel="noreferrer" target="_blank">Twitter (X)</a></li>
              <li><a href="mailto:archivo@elpaismasrapero.cl">Email</a></li>
              <li><Link href="/sources">Prensa</Link></li>
            </ul>
          </div>
        </div>
        <div className="homeFooterBottom">
          <p>© 2024 El País Más Rapero. Todos los derechos reservados.</p>
          <div>
            <Link href="/about">Privacidad</Link>
            <Link href="/about">Términos</Link>
          </div>
        </div>
      </footer>
    </SiteShell>
  );
}
