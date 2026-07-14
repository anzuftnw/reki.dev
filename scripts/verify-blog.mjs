// Playwright driver verifying the Blog CRUD flow end-to-end (login, create, view+highlight, edit, delete).
// Not part of the app build. Requires a "users" record matching the OWNER_EMAIL/OWNER_PASSWORD
// env vars below (required, no fallback) and both `bun run dev` and PocketBase already running.
//
// Uses in-app link clicks (not page.goto) once past the first load -- editMode is deliberately
// NOT persisted to localStorage (unlike theme/sidebar/contentWidth), so a real page.goto() reload
// mid-test resets it to false, same as it would for a real user's tab refresh.
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

const gotoBlog = () => page.locator('nav[aria-label="Primary"] a[href="/blog"]').click()

// Log in
await page.goto(`${URL}/settings`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /Admin Login/i }).click()
await page.getByLabel('Email').fill(OWNER_EMAIL)
await page.getByLabel('Password').fill(OWNER_PASSWORD)
await page.getByRole('button', { name: /^Log in$/ }).click()
await page.waitForTimeout(300)
const loggedIn = await page.getByText('Signed in as admin.').count()
if (!loggedIn) errors.push('login did not succeed (no "Signed in as admin." text)')

// Turn on edit mode so the "New post" button appears. The switch's real <input> is sr-only and
// its wrapping group intercepts pointer events at that location, so click the visible label text.
await page.getByText(/^(Viewing|Editing)$/).click()
await page.waitForTimeout(150)

// Create a post
await gotoBlog()
await page.waitForURL('**/blog')
await page.screenshot({ path: `${OUT}/blog-01-list-empty.png` })
await page.getByRole('link', { name: 'New post' }).click()
await page.waitForURL('**/blog/new')

const MARKDOWN_BODY = `Intro paragraph with **bold** text.

\`\`\`ts
const greeting: string = "hello"
console.log(greeting)
\`\`\`

- item one
- item two
`

await page.getByLabel('Title').fill('Test Post')
await page.getByLabel('Excerpt').fill('A short excerpt for the test post.')
await page.getByLabel('Tags (comma-separated)').fill('testing, solidjs')
await page.getByLabel('Body (Markdown)').fill(MARKDOWN_BODY)
await page.getByText(/^(Draft|Published)$/).click() // toggle to Published
await page.getByRole('button', { name: 'Save' }).click()
await page.waitForURL('**/blog/test-post', { timeout: 5000 }).catch(() => {})
await page.waitForTimeout(500)
await page.screenshot({ path: `${OUT}/blog-02-post-view.png` })

const codeHighlighted = await page.locator('.shiki').count()
if (!codeHighlighted) errors.push('rendered post has no .shiki code block (highlighting did not run)')

const h1Text = await page.locator('h1').first().textContent()
if (h1Text !== 'Test Post') errors.push(`expected h1 "Test Post", got "${h1Text}"`)

// Back to list, confirm it shows up
await gotoBlog()
await page.waitForURL('**/blog')
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/blog-03-list-with-post.png` })
const cardCount = await page.locator('a[href="/blog/test-post"]').count()
if (!cardCount) errors.push('new post not visible in BlogList')

// Edit it
await page.locator('a[href="/blog/test-post"]').click()
await page.waitForURL('**/blog/test-post')
await page.getByRole('button', { name: 'Edit' }).click()
await page.getByLabel('Title').fill('Test Post (edited)')
await page.getByRole('button', { name: 'Save changes' }).click()
await page.waitForTimeout(400)
const editedH1 = await page.locator('h1').first().textContent()
if (editedH1 !== 'Test Post (edited)') errors.push(`expected edited h1, got "${editedH1}"`)
await page.screenshot({ path: `${OUT}/blog-04-post-edited.png` })

// Delete it
page.once('dialog', (d) => d.accept())
await page.getByRole('button', { name: 'Delete' }).click()
await page.waitForURL('**/blog', { timeout: 5000 })
const goneCount = await page.getByText(/Test Post/).count()
if (goneCount) errors.push('post still visible in list after delete')
await page.screenshot({ path: `${OUT}/blog-05-list-after-delete.png` })

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))
await browser.close()
