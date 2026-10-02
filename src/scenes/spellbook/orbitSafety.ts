export function shouldAllowWheelZoom(ctrlKey: boolean): boolean {
  return ctrlKey
}

export function shouldEnableRotate(event: {
  pointerType: string
  button: number
  ctrlKey: boolean
}): boolean {
  if (event.pointerType === 'touch') return true
  if (event.button === 0) return event.ctrlKey
  return true
}
