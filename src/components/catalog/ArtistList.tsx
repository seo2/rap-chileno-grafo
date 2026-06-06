import Link from 'next/link';

import type { Artist } from '@/lib/catalog';
import styles from './catalog.module.css';

export function ArtistList({ artists, limit }: { artists: Artist[]; limit?: number }) {
  const visibleArtists = typeof limit === 'number' ? artists.slice(0, limit) : artists;

  return (
    <div className={styles.artistList}>
      {visibleArtists.map((artist) => (
        <Link className={styles.artistRow} href={`/artists/${artist.slug}`} key={artist.id}>
          <strong>{artist.name}</strong>
          <span>{artist.era} · {artist.city}</span>
        </Link>
      ))}
    </div>
  );
}
