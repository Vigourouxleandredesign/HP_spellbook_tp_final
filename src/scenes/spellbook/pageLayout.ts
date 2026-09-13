/** Calage sur Plane001 (double-page XZ, ~3.22 × 1.80). */
export const pageLayout = {
  textureWidth: 1280,
  textureHeight: 1600,
  planeWidth: 1.42,
  planeHeight: 1.52,
  liftY: 0.088,
  leftX: -0.82,
  rightX: 0.82,
  z: 0,
} as const

/** Sceau « découvrir le geste » en pixels canvas (page droite). */
export const gestureSeal = {
  x: 100,
  y: 1372,
  width: 1080,
  height: 148,
} as const

export function gestureSealLocal(): {
  x: number
  y: number
  width: number
  height: number
} {
  return {
    x:
      ((gestureSeal.x + gestureSeal.width / 2) / pageLayout.textureWidth - 0.5) *
      pageLayout.planeWidth,
    y:
      (0.5 -
        (gestureSeal.y + gestureSeal.height / 2) / pageLayout.textureHeight) *
      pageLayout.planeHeight,
    width: (gestureSeal.width / pageLayout.textureWidth) * pageLayout.planeWidth,
    height:
      (gestureSeal.height / pageLayout.textureHeight) * pageLayout.planeHeight,
  }
}
