// 与 copy.categoryNames / categoryEnglish 及 categoryRoutes 逐项对应，长度必须一致 ——
// 少了会渲染出没有 aria-label、img 也没有 alt 的卡片（卡面只有图，读屏就完全念不出
// 这个链接去哪），Vue 对 undefined 的属性是整条不输出，不会报错。
export const categoryImages = [
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/first.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/second.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/three.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/four.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/five.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/six.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/seven.jpg',
];

export const featureImages = {
  aboutCollage:
    'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/bg1.jpg',
  brandBanner:
    'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/bg3.jpg'
};

export const sectionImages = [
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/banner/one.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/banner/second.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/banner/three.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/banner/four.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/banner/five.jpg'
];

// 与 sectionImages 逐张对应。content 决定去 copy 里取哪一组
// {content}Title / {content}Subtitle / {content}Cta / {content}ImageAlt。
// 目前五张都配了 Cta，统一用按钮跳转；HomeView 里「没有 Cta 就把副标题做成链接」
// 那条分支现在走不到，删 Cta 时会重新生效。
const heroSlideContent = [
  { content: 'hero', to: '/AboutUs' },
  { content: 'factory', to: '/factory' },
  { content: 'classify', to: '/product' },
  // 按钮文案是「定制专区」，就得去定制专区页。原来指向 /contact 是因为那时
  // 没有这个页面，现在 /custom 已经存在（header.js 的同名菜单也指向它）。
  { content: 'customization', to: '/custom' },
  { content: 'contact', to: '/contact' }
];

export const heroSlides = sectionImages.map((image, index) => ({
  image,
  ...heroSlideContent[index]
}));

// 每个 key 必须是 products.js 里 categories 真实存在的（现有七类：
// tent / airpad / foampad / NeckPillow / sofa / tableAndchair / accessories）。
// ProductView 对未知 key 会静默回落到「全部」，所以拼错不会报错、只会筛不出东西。
// 顺序同时决定 categoryImages 和 copy.categoryNames 的对应关系，三者一动全动。
//
// 顺序必须与 data/footer.js 的 footerRoutes.product 逐项一致 ——
// 首页分类轮播和公共底部的产品分类是同一套跳转入口，两边顺序不同
// 会出现「首页第 N 张卡和底部第 N 个链接指向不同分类」的错位感。
// 跳转目标带 #product-list：/product 页的商品列表区锚点，进页后由
// router/index.js 的 scrollBehavior 滚到商品列表，不停在满屏首屏上。
export const categoryRoutes = [
  'tent',
  'airpad',
  'foampad',
  'sofa',
  'NeckPillow',
  'tableAndchair',
  'accessories',
];

export const carouselConfig = {
  interval: 7000
};

export const copy = {
  zh: {
    heroTitle: '步履不停，山自有答',
    heroSubtitle: '即刻出发，赴一场山巅黄昏',
    heroCta: '品牌介绍',
    factoryTitle: '专业工厂，品质从优',
    factorySubtitle: '深耕帐篷气垫行业十一年',
    factoryCta: '工厂介绍',
    classifyTitle: '轻装上阵，景在眼前',
    classifySubtitle: '轻量化装备，让每一步都从容',
    classifyCta: '商品分类',
    customizationTitle: '你的风格，我们来实现',
    customizationSubtitle: '专属定制方案，灵活起订，品质如一',
    customizationCta: '定制专区',
    contactTitle: '让合作，从一次沟通开始',
    contactSubtitle: '欢迎联系我们获取定制方案',
    contactCta: '联系我们',
    classifyImageAlt: 'Wolf Walker 轻量化户外装备',
    customizationImageAlt: 'Wolf Walker 定制服务',
    contactImageAlt: 'Wolf Walker 联系我们',
    aboutTitle: '轻装简行，\n享受户外生活',
    aboutEnglish: 'TRAVEL LIGHT AND ENJOY\nOUTDOOR LIFE',
    // 这段渲染在 .home-about__copy p 里，没有 white-space: pre-line，
    // 原文里那七个 \n 不会换行、只会塌成多余的空格，所以全部去掉，
    // 换行交给 max-width: 340px。另外原文「多元户外户外生活」重复了一个词，
    // 末尾停在「公园休闲......」没说完，这里补完整。
    aboutBody:
      '狼行者户外（WolfWalker Outdoor）始创于 2015 年，是一家集研发、生产、销售与服务于一体的综合性户外装备品牌。我们专注于为多元户外生活提供专业解决方案，产品线覆盖公园休闲、露营过夜、徒步远行与越野骑行。',
    more: '查看更多',
    categoryLabel: 'PRODUCT CATEGORY',
    categoryTitle: '多元户外装备\n露营 / 徒步 / 越野全覆盖',
    // 逐项对应 categoryRoutes 的 tent / airpad / foampad / sofa / NeckPillow /
    // tableAndchair / accessories。叫法直接用 categories 里的标准名，与底部
    // productLinks、商品卡角标同词，不另起「帐篷产品」这类别名。
    // 改任何一项都要同步核对 categoryRoutes 同下标的 key。
    categoryNames: [
      '山野帐篷',
      '充气卧垫',
      '棉护睡垫',
      '户外软座',
      '舒柔枕头',
      '便携桌椅',
      '随行配件'
    ],
    categoryEnglish: [
      'Backcountry Tents',
      'Inflatable Sleeping Mats',
      'Foam Sleeping Pads',
      'Camp Seating',
      'Camp Pillows',
      'Portable Tables & Chairs',
      'Trail Accessories'
    ],
    brandEyebrow:
      'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/logo-write.png',
    brandTitle: '奔赴山野，备妥热爱',
    brandBody:
      '无论是草坪野餐的松弛露营，翻山越岭的徒步探索，还是驰骋路况的越野出行，一套趁手耐用的装备，',
    brandBody2:
      '是奔赴自然最好的底气。用心打磨每一件产品，兼顾实用质感与长久耐用，用可靠装备守护你的每一次远行。',
    brandBody3:
      '放下生活琐碎，奔赴山野旷野，我们备好全套好物，接住你所有藏在心底、奔赴自然的热爱。',
    brandAria: '了解 Wolf Walker 品牌故事',
    brandLogoAlt: 'Wolf Walker 品牌标识',
    previous: '上一张',
    next: '下一张',
    slide: '切换到第',
    heroImageAlt: 'Wolf Walker 户外品牌主题',
    factoryImageAlt: 'Wolf Walker 专业工厂',
    bannerImageAlt: 'Wolf Walker 品牌形象',
    aboutImageAlt: 'Wolf Walker 工厂与户外生活',
    brandImageAlt: '奔赴山野，备妥热爱',
    carouselLabel: '品牌主题轮播'
  },
  en: {
    // 原文缺了句中的句号，读成一句会连在一起
    heroTitle: 'Keep walking. The mountains answer',
    heroSubtitle: 'Set out now for dusk on the summit',
    heroCta: 'Our Story',
    factoryTitle: 'Our own factory. Quality we can prove',
    factorySubtitle: 'Eleven years focused on tents and air mattresses',
    factoryCta: 'Factory Tour',
    classifyTitle: 'Pack light, the view comes closer',
    classifySubtitle: 'Lightweight gear that keeps every step unhurried',
    // 对应中文的「商品分类 / 定制专区 / 联系我们」。
    // 与 header 导航同名的三项沿用导航里的英文（Products / Custom / Contact Us），
    // 免得同一个去处在站内出现两种叫法。
    classifyCta: 'Browse Products',
    customizationTitle: 'Your style, made real by us',
    customizationSubtitle:
      'Bespoke programmes, flexible minimums, consistent quality',
    customizationCta: 'Custom Service',
    contactTitle: 'Partnership starts with one conversation',
    contactSubtitle: 'Get in touch for a tailored proposal',
    contactCta: 'Contact Us',
    classifyImageAlt: 'Wolf Walker lightweight outdoor equipment',
    customizationImageAlt: 'Wolf Walker customisation service',
    contactImageAlt: 'Contact Wolf Walker',
    aboutTitle: 'Travel light,\nlive outdoors',
    aboutEnglish: 'TRAVEL LIGHT AND ENJOY\nOUTDOOR LIFE',
    // 原文不是中文那段的翻译，是另写的一段，公司成立年份、业务范围、
    // 产品线覆盖场景全都没有。这里改成跟中文对应。
    aboutBody:
      'Founded in 2015, WolfWalker Outdoor is an integrated outdoor equipment brand covering research, manufacturing, sales and service. We focus on professional solutions for every kind of life outdoors, with a product line spanning park downtime, overnight camping, long-distance hiking and off-road cycling',
    more: 'Learn More',
    categoryLabel: 'PRODUCT CATEGORY',
    categoryTitle:
      'Versatile outdoor gear\nfor camp, trail and off-road travel',
    // 这两组只进 aria-label / alt，卡面上不显示文字（早先的注释说「两行叠着显示」，
    // 已经不是现在的实现）。英文版两组内容相同，HomeView 里会去重，读屏不会念两遍。
    // 同样逐项对应 categoryRoutes，改动要跟着核对 key。
    categoryNames: [
      'Tent & Awning',
      'Camp Accessories',
      'Tables & Chairs',
      'Inflatable Sleeping Mats',
      'Inflatable Sofas',
      'Tables & Chairs',
      'Camp Accessories'
    ],
    categoryEnglish: [
      'Tent & Awning',
      'Camp Accessories',
      'Tables & Chairs',
      'Inflatable Sleeping Mats',
      'Inflatable Sofas',
      'Tables & Chairs',
      'Camp Accessories'
    ],
    brandEyebrow:
      'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/logo-write.png',
    // 「备受热爱」→「备妥热爱」：从被动的「广受喜爱」改成主动的「把热爱也备齐」，
    // 和上下文「备好全套好物」的「备」字扣上。英文跟着从 carried by（被它带着走）
    // 换成 packed and ready（连热爱一起打包备好），双关落在 pack 上 —— 装备要打包，
    // 热爱也一并打包。句号去掉，与本节其余文案一致。
    brandTitle: 'Into the wild, love packed and ready',
    // 中文是三行、英文原来只有一行 —— brandBodyLines 会把空值过滤掉，
    // 于是两个语言的这一屏高度和节奏都不一样。补齐成对应的三行。
    brandBody:
      'A picnic on the grass, a climb over ridge after ridge, or a run across broken ground — whatever the trip, gear that is ready to hand and built to last',
    brandBody2:
      'is the surest footing for heading into nature. We work over every product with care, balancing real usability against long service life, so reliable kit looks after each journey you take',
    brandBody3:
      'Set the small stuff down and head for open country. We have the full kit ready, waiting for all that quiet love of the outdoors you have been holding on to',
    brandAria: 'Discover the Wolf Walker story',
    brandLogoAlt: 'Wolf Walker brand mark',
    previous: 'Previous slide',
    next: 'Next slide',
    slide: 'Go to slide ',
    heroImageAlt: 'Wolf Walker outdoor brand theme',
    factoryImageAlt: 'Wolf Walker professional factory',
    bannerImageAlt: 'Wolf Walker brand imagery',
    aboutImageAlt: 'Wolf Walker factory and outdoor life',
    brandImageAlt: 'Into the wild, love packed and ready',
    carouselLabel: 'Brand story carousel'
  }
};
