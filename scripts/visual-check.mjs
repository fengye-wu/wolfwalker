import { chromium } from 'playwright-core';

const baseUrl = process.env.SITE_URL || 'http://127.0.0.1:4174';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true
});

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const revealPage = async (page) => {
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight * 0.8, 500);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(900);
};

try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  await context.addInitScript(() => {
    localStorage.removeItem('wolfwalker-locale');
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  // 无 localStorage 时应回落到中文
  const defaultLocale = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    aboutHeading: document
      .querySelector('.home-about__copy h2')
      ?.textContent?.trim()
  }));
  assert(
    defaultLocale.lang === 'zh-CN' &&
      defaultLocale.aboutHeading?.includes('轻装简行'),
    `Default locale should be Chinese: ${JSON.stringify(defaultLocale)}`
  );

  const homeMetrics = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('header button')]
      .map((button) => {
        const rect = button.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width };
      })
      .filter((button) => button.width > 0);
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
    homeMetrics.buttons.length === 1 &&
      homeMetrics.buttons.every(
        (button) => button.left >= 0 && button.right <= homeMetrics.innerWidth
      ),
    `Header controls outside viewport: ${JSON.stringify(homeMetrics.buttons)}`
  );
  assert(
    (await page.locator('.home-hero img').count()) >= 2,
    'Home hero images are missing'
  );
  assert(
    await page.locator('#site-footer').isVisible(),
    'Shared site footer is missing on home'
  );
  assert(
    (await page.locator('header.site-header').count()) === 1 &&
      (await page.locator('footer.site-footer').count()) === 1,
    'Home should render one shared header and one shared footer'
  );

  await page.locator('.site-menu-button').click();
  assert(
    await page.locator('.site-mobile-nav').isVisible(),
    'Mobile navigation did not open'
  );
  await revealPage(page);
  await page.screenshot({
    path: 'artifacts/home-common-zh-mobile.png',
    fullPage: true
  });
  await page.locator('.site-mobile-nav button').click();
  await page.waitForFunction(() =>
    document.documentElement.lang === 'en' &&
    document.querySelector('.home-about__copy h2')?.textContent?.includes('Travel light') &&
    document.querySelector('header')?.textContent?.includes('Home') &&
    document.querySelector('footer')?.textContent?.includes('Product Categories')
  );
  await revealPage(page);
  await page.waitForTimeout(350);
  await page.screenshot({
    path: 'artifacts/home-common-en-mobile.png',
    fullPage: true
  });
  await page.locator('.site-mobile-nav button').click();
  await page.waitForFunction(() =>
    document.documentElement.lang === 'zh-CN' &&
    document.querySelector('.home-about__copy h2')?.textContent?.includes('轻装简行') &&
    document.querySelector('header')?.textContent?.includes('首页') &&
    document.querySelector('footer')?.textContent?.includes('产品分类')
  );

  // 商品标题按语言不同，这里显式锁定英文，不依赖默认语言
  const enContext = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  await enContext.addInitScript(() => {
    localStorage.setItem('wolfwalker-locale', 'en');
  });
  const enPage = await enContext.newPage();

  await enPage.goto(`${baseUrl}/product/sleepingpad/17`, {
    waitUntil: 'domcontentloaded'
  });
  const detailMetrics = await enPage.evaluate(() => ({
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
  await enPage.screenshot({
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
    await enPage.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
    assert(
      (await enPage.locator('h1').first().textContent())?.trim() ===
        expectedTitle,
      `Route ${path} did not resolve to ${expectedTitle}`
    );
  }

  // 中文默认下同一批路由也应解析到对应中文标题
  const zhRouteCases = [
    ['/product/tent/2', '中号充气帐篷'],
    ['/product/sleepingpad/17', 'V型气垫'],
    ['/product/accessories/7', '小泵']
  ];
  for (const [path, expectedTitle] of zhRouteCases) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
    assert(
      (await page.locator('h1').first().textContent())?.trim() ===
        expectedTitle,
      `Route ${path} did not resolve to ${expectedTitle} in Chinese`
    );
  }
  await enContext.close();

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

  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  await desktopContext.addInitScript(() => {
    localStorage.removeItem('wolfwalker-locale');
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(500);
  await revealPage(desktopPage);
  await desktopPage.screenshot({
    path: 'artifacts/home-common-zh-1440.png',
    fullPage: true
  });
  await desktopPage.locator('button.home-tool').click();
  await desktopPage.waitForFunction(() =>
    document.documentElement.lang === 'en' &&
    document.querySelector('.home-about__copy h2')?.textContent?.includes('Travel light') &&
    document.querySelector('header')?.textContent?.includes('Home') &&
    document.querySelector('footer')?.textContent?.includes('Product Categories')
  );
  await revealPage(desktopPage);
  await desktopPage.screenshot({
    path: 'artifacts/home-common-en-1440.png',
    fullPage: true
  });

  const sharedLayoutRoutes = ['/', '/product', '/AboutUs', '/contact'];
  for (const path of sharedLayoutRoutes) {
    await desktopPage.goto(`${baseUrl}${path}`, {
      waitUntil: 'domcontentloaded'
    });
    assert(
      (await desktopPage.locator('header.site-header').count()) === 1 &&
        (await desktopPage.locator('footer.site-footer').count()) === 1,
      `Route ${path} should render exactly one shared header and footer`
    );
  }
  await desktopContext.close();

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
        ],
        sharedLayoutRoutes,
        defaultLocale,
        locales: ['zh-CN', 'en']
      },
      null,
      2
    )
  );
  await context.close();
} finally {
  await browser.close();
}
