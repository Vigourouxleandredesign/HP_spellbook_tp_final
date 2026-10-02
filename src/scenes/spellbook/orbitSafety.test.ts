import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  shouldAllowWheelZoom,
  shouldEnableRotate,
} from './orbitSafety.ts'

test('molette : zoom seulement avec Ctrl', () => {
  assert.equal(shouldAllowWheelZoom(false), false)
  assert.equal(shouldAllowWheelZoom(true), true)
})

test('souris : rotate seulement avec Ctrl + clic gauche', () => {
  assert.equal(
    shouldEnableRotate({ pointerType: 'mouse', button: 0, ctrlKey: false }),
    false,
  )
  assert.equal(
    shouldEnableRotate({ pointerType: 'mouse', button: 0, ctrlKey: true }),
    true,
  )
})

test('touch : rotate toujours autorisé (pas de Ctrl)', () => {
  assert.equal(
    shouldEnableRotate({ pointerType: 'touch', button: 0, ctrlKey: false }),
    true,
  )
})
