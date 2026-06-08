import { relationships } from '@/lib/catalog';
import styles from './graph.module.css';

type NodeKind = 'artist' | 'album' | 'place' | 'era';

type NodePosition = { x: number; y: number; kind: NodeKind; label: string; size: number };

const nodePositions: Record<string, NodePosition> = {
  'artist-ana-tijoux': { x: 450, y: 320, kind: 'artist', label: 'Ana Tijoux', size: 44 },
  'artist-makiza': { x: 312, y: 228, kind: 'artist', label: 'Makiza', size: 34 },
  'artist-tiro-de-gracia': { x: 620, y: 210, kind: 'artist', label: 'Tiro de Gracia', size: 36 },
  'artist-portavoz': { x: 270, y: 430, kind: 'artist', label: 'Portavoz', size: 32 },
  'artist-la-pozze-latina': { x: 190, y: 185, kind: 'artist', label: 'La Pozze', size: 28 },
  'artist-panteras-negras': { x: 360, y: 120, kind: 'artist', label: 'Panteras', size: 25 },
  'artist-hordatoj': { x: 710, y: 340, kind: 'artist', label: 'Hordatoj', size: 25 },
  'artist-chystemc': { x: 780, y: 440, kind: 'artist', label: 'Chystemc', size: 25 },
  'artist-movimiento-original': { x: 650, y: 430, kind: 'artist', label: 'Movimiento', size: 30 },
  'artist-liricistas': { x: 785, y: 520, kind: 'artist', label: 'Liricistas', size: 25 },
  'artist-cevlade': { x: 390, y: 540, kind: 'artist', label: 'Cevladé', size: 24 },
  'artist-flor-de-rap': { x: 190, y: 535, kind: 'artist', label: 'Flor de Rap', size: 24 },
  'album-aerolineas-makiza': { x: 215, y: 145, kind: 'album', label: 'Aerolíneas', size: 22 },
  'album-ser-humano': { x: 740, y: 170, kind: 'album', label: 'Ser Hümano!!', size: 24 },
  'album-escribo-rap': { x: 410, y: 470, kind: 'album', label: 'Escribo Rap', size: 22 },
  'place-santiago': { x: 720, y: 290, kind: 'place', label: 'Santiago', size: 21 },
};

const visibleRelationships = relationships.filter((rel) => nodePositions[rel.source] && nodePositions[rel.target]);

export function GraphPreview() {
  return (
    <section className={styles.stage} id="red">
      <div className={styles.viewLabel}>
        <p className={styles.eyebrow}>Cartografía visual · rap chileno</p>
        <h1>El país<br />más rapero</h1>
        <p>Un grafo navegable donde cada artista, disco, ciudad y colaboración aparece conectado con evidencia y contexto histórico.</p>
      </div>
      <div className={styles.chileMap} aria-hidden="true" />
      <div className={`${styles.cityDot} ${styles.santiago}`} />
      <div className={`${styles.cityDot} ${styles.valpo}`} />
      <div className={`${styles.cityDot} ${styles.conce}`} />
      <svg className={styles.graph} viewBox="0 0 920 660" role="img" aria-label="Grafo conceptual de rap chileno">
        {visibleRelationships.map((relationship) => {
          const source = nodePositions[relationship.source];
          const target = nodePositions[relationship.target];
          return <line className={relationship.weight >= 4 ? styles.strongEdge : styles.edge} key={relationship.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />;
        })}
        <circle className={styles.halo} cx="450" cy="320" r="55" />
        {Object.entries(nodePositions).map(([id, node]) => (
          <g key={id}>
            <circle className={`${styles.node} ${styles[node.kind]}`} cx={node.x} cy={node.y} r={node.size} />
            <text className={styles.nodeText} x={node.x} y={node.y + 4}>{node.label}</text>
          </g>
        ))}
      </svg>
      <div className={styles.legend}>
        <Legend color="green" label="artista" />
        <Legend color="violet" label="disco" />
        <Legend color="cyan" label="lugar" />
        <Legend color="amber" label="era" />
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className={styles.legendItem}><i className={styles[color]} />{label}</span>;
}
