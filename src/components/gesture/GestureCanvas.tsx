import styles from './GestureCanvas.module.css'

interface GestureCanvasProps {
  handDescription: string
}

/** Bonus feature stub — wand gesture animation will be implemented later. */
export function GestureCanvas({ handDescription }: GestureCanvasProps) {
  return (
    <div className={styles.overlay} role="img" aria-label="Geste du sort">
      <canvas className={styles.canvas} width={320} height={180} />
      <p className={styles.caption}>{handDescription}</p>
      <p className={styles.placeholder}>
        Animation du geste — à implémenter (bonus)
      </p>
    </div>
  )
}
