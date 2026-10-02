import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pageInkBridge } from './pageInkBridge.ts'

test('fadeOut sans handler ne bloque pas le feuilletage', async () => {
  pageInkBridge.setFadeOut(null)
  await assert.doesNotReject(() => pageInkBridge.fadeOut())
})

test('fadeOut appelle le handler enregistré', async () => {
  let called = false
  pageInkBridge.setFadeOut(async () => {
    called = true
  })
  await pageInkBridge.fadeOut()
  assert.equal(called, true)
  pageInkBridge.setFadeOut(null)
})
