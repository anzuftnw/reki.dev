// Maps a fenced code block's language tag to its Shiki language bundle. Extend as new
// languages show up in posts -- keeps the highlighter from bundling every language upfront.
// (Typed `any` deliberately: these are passed straight through to shiki's loadLanguage(),
// which accepts the raw dynamic-import promise per its own docs -- no need to chase its
// internal MaybeModule<...> generic here.)
export const LANG_LOADERS: Record<string, () => Promise<any>> = {
  ts: () => import('shiki/langs/typescript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  js: () => import('shiki/langs/javascript.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  shell: () => import('shiki/langs/shellscript.mjs'),
  sh: () => import('shiki/langs/shellscript.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
  rs: () => import('shiki/langs/rust.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  py: () => import('shiki/langs/python.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  yml: () => import('shiki/langs/yaml.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  md: () => import('shiki/langs/markdown.mjs'),
  toml: () => import('shiki/langs/toml.mjs'),
}

const FENCE_RE = /^```([\w-]+)/gm

/** Scans markdown for fenced code block languages we have a loader for, so only those get bundled. */
export function scanLanguages(markdown: string): string[] {
  const found = new Set<string>()
  let match: RegExpExecArray | null
  FENCE_RE.lastIndex = 0
  while ((match = FENCE_RE.exec(markdown))) {
    const lang = match[1].toLowerCase()
    if (lang in LANG_LOADERS) found.add(lang)
  }
  return [...found]
}
