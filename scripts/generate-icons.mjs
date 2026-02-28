import sharp from 'sharp'

// SpendFixer brand green: #10b981
// Create a simple "SF" monogram on green background as PNG using SVG input

async function generateIcon(size, outputPath) {
  const fontSize = Math.round(size * 0.38)
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Green background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#10b981"/>
  <!-- White SF monogram -->
  <text
    x="50%"
    y="54%"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${fontSize}"
    font-weight="800"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="-2"
  >SF</text>
</svg>`.trim()

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath)

  console.log(`Generated ${outputPath} (${size}x${size})`)
}

await generateIcon(192, 'public/icon-192.png')
await generateIcon(512, 'public/icon-512.png')

console.log('Done!')
