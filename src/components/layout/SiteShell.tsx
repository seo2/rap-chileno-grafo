import type { ReactNode } from 'react';

import { SiteHeader } from './SiteHeader';
import styles from './layout.module.css';

export function SiteShell({ children, variant = 'page' }: { children: ReactNode; variant?: 'page' | 'dashboard' }) {
  return (
    <div className={variant === 'dashboard' ? styles.dashboardShell : styles.pageShell}>
      <SiteHeader />
      {children}
    </div>
  );
}
