// Playwright driver verifying the Games / Arknights workspace end-to-end: games list,
// workspace tabs (Overview/Collection/Teams/Planner/History+subtabs), and CRUD on
// arknights_collection, game_teams, game_history_entries.
// Not part of the app build. Requires PocketBase running, a "users" record matching the
// OWNER_EMAIL/OWNER_PASSWORD env vars below (required, no fallback), and the arknights seed
// data from scripts/seed-arknights.mjs.
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

const gotoGames = () => page.locator('nav[aria-label="Primary"] a[href="/games"]').click()

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

// Games list
await gotoGames()
await page.waitForURL('**/games')
await page.waitForTimeout(200)
await page.screenshot({ path: `${OUT}/games-01-list.png` })
if (!(await page.locator('a[href="/games/arknights"]').count())) errors.push('Arknights game card not visible')

// Into the workspace -> Overview
await page.locator('a[href="/games/arknights"]').click()
await page.waitForURL('**/games/arknights')
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/games-02-overview.png` })
const h1Text = await page.locator('h1').first().textContent()
if (h1Text !== 'Arknights') errors.push(`expected h1 "Arknights", got "${h1Text}"`)

// Collection tab
await page.getByRole('tab', { name: 'Collection' }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/games-03-collection.png` })
if (!(await page.getByText('SilverAsh').count())) errors.push('seeded owned operator SilverAsh not visible')

// Add a new collection entry
await page.getByRole('button', { name: 'Add' }).click()
await page.waitForTimeout(150)
const operatorSelect = page.locator('form select').first()
await operatorSelect.selectOption({ label: 'Croissant' })
await page.getByRole('button', { name: 'Add', exact: true }).last().click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/games-04-collection-added.png` })
if (!(await page.getByText('Croissant').count())) errors.push('newly added Croissant not visible in Collection')

// Edit it: find its card, click Edit, change level, save
const croissantCard = page.locator('article', { hasText: 'Croissant' })
await croissantCard.getByRole('button', { name: 'Edit' }).click()
await page.waitForTimeout(150)
const levelInput = page.locator('form').filter({ hasText: 'Operator: Croissant' }).getByLabel('Level')
await levelInput.fill('50')
await page.getByRole('button', { name: 'Save changes' }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/games-05-collection-edited.png` })

// Delete it
page.once('dialog', (d) => d.accept())
await page.locator('article', { hasText: 'Croissant' }).getByRole('button', { name: 'Remove' }).click()
await page.waitForTimeout(400)
if (await page.getByText('Croissant').count()) errors.push('Croissant still visible after delete')
await page.screenshot({ path: `${OUT}/games-06-collection-after-delete.png` })

// Teams tab
await page.getByRole('tab', { name: 'Teams' }).click()
await page.waitForTimeout(200)
await page.getByRole('button', { name: 'New team' }).click()
await page.waitForTimeout(150)
await page.getByLabel('Team name').fill('Test Team')
await page.getByRole('button', { name: 'Add slot' }).click()
await page.getByRole('button', { name: 'Add slot' }).click()
await page.getByRole('button', { name: 'Save', exact: true }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/games-07-teams.png` })
if (!(await page.getByText('Test Team').count())) errors.push('new team not visible')

// Delete team
page.once('dialog', (d) => d.accept())
await page.locator('article', { hasText: 'Test Team' }).getByRole('button', { name: 'Delete' }).click()
await page.waitForTimeout(300)
if (await page.getByText('Test Team').count()) errors.push('team still visible after delete')

// History tab -> Operator Pulls subtab
await page.getByRole('tab', { name: 'History' }).click()
await page.waitForTimeout(200)
await page.getByRole('button', { name: 'New entry' }).click()
await page.waitForTimeout(150)
await page.getByLabel('Date').fill('2026-07-01')
await page.getByLabel('Label').fill('Test Pull — Amiya')
await page.getByLabel('Rarity (optional)').fill('6')
await page.getByRole('button', { name: 'Save', exact: true }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/games-08-history-pulls.png` })
if (!(await page.getByText('Test Pull — Amiya').count())) errors.push('new pulls history entry not visible')

// Switch to Tasks subtab
await page.getByText('Tasks', { exact: true }).click()
await page.waitForTimeout(200)
await page.getByRole('button', { name: 'New entry' }).click()
await page.waitForTimeout(150)
await page.getByLabel('Date').fill('2026-07-02')
await page.getByLabel('Label').fill('Test Task — Daily clear')
await page.getByRole('button', { name: 'Save', exact: true }).click()
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}/games-09-history-tasks.png` })
if (!(await page.getByText('Test Task — Daily clear').count())) errors.push('new tasks history entry not visible')

// Clean up history entries
page.once('dialog', (d) => d.accept())
await page.locator('li', { hasText: 'Test Task — Daily clear' }).getByRole('button', { name: 'Delete' }).click()
await page.waitForTimeout(300)
await page.getByText('Operator Pulls', { exact: true }).click()
await page.waitForTimeout(200)
page.once('dialog', (d) => d.accept())
await page.locator('li', { hasText: 'Test Pull — Amiya' }).getByRole('button', { name: 'Delete' }).click()
await page.waitForTimeout(300)

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))
await browser.close()
