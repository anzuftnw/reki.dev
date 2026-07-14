// One-off: rasterizes a simple initials placeholder so `avatar.jpg` exists at all.
// Replace src/assets/avatar.jpg with a real photo whenever you have one, then re-run
// `bun run optimize-images` -- no code changes needed, About.tsx already points at this path.
import sharp from 'sharp'

const SIZE = 512

const svg = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${SIZE}" height="${SIZE}" fill="#fdf6f2" />
  <text x="50%" y="53%" text-anchor="middle" dominant-baseline="middle"
    font-family="Instrument Sans, system-ui, sans-serif" font-size="${SIZE * 0.36}" font-weight="600"
    fill="#b3654a">rk</text>
</svg>
`

await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(new URL('../src/assets/avatar.jpg', import.meta.url).pathname)
console.log('wrote src/assets/avatar.jpg')
