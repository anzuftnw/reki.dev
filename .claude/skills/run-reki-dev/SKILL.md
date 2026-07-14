---
name: run-reki-dev
description: Launch the reki.dev Solid.js dev server and drive it with Playwright to visually verify UI changes (screenshots, console errors). Use whenever asked to run, screenshot, or verify a UI/CSS/component change in this repo.
---

# Running and verifying reki.dev

Solid.js + Vite app. No `tailwind.config.js` — theme lives in `src/styles/tokens.css` `@theme` block (imported by `src/styles/index.css` alongside `base.css`).

## Dev server

```bash
bun run dev &
echo $! > /tmp/reki-dev.pid
timeout 30 bash -c 'until curl -sf http://localhost:5173 >/dev/null || curl -sf http://localhost:5174 >/dev/null; do sleep 1; done'
```

Vite auto-picks the next free port if 5173 is taken (frequently 5174 if another
instance is still running) — check the `vite` stdout for the actual `Local:` URL
rather than assuming 5173.

Stop with `kill $(cat /tmp/reki-dev.pid)` or `pkill -f vite` before relaunching.

## Driving it

`playwright` is a devDependency (browsers already cached at
`~/.cache/ms-playwright`, no `playwright install` needed). No `chromium-cli` in
this environment — use the driver script directly:

```bash
SHOT_DIR=/path/to/scratchpad/shots APP_URL=http://localhost:5174 bun run scripts/drive.mjs
```

`scripts/drive.mjs` is a standing driver (not part of the app build) that:
covers home page, sidebar collapse/hidden/expanded cycle, nav-row tooltip hover,
theme cycle, the Settings admin-login modal (open/Escape-close), and a 375px
mobile viewport. It prints `CONSOLE_ERRORS: [...]` at the end — **always check
this is `[]`** before trusting a screenshot; a page can render its shell while
JS throws underneath. Screenshots land in `$SHOT_DIR/NN-*.png`; read them with
the Read tool to actually look, don't just check they exist.

Extend `drive.mjs` in place for new flows rather than writing a one-off script
each time.

## Gotchas hit here

- **Ambiguous `getByRole('link', { name })` selectors.** The TopBar breadcrumb
  renders the current page name via Kobalte's `Breadcrumbs.Link as="span"`,
  which still carries `role="link"` even though it's not a real anchor and has
  no navigation behavior. If a sidebar nav item has the same label as the
  current breadcrumb (e.g. both say "Home"), `getByRole('link', {name}).first()`
  silently grabs the breadcrumb instead of the sidebar row. Scope selectors to
  a container instead, e.g. `nav[aria-label="Primary"] a[href="/"]`.
- **Kobalte `Collapsible` unmounts its content when closed** (not just
  `display:none`/width-collapsed) — text inside a collapsed
  `Collapsible.Content` is fully removed from the DOM/accessibility tree, not
  just visually hidden. Icon-only sidebar rows rely on an explicit
  `aria-label` on the row itself (not just the tooltip) for exactly this
  reason — don't remove those aria-labels when touching `NavRow.tsx`.
