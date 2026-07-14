// Ad-hoc Playwright driver for manual verification. Not part of the app build.
import { chromium } from 'playwright'

const OUT = process.env.SHOT_DIR ?? '/tmp/shots'
const URL = process.env.APP_URL ?? 'http://localhost:5174'

const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})

await page.goto(URL, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${OUT}/01-home.png` })

// Sidebar collapse cycle
const sidebarToggle = page.getByLabel(/Sidebar: /)
await sidebarToggle.click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/02-sidebar-collapsed.png` })

// Hover a collapsed nav row to check Kobalte tooltip
await page.locator('nav[aria-label="Primary"] a[href="/"]').hover()
await page.waitForTimeout(200)
await page.screenshot({ path: `${OUT}/03-tooltip.png` })

await sidebarToggle.click() // -> hidden
await page.waitForTimeout(300)
await sidebarToggle.click() // -> expanded
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}/04-sidebar-expanded.png` })

// Theme cycle
const themeToggle = page.getByLabel(/Theme: /)
await themeToggle.click()
await page.waitForTimeout(150)
await themeToggle.click()
await page.waitForTimeout(150)
await page.screenshot({ path: `${OUT}/05-theme-cycled.png` })
await themeToggle.click() // back to auto
await page.waitForTimeout(150)

// Settings modal (Kobalte Dialog)
await page.goto(`${URL}/settings`, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${OUT}/06-settings.png` })
const loginBtn = page.getByRole('button', { name: /Admin Login/i })
if (await loginBtn.count()) {
  await loginBtn.click()
  await page.waitForTimeout(200)
  await page.screenshot({ path: `${OUT}/07-modal-open.png` })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
  await page.screenshot({ path: `${OUT}/08-modal-closed.png` })
}

// Content width toggle (Settings) — cycles full -> centered -> full, persists via localStorage
const contentWidthBtn = page.getByRole('button', { name: /Content width/ })
await contentWidthBtn.click()
await page.waitForTimeout(150)
const afterClick = await contentWidthBtn.textContent()
await page.reload({ waitUntil: 'networkidle' })
const afterReload = await page.getByRole('button', { name: /Content width/ }).textContent()
await page.screenshot({ path: `${OUT}/10-content-width-centered.png` })
if (!afterClick?.includes('Centered') || !afterReload?.includes('Centered')) {
  errors.push(`contentWidth toggle/persist failed: afterClick="${afterClick}" afterReload="${afterReload}"`)
}
await page.getByRole('button', { name: /Content width/ }).click() // back to full
await page.waitForTimeout(150)

// Hero scroll-progress: confirm the parallax/scale/fade actually respond to scroll,
// and that prefers-reduced-motion strips the transform (opacity fade still allowed).
await page.goto(URL, { waitUntil: 'networkidle' })
const heroBg = page.locator('section').first().locator('div').first()
await page.evaluate(() => document.querySelector('main')?.scrollTo({ top: 400 }))
await page.waitForTimeout(200)
const transformAtScroll = await heroBg.evaluate((el) => getComputedStyle(el).transform)
const opacityAtScroll = await heroBg.evaluate((el) => getComputedStyle(el).opacity)
if (transformAtScroll === 'none' || transformAtScroll === '') {
  errors.push(`hero bg transform did not respond to scroll: "${transformAtScroll}"`)
}
if (Number(opacityAtScroll) >= 0.99) {
  errors.push(`hero bg opacity did not fade on scroll: "${opacityAtScroll}"`)
}

await page.emulateMedia({ reducedMotion: 'reduce' })
await page.evaluate(() => document.querySelector('main')?.scrollTo({ top: 0 }))
await page.waitForTimeout(100)
await page.evaluate(() => document.querySelector('main')?.scrollTo({ top: 400 }))
await page.waitForTimeout(200)
const transformReducedMotion = await heroBg.evaluate((el) => getComputedStyle(el).transform)
const opacityReducedMotion = await heroBg.evaluate((el) => getComputedStyle(el).opacity)
if (transformReducedMotion !== 'none') {
  errors.push(`hero bg transform NOT suppressed under prefers-reduced-motion: "${transformReducedMotion}"`)
}
if (Number(opacityReducedMotion) >= 0.99) {
  errors.push(`hero bg opacity fade unexpectedly disabled under prefers-reduced-motion: "${opacityReducedMotion}"`)
}
await page.emulateMedia({ reducedMotion: 'no-preference' })

// Mobile viewport check
await page.setViewportSize({ width: 375, height: 800 })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.screenshot({ path: `${OUT}/09-mobile.png`, fullPage: true })
await page.setViewportSize({ width: 1280, height: 800 })

// Animanga/Music list pages (Phase 4) -- each on ListPageTemplate (Overview/List/Stats tabs).
// Mostly empty data at this point, so this checks rendering/wiring, not real CRUD round-trips.
const animangaRoutes = [
  '/animanga',
  '/anime',
  '/manga',
  '/characters',
  '/openings',
  '/endings',
  '/soundtracks',
  '/music',
  '/music/artists',
  '/music/albums',
  '/music/tracks',
]
for (const route of animangaRoutes) {
  await page.goto(`${URL}${route}`, { waitUntil: 'networkidle' })
  const slug = route === '/' ? 'root' : route.replace(/^\//, '').replace(/\//g, '-')
  await page.screenshot({ path: `${OUT}/list-${slug}.png` })
  // Artists is the only collection with real seed data -- flip through its tabs+view modes.
  if (route === '/music/artists') {
    await page.getByRole('tab', { name: 'List' }).click()
    await page.waitForTimeout(150)
    await page.screenshot({ path: `${OUT}/list-${slug}-list-tab.png` })
    await page.getByRole('tab', { name: 'Stats' }).click()
    await page.waitForTimeout(150)
    await page.screenshot({ path: `${OUT}/list-${slug}-stats-tab.png` })
  }
}

console.log('CONSOLE_ERRORS:', JSON.stringify(errors))
await browser.close()
