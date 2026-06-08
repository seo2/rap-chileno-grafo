import Link from 'next/link';

import styles from './layout.module.css';

const desktopNavigation = [
  { label: 'HOME', href: '/' },
  { label: 'GRAPH', href: '/graph' },
  { label: 'TIMELINE', href: '/timeline' },
  { label: 'ARTISTS', href: '/artists' },
  { label: 'SOURCES', href: '/sources' },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Ir al inicio de El País Más Rapero">
        <span className={styles.menuMark} aria-hidden="true">☰</span>
        <div>
          <strong>El País Más Rapero</strong>
          <span>Cartografía visual del rap chileno</span>
        </div>
      </Link>
      <nav className={styles.nav} aria-label="Vistas principales">
        {desktopNavigation.map((item) => (
          <Link href={item.href} key={item.href}>{item.label}</Link>
        ))}
      </nav>
      <Link className={styles.search} href="/search" aria-label="Buscar en el archivo editorial">
        <strong>⌕</strong>
      </Link>
    </header>
  );
}
