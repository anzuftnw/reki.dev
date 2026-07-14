// Generates .avif and .webp siblings for every raster image in src/assets/ (skips assets/*
// that already have both, unless the source .jpg/.png is newer). Run after adding or replacing
// any source image (e.g. dropping in a real avatar.jpg or a new banner).
import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const AVIF_QUALITY = 55
const WEBP_QUALITY = 80

const assetsDir = new URL('../src/assets/', import.meta.url).pathname
const files = await readdir(assetsDir)
const sources = files.filter((f) => /\.(jpe?g|png)$/i.test(f))

for (const file of sources) {
  const base = file.replace(/\.(jpe?g|png)$/i, '')
  const srcPath = path.join(assetsDir, file)
  const avifPath = path.join(assetsDir, `${base}.avif`)
  const webpPath = path.join(assetsDir, `${base}.webp`)

  const srcMtime = (await stat(srcPath)).mtimeMs
  const upToDate = await Promise.all(
    [avifPath, webpPath].map((p) =>
      stat(p)
        .then((s) => s.mtimeMs >= srcMtime)
        .catch(() => false),
    ),
  )
  if (upToDate.every(Boolean)) continue

  await sharp(srcPath).avif({ quality: AVIF_QUALITY }).toFile(avifPath)
  await sharp(srcPath).webp({ quality: WEBP_QUALITY }).toFile(webpPath)
  console.log(`optimized ${file} -> ${base}.avif, ${base}.webp`)
}
