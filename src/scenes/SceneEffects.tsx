import { Bloom, EffectComposer } from '@react-three/postprocessing'

interface SceneEffectsProps {
  intensity: number
  luminanceThreshold: number
  luminanceSmoothing: number
  mipmapBlur: boolean
}

export function SceneEffects({
  intensity,
  luminanceThreshold,
  luminanceSmoothing,
  mipmapBlur,
}: SceneEffectsProps) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={intensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        mipmapBlur={mipmapBlur}
      />
    </EffectComposer>
  )
}
