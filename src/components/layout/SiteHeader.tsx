import Link from 'next/link';

import { getPrimaryNavigation } from '@/lib/catalog';
import styles from './layout.module.css';

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Ir al inicio de El País Más Rapero">
        <div className={styles.mark}>PMR</div>
        <div>
          <strong>El País Más Rapero</strong>
          <span>archivo vivo · red · mapa · timeline</span>
        </div>
      </Link>
      <nav className={styles.nav} aria-label="Vistas principales">
        {getPrimaryNavigation().slice(1).map((item) => (
          <Link href={item.href} key={item.href}>{item.label}</Link>
        ))}
      </nav>
      <div className={styles.search}>⌘K buscar artista, disco, ciudad...</div>
    </header>
  );
}
