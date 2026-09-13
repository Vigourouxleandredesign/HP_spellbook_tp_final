import type { SceneLightSettings } from '@/config/scene'

export function SceneLights({
  ambientIntensity,
  ambientColor,
  keyIntensity,
  keyColor,
  keyPosition,
  fillIntensity,
  fillColor,
  fillPosition,
}: SceneLightSettings) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <directionalLight
        position={keyPosition}
        intensity={keyIntensity}
        color={keyColor}
      />
      <directionalLight
        position={fillPosition}
        intensity={fillIntensity}
        color={fillColor}
      />
    </>
  )
}
