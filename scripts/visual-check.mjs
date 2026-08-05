import { chromium } from 'playwright-core';

const baseUrl = process.env.SITE_URL || 'http://192.168.124.143:5174';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true
});

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  const homeMetrics = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('header button')].map(
      (button) => {
        const rect = button.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width };
      }
    );
    return {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      buttons
    };
  });
  assert(
    homeMetrics.scrollWidth <= homeMetrics.innerWidth,
    `Home overflows: ${JSON.stringify(homeMetrics)}`
  );
  assert(
    homeMetrics.buttons.length === 2 &&
      homeMetrics.buttons.every(
        (button) => button.left >= 0 && button.right <= homeMetrics.innerWidth
      ),
    `Header controls outside viewport: ${JSON.stringify(homeMetrics.buttons)}`
  );

  await page.locator('header button').nth(0).click();
  assert(
    await page.locator('header').getByText('首页').count(),
    'Locale switch did not update the navigation'
  );
  await page.locator('header button').nth(1).click();
  assert(
    await page.locator('header nav').last().isVisible(),
    'Mobile navigation did not open'
  );
  await page.waitForTimeout(350);
  await page.screenshot({
    path: 'artifacts/playwright-home-mobile.png',
    fullPage: false
  });

  await page.goto(`${baseUrl}/product/sleepingpad/17`, {
    waitUntil: 'domcontentloaded'
  });
  await page.locator('header button').nth(0).click();
  const detailMetrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    heading: document.querySelector('h1')?.getBoundingClientRect().toJSON(),
    title: document.querySelector('h1')?.textContent?.trim()
  }));
  assert(
    detailMetrics.scrollWidth <= detailMetrics.innerWidth,
    `Detail overflows: ${JSON.stringify(detailMetrics)}`
  );
  assert(
    detailMetrics.heading &&
      detailMetrics.heading.right <= detailMetrics.innerWidth,
    `Detail title outside viewport: ${JSON.stringify(detailMetrics.heading)}`
  );
  assert(
    detailMetrics.title === 'V-shaped Air Mat',
    `Unexpected English product title: ${detailMetrics.title}`
  );
  await page.screenshot({
    path: 'artifacts/playwright-detail-mobile.png',
    fullPage: false
  });

  const routeCases = [
    ['/product/tent/2', 'Medium Inflatable Tent'],
    ['/product/sleepingpad/17', 'V-shaped Air Mat'],
    ['/product/sofa/5', 'Serenade Solo Air Sofa'],
    ['/product/tableAndchair/5', 'Lift-back Camp Chair'],
    ['/product/accessories/7', 'Mini Pump']
  ];
  for (const [path, expectedTitle] of routeCases) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
    assert(
      (await page.locator('h1').first().textContent())?.trim() ===
        expectedTitle,
      `Route ${path} did not resolve to ${expectedTitle}`
    );
  }

  await page.goto(`${baseUrl}/product?category=tent`, {
    waitUntil: 'domcontentloaded'
  });
  assert(
    (await page.locator('article.group').count()) === 7,
    'Tent category should contain 7 products'
  );
  await page.goto(`${baseUrl}/AboutUs`, { waitUntil: 'domcontentloaded' });
  assert((await page.locator('video').count()) === 1, 'Brand video is missing');
  await page.goto(`${baseUrl}/contact`, { waitUntil: 'domcontentloaded' });
  assert(
    (await page.locator('iframe[title="Wolfwalker location map"]').count()) ===
      1,
    'Location map is missing'
  );

  console.log(
    JSON.stringify(
      {
        status: 'passed',
        homeMetrics,
        detailMetrics,
        routes: [
          '/',
          '/product?category=tent',
          ...routeCases.map(([path]) => path),
          '/AboutUs',
          '/contact'
        ]
      },
      null,
      2
    )
  );
  await context.close();
} finally {
  await browser.close();
}
