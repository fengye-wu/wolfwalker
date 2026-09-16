// 关于我们页（品牌介绍）文案与图片。设计稿：蓝湖「品牌介绍」（1920×9871）。
// 图片已从设计稿切出/裁剪到 src/images/about/（上线前可迁 OSS，方式同 factory.js）。
//
// 分类胶囊复用 products.js 的 categories（名称/顺序/跳转一处维护），
// 黄色图标按分类 key 映射到切图。

import hero from '../images/about/hero.png'
import calligraphy from '../images/about/calligraphy.png'
import card10yrs from '../images/about/card-10yrs.png'
import cardSales from '../images/about/card-sales.png'
import cardChannels from '../images/about/card-channels.png'
import cardPatents from '../images/about/card-patents.png'
import outdoorchair from '../images/about/outdoor-chair.jpg'
import imgTent from '../images/about/tent.jpg'
import imgAirpad from '../images/about/airpad.jpg'
import imgAirsofa from '../images/about/airsofa.jpg'
import imgFoampad from '../images/about/foampad.jpg'
import imgNeckPillow from '../images/about/NeckPillow.jpg'
import imgAccessories from '../images/about/accessories.jpg'
// 全球布局区的渠道 logo 切图（蓝湖按 1-8 编号，与设计稿顺序一致）：
// 抖音商城 / Facebook / 京东 / 拼多多 / Amazon / 淘宝 / 天猫 / 阿里巴巴国际站
import bg from '../images/about/bg.png'
import worldMap from '../images/about/world-map.png'
import channels from '../images/about/world-map.png'
import certificates from '../images/about/certificates.png'
import mountain from '../images/about/mountain.png'
import icon5 from '../images/about/icon-5.png'
import icon6 from '../images/about/icon-6.png'
// 蓝湖切图文件编号与图形错位（已核对实际像素）：icon-3=时钟、icon-2=钱币、
// icon-4=飞机、icon-1=书。这里按图形语义重命名，别按编号想当然。
import iconClock from '../images/about/icon-3.png'
import iconCoin from '../images/about/icon-2.png'
import iconPlane from '../images/about/icon-4.png'
import iconBook from '../images/about/icon-1.png'
import bg1 from '../images/about/1.png'
import bg2 from '../images/about/2.png'
import bg3 from '../images/about/3.png'
import bg4 from '../images/about/4.png'
import bg5 from '../images/about/5.png'
import bg6 from '../images/about/6.png'
import bg7 from '../images/about/7.png'
import bg8 from '../images/about/8.png'
import logo from '../images/about/logo.png'

export const aboutImages = {
  hero,
  calligraphy,
  // 「从帐篷到充气垫」白底区的雪山云海背景
  bg,
  // Hero 玻璃卡顶部的品牌字标（红狼头 + 深色字，卡内照片背景偏亮），
  // 直接复用公共头部的 OSS 资源，不另存一份
  logo,
  cards: [card10yrs, cardSales, cardChannels, cardPatents],
  worldMap,
  channels,
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
export const heroFixedContent = {
  sub: 'Free Yourself, Travel Without Borders',
  founded: '创立于2015 · 十年户外品牌',
  foundedEn: 'Founded in 2015 & A Decade of Outdoor Excellence',
  cta: '探索产品',
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
// 的 categories 枚举一致（NeckPillow 大小写照抄）。7 张本地图已逐张
// 核对过内容与分类语义一一对应，直接按 key 挂载。
export const outdoorCategories = [
  { key: 'tent', zh: '山野帐篷', en: 'tents', image: imgTent },
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
