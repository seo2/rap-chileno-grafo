import { SiteShell } from '@/components/layout/SiteShell';
import { albums, getAlbumArtist } from '@/lib/catalog';

export default function TimelinePage() {
  const events = [...albums].sort((a, b) => a.year - b.year);

  return (
    <SiteShell>
      <main className="pageGrid">
        <section className="heroCard">
          <p className="eyebrow">Historia por eras</p>
          <h1>Timeline</h1>
          <p>Base inicial para ordenar discos e hitos por década. Cada evento queda preparado para conectar citas, fuentes y estados de revisión.</p>
        </section>
        <section className="contentCard timeline">
          {events.map((event) => {
            const artist = getAlbumArtist(event);
            return (
              <article className="timelineItem" key={event.id}>
                <time>{event.year}</time>
                <div>
                  <strong>{event.title}</strong>
                  <span>{artist?.name ?? 'Artista pendiente'} · {event.type} · {event.curationStatus}</span>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </SiteShell>
  );
}
