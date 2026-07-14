import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { LANG_LOADERS } from './languages'

// Dual-theme mode (`defaultColor: false`) emits --shiki-light/--shiki-dark vars per token instead of
// baking one theme's colors in -- see the `.shiki` rule in base.css for how those get wired to
// this app's light-dark()/[data-theme] mechanism.
const THEMES = { light: 'github-light', dark: 'github-dark' } as const

// JS regex engine instead of the default WASM oniguruma one -- no WASM download, smaller/faster
// for a bundle that's supposed to stay lean.
let highlighterPromise: Promise<HighlighterCore> | null = null
const loadedLangs = new Set<string>()

function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
      langs: [],
      engine: createJavaScriptRegexEngine(),
    })
  }
  return highlighterPromise
}

/** Loads only the languages actually used in a given post, then returns the shared highlighter. */
export async function ensureLanguagesLoaded(langs: string[]): Promise<HighlighterCore> {
  const highlighter = await getHighlighter()
  const toLoad = langs.filter((lang) => !loadedLangs.has(lang))
  if (toLoad.length > 0) {
    await highlighter.loadLanguage(...toLoad.map((lang) => LANG_LOADERS[lang]()))
    toLoad.forEach((lang) => loadedLangs.add(lang))
  }
  return highlighter
}

/** Synchronous once the highlighter has the requested language loaded (see ensureLanguagesLoaded). */
export function highlightCode(highlighter: HighlighterCore, code: string, lang?: string): string {
  const resolvedLang = lang && lang in LANG_LOADERS ? lang : 'plaintext'
  return highlighter.codeToHtml(code, {
    lang: resolvedLang,
    themes: THEMES,
    defaultColor: false,
  })
}
