interface SceneLightsProps {
  ambientIntensity: number
  ambientColor: string
  keyIntensity: number
  keyColor: string
  fillIntensity: number
  fillColor: string
}

export function SceneLights({
  ambientIntensity,
  ambientColor,
  keyIntensity,
  keyColor,
  fillIntensity,
  fillColor,
}: SceneLightsProps) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={keyIntensity}
        color={keyColor}
      />
      <directionalLight
        position={[-2, 1, -1]}
        intensity={fillIntensity}
        color={fillColor}
      />
    </>
  )
}
