// Playwright driver verifying the Projects CRUD flow end-to-end (login, create, view, edit, delete).
// Not part of the app build. Requires a "users" record matching the OWNER_EMAIL/OWNER_PASSWORD
// env vars below (required, no fallback) and both `bun run dev` and PocketBase already running.
import { chromium } from 'playwright'

const OUT = process.env.SHOT_DIR ?? '/tmp/shots'
const URL = process.env.APP_URL ?? 'http://localhost:5173'
const OWNER_EMAIL = process.env.OWNER_EMAIL
const OWNER_PASSWORD = process.env.OWNER_PASSWORD
if (!OWNER_EMAIL || !OWNER_PASSWORD) {
  throw new Error('Set OWNER_EMAIL and OWNER_PASSWORD env vars before running this script.')
}

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('response', async (res) => {
  if (res.status() >= 400) {
    const body = await res.text().catch(() => '<unreadable>')
    console.log(`HTTP ${res.status()} ${res.url()}\n${body}`)
  }
})

const gotoProjects = () => page.locator('nav[aria-label="Primary"] a[href="/projects"]').click()

// Log in + enable edit mode
await page.goto(`${URL}/settings`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /Admin Login/i }).click()
await page.getByLabel('Email').fill(OWNER_EMAIL)
await page.getByLabel('Password').fill(OWNER_PASSWORD)
await page.getByRole('button', { name: /^Log in$/ }).click()
await page.waitForTimeout(300)
if (!(await page.getByText('Signed in as admin.').count())) errors.push('login did not succeed')
await page.getByText(/^(Viewing|Editing)$/).click()
await page.waitForTimeout(150)

// Create a project
await gotoProjects()
await page.waitForURL('**/projects')
await page.screenshot({ path: `${OUT}/projects-01-list-empty.png` })
await page.getByRole('link', { name: 'New project' }).click()
await page.waitForURL('**/projects/new')

await page.getByLabel('Title').fill('Test Project')
await page.getByLabel('Summary').fill('A short summary for the test project.')
await page.getByLabel('Code URL').fill('https://github.com/example/test')
await page.getByLabel('Tech (comma-separated)').fill('SolidJS, TypeScript')
await page.getByLabel('Body (Markdown, optional)').fill('Longer project description.')
await page.getByText(/^(Draft|Published)$/).click() // toggle to Published
await page.getByRole('button', { name: 'Save' }).click()
await page.waitForURL('**/projects/test-project', { timeout: 5000 }).catch(() => {})
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/projects-02-detail-view.png` })

const h1Text = await page.locator('h1').first().textContent()
if (h1Text !== 'Test Project') errors.push(`expected h1 "Test Project", got "${h1Text}"`)
if (!(await page.getByRole('link', { name: 'Code' }).count())) errors.push('Code link missing on detail page')

// Back to list, confirm it shows up
await gotoProjects()
await page.waitForURL('**/projects')
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/projects-03-list-with-project.png` })
if (!(await page.locator('a[href="/projects/test-project"]').count())) {
  errors.push('new project not visible in Projects list')
}

// Edit it
await page.locator('a[href="/projects/test-project"]').click()
await page.waitForURL('**/projects/test-project')
await page.getByRole('button', { name: 'Edit' }).click()
await page.getByLabel('Title').fill('Test Project (edited)')
await page.getByRole('button', { name: 'Save changes' }).click()
await page.waitForTimeout(400)
const editedH1 = await page.locator('h1').first().textContent()
if (editedH1 !== 'Test Project (edited)') errors.push(`expected edited h1, got "${editedH1}"`)
await page.screenshot({ path: `${OUT}/projects-04-edited.png` })

// Delete it
page.once('dialog', (d) => d.accept())
await page.getByRole('button', { name: 'Delete' }).click()
await page.waitForURL('**/projects', { timeout: 5000 })
if (await page.getByText(/Test Project/).count()) errors.push('project still visible in list after delete')
await page.screenshot({ path: `${OUT}/projects-05-after-delete.png` })

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))
await browser.close()
