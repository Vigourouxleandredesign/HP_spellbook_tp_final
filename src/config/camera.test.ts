import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  cameraForViewport,
  computeFitDistance,
  desktopCameraDefaults,
  mobileCameraDefaults,
  type SceneCameraSettings,
} from './camera.ts'

const desktop = desktopCameraDefaults as SceneCameraSettings
const mobileExpected = { ...mobileCameraDefaults }

test('desktop : cameraForViewport est une identité (Leva / défauts PC)', () => {
  const result = cameraForViewport(desktop, false)
  assert.equal(result, desktop)
  assert.deepEqual(result, desktopCameraDefaults)
})

test('desktop : valeurs = premier panneau Leva', () => {
  assert.deepEqual({ ...desktopCameraDefaults }, {
    fov: 42,
    fitMargin: 0.5,
    fitElevation: 1.15,
    offsetX: 0,
    offsetY: -0.21,
    offsetZ: -2,
    targetOffsetY: -0.21,
    minPolarDeg: 14,
    maxPolarDeg: 88,
    minDistanceScale: 0.7,
    maxDistanceScale: 2.55,
    modelRotationY: 0,
  })
})

test('mobile : valeurs = second panneau Leva', () => {
  assert.deepEqual(cameraForViewport(desktop, true), mobileExpected)
  assert.deepEqual({ ...mobileCameraDefaults }, {
    fov: 43,
    fitMargin: 0.55,
    fitElevation: 1,
    offsetX: 0,
    offsetY: -0.8,
    offsetZ: -2,
    targetOffsetY: -0.9,
    minPolarDeg: 0,
    maxPolarDeg: 86,
    minDistanceScale: 0.5,
    maxDistanceScale: 2.55,
    modelRotationY: 0,
  })
})

test('mobile : ignore les sliders desktop (pas de fuite PC → téléphone)', () => {
  const tainted: SceneCameraSettings = {
    ...desktop,
    offsetX: -1.78,
    offsetY: -2,
    fitElevation: 1.78,
  }
  assert.deepEqual(cameraForViewport(tainted, true), mobileExpected)
})

test('mobile : ne mute pas les défauts desktop', () => {
  const before = { ...desktopCameraDefaults }
  cameraForViewport(desktop, true)
  assert.deepEqual(desktopCameraDefaults, before)
})

test('PC et mobile restent deux cadrages distincts', () => {
  assert.notDeepEqual(
    { ...desktopCameraDefaults },
    { ...mobileCameraDefaults },
  )
  assert.equal(desktopCameraDefaults.fov, 42)
  assert.equal(mobileCameraDefaults.fov, 43)
  assert.equal(desktopCameraDefaults.offsetY, -0.21)
  assert.equal(mobileCameraDefaults.offsetY, -0.8)
  assert.equal(desktopCameraDefaults.targetOffsetY, -0.21)
  assert.equal(mobileCameraDefaults.targetOffsetY, -0.9)
})

test('distance de fit : formule d’origine, sans multiplicateur portrait', () => {
  const maxDim = 2.4
  const fov = 42
  const margin = 0.5
  const expected = (maxDim / 2 / Math.tan((fov * Math.PI) / 180 / 2)) * margin
  assert.equal(computeFitDistance(maxDim, fov, margin), expected)
})
