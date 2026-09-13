import { colors } from '@/styles/tokens/colors'
import { spellLightColor } from '@/utils/spellLightColor'
import type { Spell } from '@/types/spell'
import type { BookPageCopy } from '@/scenes/spellbook/bookCopy'
import { gestureSeal, pageLayout } from '@/scenes/spellbook/pageLayout'

const PAD = 88
const DISPLAY = 'Cinzel, Georgia, serif'
const FONT = '"Cormorant Garamond", Georgia, "Times New Roman", serif'

function wrapLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (context.measureText(next).width <= maxWidth) {
      current = next
      continue
    }

    if (current) lines.push(current)
    current = word
    if (lines.length === maxLines - 1) break
  }

  if (lines.length < maxLines && current) {
    if (
      lines.length === maxLines - 1 &&
      context.measureText(current).width > maxWidth
    ) {
      while (current.length > 1 && context.measureText(`${current}…`).width > maxWidth) {
        current = current.slice(0, -1)
      }
      lines.push(`${current}…`)
    } else {
      lines.push(current)
    }
  } else if (lines.length === maxLines && words.length > 0) {
    const last = lines[maxLines - 1] ?? ''
    lines[maxLines - 1] =
      last.endsWith('…') ? last : `${last.replace(/[.,;:]?$/, '')}…`
  }

  return lines
}

function wrappedAll(lines: string[], text: string): boolean {
  if (lines.some((line) => line.endsWith('…'))) return false
  return lines.join(' ').replace(/\s+/g, ' ') === text.trim().replace(/\s+/g, ' ')
}

function layoutBody(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
): { lines: string[]; size: number; lineHeight: number } {
  const sizes = [64, 58, 52, 48, 44]
  let chosen = {
    lines: ['—'],
    size: sizes[sizes.length - 1] ?? 44,
    lineHeight: 60,
  }

  for (const size of sizes) {
    context.font = `${size}px ${FONT}`
    const lineHeight = Math.round(size * 1.36)
    const maxLines = Math.max(3, Math.floor(maxHeight / lineHeight))
    const lines = wrapLines(context, text, maxWidth, maxLines)
    chosen = { lines, size, lineHeight }
    if (wrappedAll(lines, text)) break
  }

  return chosen
}

function drawLabel(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
): number {
  context.fillStyle = colors.inkMuted
  context.font = `600 32px ${DISPLAY}`
  context.letterSpacing = '8px'
  context.fillText(text.toUpperCase(), x, y)
  context.letterSpacing = '0px'
  return y + 68
}

function drawRule(context: CanvasRenderingContext2D, x: number, y: number, width: number): number {
  context.strokeStyle = colors.border
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x + width, y)
  context.stroke()

  context.fillStyle = colors.accent
  context.beginPath()
  context.arc(x + width / 2, y, 5, 0, Math.PI * 2)
  context.fill()
  return y + 36
}

function drawLightRow(
  context: CanvasRenderingContext2D,
  lightName: string,
  label: string,
  x: number,
  y: number,
): number {
  const swatch = 36
  const light = spellLightColor(lightName)
  context.beginPath()
  context.arc(x + swatch / 2, y + swatch / 2, swatch / 2, 0, Math.PI * 2)
  context.fillStyle = light
  context.fill()
  context.strokeStyle = colors.border
  context.lineWidth = 2
  context.stroke()
  context.fillStyle = colors.inkMuted
  context.font = `40px ${FONT}`
  context.fillText(`${label} : ${lightName}`, x + swatch + 20, y)
  return y + 56
}

function clearPage(context: CanvasRenderingContext2D): void {
  const { textureWidth: width, textureHeight: height } = pageLayout
  context.clearRect(0, 0, width, height)
}

function applyInkReveal(
  context: CanvasRenderingContext2D,
  progress: number,
): void {
  const { textureWidth: width, textureHeight: height } = pageLayout
  const x = width * Math.min(Math.max(progress, 0), 1)

  context.save()
  context.beginPath()
  context.rect(0, 0, x, height)
  context.clip()
}

function finishInkReveal(context: CanvasRenderingContext2D): void {
  context.restore()
}

export function drawLeftPage(
  context: CanvasRenderingContext2D,
  spell: Spell,
  isLoading: boolean,
  copy: BookPageCopy,
  inkProgress = 1,
): void {
  const { textureWidth: width, textureHeight: height } = pageLayout
  const col = width - PAD * 2
  clearPage(context)
  applyInkReveal(context, inkProgress)
  context.textBaseline = 'top'
  context.textAlign = 'left'

  let y = PAD
  y = drawLabel(context, copy.spellLabel, PAD, y)

  if (isLoading) {
    context.fillStyle = colors.inkMuted
    context.font = `italic 52px ${FONT}`
    context.fillText(copy.loadingLeft, PAD, y)
    finishInkReveal(context)
    return
  }

  context.fillStyle = colors.ink
  context.font = `600 108px ${DISPLAY}`
  const title = wrapLines(context, spell.name || '—', col, 3)
  for (const line of title) {
    context.fillText(line, PAD, y)
    y += 118
  }

  y = drawRule(context, PAD, y + 12, col)

  if (spell.incantation) {
    context.fillStyle = colors.inkMuted
    context.font = `600 28px ${DISPLAY}`
    context.letterSpacing = '6px'
    context.fillText(copy.incantationLabel.toUpperCase(), PAD, y)
    context.letterSpacing = '0px'
    y += 48
    context.fillStyle = colors.ink
    context.font = `italic 56px ${FONT}`
    const chant = wrapLines(context, spell.incantation, col, 3)
    for (const line of chant) {
      context.fillText(line, PAD, y)
      y += 70
    }
  }

  if (spell.category) {
    y += 28
    context.font = `600 32px ${FONT}`
    context.letterSpacing = '3px'
    const label = spell.category.toUpperCase()
    const textWidth = context.measureText(label).width
    context.strokeStyle = colors.border
    context.lineWidth = 2
    context.beginPath()
    context.roundRect(PAD, y, textWidth + 48, 56, 28)
    context.stroke()
    context.fillStyle = colors.inkMuted
    context.fillText(label, PAD + 24, y + 12)
    context.letterSpacing = '0px'
    y += 72
  }

  if (spell.light) {
    y = Math.max(y + 48, height - PAD - 64)
    drawLightRow(context, spell.light, copy.lightLabel, PAD, y)
  }

  finishInkReveal(context)
}

function drawGestureSeal(
  context: CanvasRenderingContext2D,
  copy: BookPageCopy,
): void {
  const { x, y, width, height } = gestureSeal
  context.save()
  context.strokeStyle = colors.accent
  context.lineWidth = 3
  context.beginPath()
  context.roundRect(x, y, width, height, 32)
  context.stroke()

  context.font = `600 26px ${DISPLAY}`
  context.fillStyle = colors.inkMuted
  context.letterSpacing = '6px'
  context.fillText(copy.gestureLabel.toUpperCase(), x + 32, y + 22)
  context.letterSpacing = '0px'

  context.font = `600 44px ${DISPLAY}`
  context.fillStyle = colors.ink
  context.fillText(copy.discoverGesture, x + 32, y + 64)

  context.fillStyle = colors.accent
  context.beginPath()
  context.moveTo(x + width - 60, y + height / 2 - 16)
  context.lineTo(x + width - 50, y + height / 2 - 4)
  context.lineTo(x + width - 32, y + height / 2)
  context.lineTo(x + width - 50, y + height / 2 + 4)
  context.lineTo(x + width - 60, y + height / 2 + 16)
  context.lineTo(x + width - 64, y + height / 2 + 4)
  context.lineTo(x + width - 78, y + height / 2)
  context.lineTo(x + width - 64, y + height / 2 - 4)
  context.closePath()
  context.fill()
  context.restore()
}

export function drawRightPage(
  context: CanvasRenderingContext2D,
  spell: Spell,
  isLoading: boolean,
  image: HTMLImageElement | null,
  copy: BookPageCopy,
  gestureRevealed = false,
  inkProgress = 1,
): void {
  const { textureWidth: width, textureHeight: height } = pageLayout
  const col = width - PAD * 2
  clearPage(context)
  applyInkReveal(context, inkProgress)
  context.textBaseline = 'top'
  context.textAlign = 'left'

  let y = PAD
  y = drawLabel(context, copy.effectLabel, PAD, y)

  if (isLoading) {
    context.fillStyle = colors.inkMuted
    context.font = `italic 52px ${FONT}`
    context.fillText(copy.loadingRight, PAD, y)
    finishInkReveal(context)
    return
  }

  const showHand = Boolean(spell.hand && gestureRevealed)
  const reservedBottom = spell.hand
    ? height - gestureSeal.y + 24
    : PAD + 8
  const floor = height - reservedBottom
  const hasImage = Boolean(image && image.naturalWidth > 0)
  const imageBudget = hasImage ? Math.min(520, Math.max(280, floor - y - 220)) : 0
  const textFloor = floor - (hasImage ? imageBudget + 36 : 0) - (showHand ? 200 : 0)

  context.fillStyle = colors.ink
  const body = layoutBody(
    context,
    spell.effect || '—',
    col,
    Math.max(180, textFloor - y),
  )
  context.font = `${body.size}px ${FONT}`
  for (const line of body.lines) {
    context.fillText(line, PAD, y)
    y += body.lineHeight
  }

  if (hasImage && image) {
    y += 28
    const maxW = col
    const maxH = Math.max(200, floor - y - (showHand ? 180 : 0))
    const scale = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight)
    const drawW = image.naturalWidth * scale
    const drawH = image.naturalHeight * scale
    context.drawImage(image, PAD + (maxW - drawW) / 2, y, drawW, drawH)
    y += drawH + 28
  }

  if (showHand && spell.hand) {
    y = Math.min(y + 20, floor - 180)
    y = drawLabel(context, copy.gestureLabel, PAD, y)
    context.fillStyle = colors.ink
    context.font = `italic 42px ${FONT}`
    const hand = wrapLines(context, spell.hand, col, 4)
    for (const line of hand) {
      context.fillText(line, PAD, y)
      y += 54
    }
  } else if (spell.hand) {
    drawGestureSeal(context, copy)
  }

  finishInkReveal(context)
}
