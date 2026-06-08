import type { ReactNode } from 'react';
import Link from 'next/link';

import { SiteHeader } from './SiteHeader';
import styles from './layout.module.css';

const bottomNavigation = [
  { label: 'HOME', href: '/', icon: '⌂' },
  { label: 'GRAPH', href: '/graph', icon: '✣' },
  { label: 'TIME', href: '/timeline', icon: '◷' },
  { label: 'ARTISTS', href: '/artists', icon: '♟' },
  { label: 'SOURCES', href: '/sources', icon: '▤' },
];

export function SiteShell({ children, variant = 'page' }: { children: ReactNode; variant?: 'page' | 'dashboard' }) {
  return (
    <div className={variant === 'dashboard' ? styles.dashboardShell : styles.pageShell}>
      <SiteHeader />
      {children}
      <nav className={styles.bottomNav} aria-label="Navegación principal móvil">
        {bottomNavigation.map((item) => (
          <Link href={item.href} key={item.href}>
            <span aria-hidden="true">{item.icon}</span>
            <strong>{item.label}</strong>
          </Link>
        ))}
      </nav>
    </div>
  );
}
