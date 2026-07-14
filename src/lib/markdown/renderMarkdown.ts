import { Marked } from 'marked'
import { scanLanguages } from './languages'
import { ensureLanguagesLoaded, highlightCode } from './shiki'

/**
 * Renders post/project markdown to HTML, syntax-highlighting fenced code blocks via Shiki.
 * Dynamically imported (`import('@/lib/markdown/renderMarkdown')`) from routes that actually
 * render markdown -- keep it out of list-page bundles.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const highlighter = await ensureLanguagesLoaded(scanLanguages(markdown))

  const marked = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      code({ text, lang }) {
        return highlightCode(highlighter, text, lang?.split(/\s+/)[0])
      },
    },
  })

  return marked.parse(markdown, { async: false })
}
