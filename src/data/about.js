// 关于我们页（品牌介绍）文案与图片。设计稿：蓝湖「品牌介绍」（1920×9871）。
// 页面图片统一从阿里云 OSS 的 images/about 目录加载。
//
// 分类胶囊复用 products.js 的 categories（名称/顺序/跳转一处维护），
// 黄色图标按分类 key 映射到切图。

const ABOUT_OSS_BASE_URL = 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/about'
const aboutAsset = (fileName) => `${ABOUT_OSS_BASE_URL}/${fileName}`

const hero = aboutAsset('hero.png')
const calligraphy = aboutAsset('calligraphy.png')
const card10yrs = aboutAsset('card-10yrs.png')
const cardSales = aboutAsset('card-sales.png')
const cardChannels = aboutAsset('card-channels.png')
const cardPatents = aboutAsset('card-patents.png')
const outdoorchair = aboutAsset('outdoor-chair.jpg')
const imgTent = aboutAsset('tent.jpg')
const imgAirpad = aboutAsset('airpad.jpg')
const imgAirsofa = aboutAsset('airsofa.jpg')
const imgFoampad = aboutAsset('foampad.jpg')
const imgNeckPillow = aboutAsset('NeckPillow.jpg')
const imgAccessories = aboutAsset('accessories.jpg')
const bg = aboutAsset('bg.png')
const certificates = aboutAsset('certificates.png')
const mountain = aboutAsset('mountain.jpg')
const icon5 = aboutAsset('icon-5.png')
const icon6 = aboutAsset('icon-6.png')
const iconClock = aboutAsset('icon-3.png')
const iconCoin = aboutAsset('icon-2.png')
const iconPlane = aboutAsset('icon-4.png')
const iconBook = aboutAsset('icon-1.png')
const bg1 = aboutAsset('1.png')
const bg2 = aboutAsset('2.png')
const bg3 = aboutAsset('3.png')
const bg4 = aboutAsset('4.png')
const bg5 = aboutAsset('5.png')
const bg6 = aboutAsset('6.png')
const bg7 = aboutAsset('7.png')
const bg8 = aboutAsset('8.png')
const logo = aboutAsset('logo.png')

export const aboutImages = {
  hero,
  calligraphy,
  // 「从帐篷到充气垫」白底区的雪山云海背景
  bg,
  // Hero 玻璃卡顶部的品牌字标（红狼头 + 深色字，卡内照片背景偏亮）
  logo,
  cards: [card10yrs, cardSales, cardChannels, cardPatents],
  certificates,
  mountain,
}

// 渠道 logo（bg1~bg6：抖音商城/Facebook/京东/拼多多/Amazon/淘宝）
export const channelLogos = [
  { name: '抖音商城', image: bg1 },
  { name: 'Facebook', image: bg2 },
  { name: '京东', image: bg3 },
  { name: '拼多多', image: bg4 },
  { name: 'Amazon', image: bg5 },
  { name: '淘宝', image: bg6 },
  { name: '天猫', image: bg7 },
  { name: '阿里巴巴', image: bg8 },
]

// Hero 玻璃卡内容是设计稿固定的图形与文字（书法字为位图、副题本就是英文、
// 创立信息中英两行并排展示），不参与双语切换 —— zh/en 都渲染同一份。
// CTA 文案原也固定为「探索产品」，现按需求随语言切换，移到 aboutCopy.heroCta。
export const heroFixedContent = {
  sub: 'Free Yourself, Travel Without Borders',
  founded: '创立于2015 · 十年户外品牌',
  foundedEn: 'Founded in 2015 & A Decade of Outdoor Excellence',
}

// 分类胶囊图标映射（key 与 products.js 的 categories 一致）
export const categoryIcons = {
  tent: icon5,
  airpad: icon5,
  foampad: icon5,
  sofa: icon6,
  NeckPillow: icon5,
  accessories: icon6,
  tableAndchair: icon6,
}

// 「从帐篷到充气垫」区：左侧大图随激活分类切换，右侧按钮列表。
// 顺序即设计稿按钮顺序（山野帐篷→…→便携桌椅），key 与 products.js
// 的 categories 枚举一致（NeckPillow 大小写照抄）。7 张 OSS 图片已逐张
// 核对过内容与分类语义一一对应，直接按 key 挂载。
export const outdoorCategories = [
  { key: 'tent', zh: '山野帐篷', en: 'tent', image: imgTent },
  { key: 'airpad', zh: '充气卧垫', en: 'airpad', image: imgAirpad },
  { key: 'foampad', zh: '绵护睡垫', en: 'foampad', image: imgFoampad },
  { key: 'airsofa', zh: '户外软座', en: 'airsofa', image: imgAirsofa },
  { key: 'NeckPillow', zh: '舒柔枕头', en: 'neckpillow', image: imgNeckPillow },
  { key: 'accessories', zh: '随行配件', en: 'accessories', image: imgAccessories },
  { key: 'outdoorchair', zh: '便携桌椅', en: 'outdoorchair', image: outdoorchair },
]

const cardList = (label10yrs, labelSales, labelChannels, labelPatents) => [
  { value: '10 YRS', en: 'Brand Development', label: label10yrs, image: card10yrs, icon: iconClock },
  { value: '¥100M+', en: 'Annual Sales', label: labelSales, image: cardSales, icon: iconCoin },
  { value: '100+', en: 'Sales Channels', label: labelChannels, image: cardChannels, icon: iconPlane },
  { value: '100+', en: 'Product Patents', label: labelPatents, image: cardPatents, icon: iconBook },
]

export const aboutCopy = {
  zh: {
    heroTags: ['large area', 'support', 'sunscreen', 'major'],

    heroCta: '探索产品',

    decadeTitle: '十年品牌 专注户外出行体验',
    decadeLines: [
      '狼行者创立于2015年，至今已走过十年历程，',
      '而我们的制造根基——祁门昆腾户外用品有限公司，则拥有十一年的实体制造经验。',
      '十年间，我们从一家专注户外装备的品牌，',
      '成长为集自主研发、生产制造与全球化销售于一体的综合性户外品牌。',
    ],

    cards: cardList('十年品牌历程', '一亿年销售额', '全球渠道覆盖', '自主研发专利'),

    filmEyebrow: 'WOLFWALKER 品牌影像',
    filmTitle: '走进我们的户外世界',

    outdoorTitle: '从帐篷到充气垫丨我们更懂户外',

    globalTitle: '全球布局 · 权威认可',
    globalSub: 'Global Reach · Trusted Worldwide',

    industryTitle: '行业认可 · 实力见证',
    industrySub: 'Industry Recognition · Proven Strength',
  },

  en: {
    heroTags: ['large area', 'support', 'sunscreen', 'major'],

    heroCta: 'Explore Products',

    decadeTitle: 'A Decade of Dedication to the Outdoors',
    decadeLines: [
      'Wolfwalker was founded in 2015 — a decade of journey so far.',
      'Our manufacturing roots, Qimen Kunteng Outdoor Products Co., Ltd., carry eleven years of hands-on manufacturing experience.',
      'Over the decade we have built deep expertise and a complete system of R&D, production and sales.',
      'Today we are a comprehensive outdoor brand integrating independent R&D, manufacturing and global sales.',
    ],

    cards: cardList(
      'A decade of branding',
      '¥100M+ annual sales',
      'Global channel coverage',
      'Independent patents'
    ),

    filmEyebrow: 'WOLFWALKER BRAND FILM',
    filmTitle: 'Step into our world',

    outdoorTitle: 'From Tents to Air Pads | We Know the Outdoors',

    globalTitle: 'Global Reach · Trusted Worldwide',
    globalSub: 'Global Reach · Trusted Worldwide',

    industryTitle: 'Industry Recognition · Proven Strength',
    industrySub: 'Industry Recognition · Proven Strength',
  },
}
