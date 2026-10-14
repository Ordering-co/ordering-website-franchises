import test from 'node:test'
import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { configure, doctor, restore, validateManifest } from './core.mjs'

const manifest = validateManifest(JSON.parse(await fs.readFile(new URL('./product.json', import.meta.url), 'utf8')))
// Synthetic configuration keeps these tests independent of a customer's setup.
const template = Buffer.from(JSON.stringify({
  project: 'your-project',
  franchiseSlug: null,
  api: { url: 'https://api.example.com', version: 'v400', language: 'en' },
  socket: { url: 'https://socket.example.com' },
  app_id: 'fixture-franchise',
  businessSlug: '',
  extra: { keep: true }
}, null, 2) + '\n')

async function fixture (context) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'franchise-onboarding-'))
  context.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.mkdir(path.join(root, 'src'))
  await fs.writeFile(path.join(root, manifest.configFile), template)
  return root
}

const request = async (url) => ({
  ok: true,
  json: async () => url.endsWith('/current')
    ? { error: false, result: { code: 'fixture-project' } }
    : { error: false, result: [{ slug: 'selected-franchise', id: 23, enabled: true }], pagination: { total: 1 } }
})

test('product config requires an explicit franchise before any request or mutation', async context => {
  const root = await fixture(context)
  await assert.rejects(configure(root, manifest, { project: 'fixture-project' }, () => { throw new Error('unexpected request') }), /franchise_selection_required/)
  assert.deepEqual(await fs.readFile(path.join(root, manifest.configFile)), template)
  await assert.rejects(fs.stat(path.join(root, '.ordering-setup')), { code: 'ENOENT' })
})

test('product adapter selects the requested franchise, preserves other fields and restores exact bytes', async context => {
  const root = await fixture(context)
  const result = await configure(root, manifest, { project: 'fixture-project', franchiseSlug: 'selected-franchise' }, request)
  assert.deepEqual(result.verification, { project: true, authenticated: false, franchise: true })
  const next = JSON.parse(await fs.readFile(path.join(root, manifest.configFile), 'utf8'))
  const original = JSON.parse(template)
  assert.deepEqual(next, { ...original, project: 'fixture-project', franchiseSlug: 23 })
  assert.deepEqual(result.selection, { id: 23, slug: 'selected-franchise' })
  assert.equal(typeof next.franchiseSlug, 'number')
  assert.deepEqual((await doctor(root, manifest, request)).verification, result.verification)
  await restore(root, manifest, result.backup)
  assert.deepEqual(await fs.readFile(path.join(root, manifest.configFile)), template)
})
