import type { GestureKind } from '@/types/gesture'
import { colors } from '@/styles/tokens/colors'

export const WAND_CAST_SIZE = { width: 1280, height: 720 } as const
export const WAND_CAST_DURATION = 2.15

interface Point {
  x: number
  y: number
}

interface Sparkle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  kind: 'dot' | 'star'
  spin: number
}

export interface WandCastState {
  sparkles: Sparkle[]
  spawnCarry: number
}

function seedFrom(text: string): number {
  return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

export function resolveGestureKind(
  description: string,
  kind?: GestureKind | null,
): GestureKind {
  if (kind) return kind
  const text = description.toLowerCase()
  if (/(swish and flick|swish)/.test(text)) return 'swishFlick'
  if (/(wrist|poignet)/.test(text)) return 'wristCircle'
  if (/(circle|circular|loop|around)/.test(text)) return 'circle'
  if (/(spiral|coil)/.test(text)) return 'spiral'
  if (/(wave|ondul)/.test(text)) return 'wave'
  if (/(flick|whip|fouett)/.test(text)) return 'flick'
  if (/(slash|entaille|swipe|sweep)/.test(text)) return 'slash'
  if (/(point|direct|jab|aim|piqué|pointer)/.test(text)) return 'point'
  if (/(tap|tapot)/.test(text)) return 'tap'
  return 'arc'
}

function bezier(start: Point, mid: Point, end: Point, p: number): Point {
  const inv = 1 - p
  return {
    x: inv * inv * start.x + 2 * inv * p * mid.x + p * p * end.x,
    y: inv * inv * start.y + 2 * inv * p * mid.y + p * p * end.y,
  }
}

function samplePath(
  description: string,
  t: number,
  kindHint?: GestureKind | null,
): Point {
  const { width, height } = WAND_CAST_SIZE
  const seed = seedFrom(description)
  const kind = resolveGestureKind(description, kindHint)
  const sway = ((seed % 17) - 8) / 90
  const lift = ((seed % 11) - 5) / 80
  const p = clamp01(t)

  if (kind === 'swishFlick') {
    const cx = width * 0.5
    const cy = height * 0.46
    const radius = height * 0.22
    const stemBottom = cy + radius * 1.55
    const loopStart = Math.PI
    const loopSweep = Math.PI * 1.5

    if (p < 0.7) {
      const angle = loopStart - (p / 0.7) * loopSweep
      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      }
    }

    const local = (p - 0.7) / 0.3
    return { x: cx, y: lerp(cy - radius, stemBottom, local ** 0.92) }
  }

  if (kind === 'pullToward') {
    return {
      x: lerp(width * 0.88, width * 0.18, p),
      y: lerp(height * 0.42, height * 0.58, p) + Math.sin(p * Math.PI) * height * 0.06,
    }
  }

  if (kind === 'pushAway') {
    return {
      x: lerp(width * 0.2, width * 0.9, p ** 0.75),
      y: lerp(height * 0.56, height * 0.38, p),
    }
  }

  if (kind === 'jab') {
    return {
      x: lerp(width * 0.16, width * 0.84, p ** 1.15),
      y: lerp(height * 0.62, height * 0.34, p),
    }
  }

  if (kind === 'downwardSlash') {
    return {
      x: lerp(width * 0.22, width * 0.78, p),
      y: lerp(height * 0.16, height * 0.82, p ** 0.9),
    }
  }

  if (kind === 'spiral') {
    const turns = 2.15
    const radius = lerp(width * 0.34, width * 0.08, p)
    const angle = -Math.PI * 0.5 + p * Math.PI * 2 * turns
    return {
      x: width * 0.5 + Math.cos(angle) * radius,
      y: height * (0.62 - p * 0.28) + Math.sin(angle) * radius * 0.55,
    }
  }

  if (kind === 'shield') {
    return {
      x: lerp(width * 0.18, width * 0.82, p),
      y: lerp(height * 0.78, height * 0.22, Math.sin(p * Math.PI * 0.5)),
    }
  }

  if (kind === 'upwardLift') {
    return {
      x: width * (0.5 + sway * 0.2),
      y: lerp(height * 0.82, height * 0.16, p ** 0.85),
    }
  }

  if (kind === 'downwardSmash') {
    return {
      x: width * (0.5 + sway * 0.15),
      y: lerp(height * 0.14, height * 0.84, p ** 1.2),
    }
  }

  if (kind === 'circleReveal') {
    const angle = -Math.PI * 0.5 + p * Math.PI * 2
    return {
      x: width * 0.5 + Math.cos(angle) * width * 0.28,
      y: height * 0.5 + Math.sin(angle) * height * 0.3,
    }
  }

  if (kind === 'freeze') {
    const angle = Math.PI * 0.15 + p * Math.PI * 1.7
    const radius = lerp(width * 0.08, width * 0.3, p)
    return {
      x: width * 0.5 + Math.cos(angle) * radius,
      y: lerp(height * 0.22, height * 0.78, p) + Math.sin(angle) * height * 0.08,
    }
  }

  if (kind === 'burst') {
    return bezier(
      { x: width * 0.14, y: height * 0.58 },
      { x: width * 0.48, y: height * 0.22 },
      { x: width * 0.9, y: height * 0.4 },
      p,
    )
  }

  if (kind === 'waveHorizontal') {
    return {
      x: lerp(width * 0.1, width * 0.9, p),
      y: height * (0.48 + lift) + Math.sin(p * Math.PI) * height * 0.05,
    }
  }

  if (kind === 'tap') {
    const x = width * 0.52
    const y = height * 0.42
    const bob = Math.sin(p * Math.PI * 3) * height * 0.08
    return { x: x + sway * width * 0.04, y: y + Math.abs(bob) }
  }

  if (kind === 'wristCircle') {
    const cx = width * 0.52
    const cy = height * 0.46
    const radius = width * 0.16
    const angle = -Math.PI * 0.35 + p * Math.PI * 2
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius * 0.82,
    }
  }

  if (kind === 'mend') {
    const angle = p * Math.PI * 4
    return {
      x: width * 0.5 + Math.cos(angle) * width * 0.12,
      y: height * 0.48 + Math.sin(angle) * height * 0.1,
    }
  }

  if (kind === 'twist') {
    const angle = p * Math.PI * 3.2
    return {
      x: lerp(width * 0.22, width * 0.72, p) + Math.cos(angle) * width * 0.07,
      y: lerp(height * 0.36, height * 0.58, p) + Math.sin(angle) * height * 0.12,
    }
  }

  if (kind === 'wash') {
    return {
      x: width * (0.5 + Math.sin(p * Math.PI) * 0.08),
      y: lerp(height * 0.12, height * 0.86, p),
    }
  }

  if (kind === 'circle') {
    const cx = width * (0.5 + sway * 0.4)
    const cy = height * (0.5 + lift)
    const angle = -Math.PI * 0.25 + p * Math.PI * 1.75
    return {
      x: cx + Math.cos(angle) * width * 0.3,
      y: cy + Math.sin(angle) * height * 0.28,
    }
  }

  if (kind === 'wave') {
    return {
      x: lerp(width * 0.1, width * 0.9, p),
      y: height * (0.56 + lift) + Math.sin(p * Math.PI * 2.15) * height * 0.22,
    }
  }

  if (kind === 'flick') {
    const start = { x: width * 0.18, y: height * 0.74 }
    const mid = { x: width * (0.5 + sway), y: height * 0.18 }
    const end = { x: width * 0.84, y: height * 0.36 }
    if (p < 0.7) return bezier(start, mid, end, p / 0.7)
    return {
      x: lerp(end.x, end.x + width * 0.03, (p - 0.7) / 0.3),
      y: lerp(end.y, end.y + height * 0.16, (p - 0.7) / 0.3),
    }
  }

  if (kind === 'point') {
    return {
      x: lerp(width * 0.14, width * 0.86, p),
      y: lerp(height * (0.72 + lift), height * (0.3 + sway), p ** 0.85),
    }
  }

  if (kind === 'slash') {
    return {
      x: lerp(width * 0.08, width * 0.92, p),
      y: lerp(height * 0.22, height * 0.7, p),
    }
  }

  return bezier(
    { x: width * 0.12, y: height * 0.78 },
    { x: width * (0.48 + sway), y: height * (0.16 + lift) },
    { x: width * 0.88, y: height * 0.38 },
    p,
  )
}

export function createWandCastState(): WandCastState {
  return { sparkles: [], spawnCarry: 0 }
}

function spawnSparkle(at: Point, state: WandCastState, burst = false): void {
  const palette = [
    colors.glow,
    colors.parchment,
    colors.accentHover,
    colors.accent,
    colors.spellLight.yellow,
  ]
  const count = burst ? 5 : 1
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2
    const speed = 12 + Math.random() * (burst ? 110 : 55)
    state.sparkles.push({
      x: at.x + (Math.random() - 0.5) * 10,
      y: at.y + (Math.random() - 0.5) * 10,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 10,
      life: 0,
      maxLife: 0.55 + Math.random() * 0.75,
      size: 2.2 + Math.random() * 5.5,
      color: palette[Math.floor(Math.random() * palette.length)] ?? colors.glow,
      kind: Math.random() > 0.28 ? 'star' : 'dot',
      spin: Math.random() * Math.PI,
    })
  }
}

function drawStar(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation = 0,
): void {
  context.save()
  context.translate(x, y)
  context.rotate(rotation)
  context.beginPath()
  context.moveTo(0, -size)
  context.lineTo(size * 0.18, -size * 0.18)
  context.lineTo(size, 0)
  context.lineTo(size * 0.18, size * 0.18)
  context.lineTo(0, size)
  context.lineTo(-size * 0.18, size * 0.18)
  context.lineTo(-size, 0)
  context.lineTo(-size * 0.18, -size * 0.18)
  context.closePath()
  context.fill()
  context.restore()
}

function collectPoints(
  description: string,
  progress: number,
  kind?: GestureKind | null,
): Point[] {
  const points: Point[] = []
  const steps = Math.max(8, Math.ceil(progress * 96))
  for (let i = 0; i <= steps; i += 1) {
    points.push(samplePath(description, (progress * i) / steps, kind))
  }
  return points
}

function drawCometTrail(context: CanvasRenderingContext2D, points: Point[]): void {
  if (points.length < 2) return

  for (let i = 0; i < points.length; i += 1) {
    const along = i / (points.length - 1)
    const tipness = along ** 1.35
    const point = points[i]
    if (!point) continue

    context.beginPath()
    context.fillStyle = colors.accent
    context.globalAlpha = 0.1 + tipness * 0.22
    context.arc(point.x, point.y, lerp(10, 36, tipness), 0, Math.PI * 2)
    context.fill()
  }

  context.lineCap = 'round'
  context.lineJoin = 'round'

  context.beginPath()
  context.moveTo(points[0].x, points[0].y)
  for (const point of points) context.lineTo(point.x, point.y)
  context.strokeStyle = colors.accent
  context.globalAlpha = 0.28
  context.lineWidth = 34
  context.stroke()

  context.beginPath()
  context.moveTo(points[0].x, points[0].y)
  for (const point of points) context.lineTo(point.x, point.y)
  context.strokeStyle = colors.glow
  context.globalAlpha = 0.55
  context.lineWidth = 18
  context.stroke()

  context.beginPath()
  context.moveTo(points[0].x, points[0].y)
  for (const point of points) context.lineTo(point.x, point.y)
  context.strokeStyle = colors.parchment
  context.globalAlpha = 0.92
  context.lineWidth = 7
  context.stroke()
}

function drawShootingStarHead(context: CanvasRenderingContext2D, tip: Point): void {
  context.save()
  context.shadowColor = colors.glow
  context.shadowBlur = 36
  context.fillStyle = colors.glow
  context.globalAlpha = 0.95
  drawStar(context, tip.x, tip.y, 28, Math.PI / 4)

  context.shadowBlur = 18
  context.fillStyle = colors.parchment
  drawStar(context, tip.x, tip.y, 16, 0)

  context.shadowBlur = 0
  context.fillStyle = colors.accentHover
  context.beginPath()
  context.arc(tip.x, tip.y, 6, 0, Math.PI * 2)
  context.fill()
  context.restore()
}

export function stepWandCast(
  context: CanvasRenderingContext2D,
  description: string,
  elapsed: number,
  delta: number,
  state: WandCastState,
  kind?: GestureKind | null,
): void {
  const { width, height } = WAND_CAST_SIZE
  const raw = clamp01(elapsed / WAND_CAST_DURATION)
  const progress = easeOutCubic(raw)
  const tip = samplePath(description, progress, kind)
  const points = collectPoints(description, progress, kind)

  context.clearRect(0, 0, width, height)

  if (progress > 0.02) {
    drawCometTrail(context, points)
  }

  drawShootingStarHead(context, tip)

  if (raw < 1) {
    state.spawnCarry += delta * 90
    while (state.spawnCarry >= 1) {
      const trail = points[Math.max(0, points.length - 1 - Math.floor(Math.random() * 8))]
      spawnSparkle(trail ?? tip, state, Math.random() > 0.72)
      state.spawnCarry -= 1
    }
  } else if (Math.random() < 0.22) {
    spawnSparkle(tip, state)
  }

  for (const sparkle of state.sparkles) {
    sparkle.life += delta
    sparkle.x += sparkle.vx * delta
    sparkle.y += sparkle.vy * delta
    sparkle.vy += 22 * delta
    sparkle.spin += delta * 3
  }
  state.sparkles = state.sparkles.filter(
    (sparkle) => sparkle.life < sparkle.maxLife,
  )

  for (const sparkle of state.sparkles) {
    const fade = 1 - sparkle.life / sparkle.maxLife
    context.globalAlpha = fade
    context.fillStyle = sparkle.color
    if (sparkle.kind === 'star') {
      drawStar(
        context,
        sparkle.x,
        sparkle.y,
        sparkle.size * 2.1 * fade,
        sparkle.spin,
      )
    } else {
      context.beginPath()
      context.arc(sparkle.x, sparkle.y, sparkle.size * fade, 0, Math.PI * 2)
      context.fill()
    }
  }

  context.globalAlpha = 1
}
