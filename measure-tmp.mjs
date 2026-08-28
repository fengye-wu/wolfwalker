import { chromium } from 'playwright-core'

const widths = [768, 776, 784, 792, 800, 816, 832, 864, 900, 960, 1008, 1023]
const browser = await chromium.launch({ channel: 'msedge' })
for (const locale of ['en', 'zh']) {
  const page = await browser.newPage()
  await page.goto('http://localhost:8888/', { waitUntil: 'load' })
  await page.evaluate((l) => localStorage.setItem('wolfwalker-locale', l), locale)
  const out = []
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 1000 })
    await page.goto('http://localhost:8888/', { waitUntil: 'load' })
    await page.waitForTimeout(450)
    const d = await page.evaluate(() => {
      const copy = document.querySelector('.home-about__copy')
      const collage = document.querySelector('.home-about__collage')
      const prev = copy.style.alignSelf
      copy.style.alignSelf = 'flex-start'
      const nat = Math.round(copy.getBoundingClientRect().height)
      copy.style.alignSelf = prev
      return {
        nat,
        col: Math.round(collage.getBoundingClientRect().height),
        actual: Math.round(copy.getBoundingClientRect().height),
      }
    })
    out.push(`${w}:nat${String(d.nat - d.col).padStart(4)}/real${String(d.actual - d.col).padStart(3)}`)
  }
  console.log(`[${locale}] ${out.join(' ')}`)
  await page.close()
}
await browser.close()
