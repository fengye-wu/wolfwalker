// 与 copy.categoryNames / categoryEnglish 及 categoryRoutes 逐项对应，长度必须一致。
// OSS swiper 目录现有 first / second / three / four / five 五张，这里用前四张。
export const categoryImages = [
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/first.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/second.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/three.jpg',
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/swiper/four.jpg'
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
// {content}Title / {content}Subtitle / {content}Cta / {content}ImageAlt，
// 没有 Cta 的幻灯片改为点击副标题跳转。
// 定制专区目前没有独立页面，导航栏里也是指向 /contact，这里保持一致。
const heroSlideContent = [
  { content: 'hero', to: '/AboutUs' },
  { content: 'factory', to: '/factory' },
  { content: 'classify', to: '/product' },
  { content: 'customization', to: '/contact' },
  { content: 'contact', to: '/contact' }
];

export const heroSlides = sectionImages.map((image, index) => ({
  image,
  ...heroSlideContent[index]
}));

export const categoryRoutes = [
  'tent',
  'accessories',
  'tableAndchair',
  'sleepingpad'
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
    classifyTitle: '轻装上阵,景在眼前',
    classifySubtitle: '轻量化装备,让每一步都从容',
    customizationTitle: '你的风格，我们来实现',
    customizationSubtitle: '专属定制方案，灵活起订，品质如一',
    contactTitle: '让合作，从一次沟通开始',
    contactSubtitle: '欢迎联系我们获取定制方案',
    classifyImageAlt: 'Wolf Walker 轻量化户外装备',
    customizationImageAlt: 'Wolf Walker 定制服务',
    contactImageAlt: 'Wolf Walker 联系我们',
    aboutTitle: '轻装简行，\n享受户外生活',
    aboutEnglish: 'TRAVEL LIGHT AND ENJOY\nOUTDOOR LIFE',
    aboutBody:
      '狼行者户外（WolfWalker Outdoor） 始创于2015年，是一家集研发、生产、\n 销售与服务于一体的综合性户外装备 \n品牌。我们专注于“为多元户外户外生活\n提供专业解决方案”，产品线覆盖公\n园休闲......',
    more: '查看更多',
    categoryLabel: 'PRODUCT CATEGORY',
    categoryTitle: '多元户外装备\n露营 / 徒步 / 越野全覆盖',
    categoryNames: ['帐篷产品', '徒步产品', '骑行产品', '睡袋产品'],
    categoryEnglish: [
      'Tent & Awning',
      'Hiking Gear',
      'Off-road Cycling',
      'Sleeping Bags'
    ],
    brandEyebrow:
      'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/logo-write.png',
    brandTitle: '奔赴山野，备受热爱',
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
    brandImageAlt: '奔赴山野，备受热爱',
    carouselLabel: '品牌主题轮播'
  },
  en: {
    heroTitle: 'Walk farther The mountains answer.',
    heroSubtitle: 'Leave now for a sunset above the clouds.',
    heroCta: 'Our Story',
    factoryTitle: 'Professional factory. Proven quality.',
    factorySubtitle: 'Eleven years focused on tents and air mattresses.',
    factoryCta: 'Factory Tour',
    classifyTitle: 'Travel light, the view is right there.',
    classifySubtitle: 'Lightweight gear that keeps every step easy.',
    customizationTitle: 'Your style, built by us.',
    customizationSubtitle:
      'Bespoke programmes, flexible minimums, consistent quality.',
    contactTitle: 'Every partnership starts with a conversation.',
    contactSubtitle: 'Get in touch for a tailored proposal.',
    classifyImageAlt: 'Wolf Walker lightweight outdoor equipment',
    customizationImageAlt: 'Wolf Walker customisation service',
    contactImageAlt: 'Contact Wolf Walker',
    aboutTitle: 'Travel light,\nlive outdoors',
    aboutEnglish: 'TRAVEL LIGHT AND ENJOY\nOUTDOOR LIFE',
    aboutBody:
      'Life outside does not need to feel complicated. We focus on tents, air mattresses and practical camp equipment, combining dependable manufacturing with thoughtful design for easier journeys.',
    more: 'Our Story',
    categoryLabel: 'PRODUCT CATEGORY',
    categoryTitle:
      'Versatile outdoor gear\nfor camp, trail and off-road travel',
    categoryNames: [
      'Tents & Awnings',
      'Hiking Gear',
      'Riding Gear',
      'Sleep Systems'
    ],
    categoryEnglish: [
      'Shelter Collection',
      'Trail Collection',
      'Off-road Collection',
      'Sleep Collection'
    ],
    brandEyebrow:
      'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/logo-write.png',
    brandTitle: 'Made for the wild. Loved out there.',
    brandBody:
      'From quiet camps to demanding overland journeys, our equipment is made to support every considered escape.',
    brandAria: 'Discover the Wolf Walker story',
    brandLogoAlt: 'Wolf Walker brand mark',
    previous: 'Previous slide',
    next: 'Next slide',
    slide: 'Go to slide ',
    heroImageAlt: 'Wolf Walker outdoor brand theme',
    factoryImageAlt: 'Wolf Walker professional factory',
    bannerImageAlt: 'Wolf Walker brand imagery',
    aboutImageAlt: 'Wolf Walker factory and outdoor life',
    brandImageAlt: 'Made for the wild. Loved out there.',
    carouselLabel: 'Brand story carousel'
  }
};
