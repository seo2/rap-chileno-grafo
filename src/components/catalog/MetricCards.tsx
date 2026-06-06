import { getGraphStats } from '@/lib/catalog';
import styles from './catalog.module.css';

export function MetricCards() {
  const stats = getGraphStats();
  const cards = [
    { value: stats.artists, label: 'artistas rap' },
    { value: stats.relationships, label: 'relaciones' },
    { value: stats.albums, label: 'discos' },
    { value: stats.places, label: 'ciudades' },
  ];

  return (
    <div className={styles.metricGrid}>
      {cards.map((card) => (
        <div className={styles.metric} key={card.label}>
          <strong>{card.value}</strong>
          <span>{card.label}</span>
        </div>
      ))}
    </div>
  );
}
