#!/usr/bin/env node
/**
 * Generates /public/og-image.png (1200x630)
 * Design: dark brand background (#0f172a), SpendFixer logo text centered,
 * tagline below, green accent bar at top.
 *
 * Run: node scripts/generate-og-image.js
 * Requires: npm install canvas (or use sharp)
 *
 * If canvas isn't available, the SVG fallback at /public/og-image.svg
 * can be manually converted with: npx svgexport public/og-image.svg public/og-image.png 1200:630
 */

import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/og-image.png')

const W = 1200
const H = 630

const canvas = createCanvas(W, H)
const ctx = canvas.getContext('2d')

// Background
ctx.fillStyle = '#0f172a'
ctx.fillRect(0, 0, W, H)

// Accent bar
const grad = ctx.createLinearGradient(0, 0, W, 0)
grad.addColorStop(0, '#16a34a')
grad.addColorStop(1, '#22c55e')
ctx.fillStyle = grad
ctx.fillRect(0, 0, W, 8)

// Logo text
ctx.fillStyle = '#ffffff'
ctx.font = 'bold 80px sans-serif'
ctx.textAlign = 'center'
ctx.fillText('SpendFixer', W / 2, H / 2 - 30)

// Tagline
ctx.fillStyle = '#94a3b8'
ctx.font = '32px sans-serif'
ctx.fillText('Fix Your Spending in 60 Seconds a Day', W / 2, H / 2 + 50)

// URL
ctx.fillStyle = '#475569'
ctx.font = '24px sans-serif'
ctx.fillText('spendfixer.com', W / 2, H - 60)

writeFileSync(OUT, canvas.toBuffer('image/png'))
console.log('✅ og-image.png written to', OUT)
