import { computed, ref, watch } from 'vue'

const initialLocale = localStorage.getItem('wolfwalker-locale') || 'zh'
const locale = ref(initialLocale)

const dictionary = {
  en: {
    home: 'Home', products: 'Products', brand: 'Our Brand', contact: 'Contact',
    explore: 'Explore collection', discover: 'Discover the range', inquiry: 'Send an inquiry',
    allProducts: 'All products', featured: 'Featured gear', featuredCopy: 'Field-ready equipment, refined through real journeys.',
    categories: 'Categories', viewProduct: 'View product', viewAll: 'View all products', learnMore: 'Our story',
    specs: 'Specifications', overview: 'Overview', requestQuote: 'Request a quote',
    related: 'You may also like', backProducts: 'Back to products', menu: 'Open menu', close: 'Close menu',
    noProducts: 'No products found', filterAll: 'All gear', language: '中文',
    since: 'Outdoor equipment since 2012', global: 'Built for the world beyond',
    brandIntro: 'WOLFWALKER designs practical outdoor equipment for campsites, overland journeys and everyday escapes. From first sketch to final field test, we focus on comfort, compact engineering and materials that last.',
    footerText: 'Professional outdoor living equipment designed in Huangshan and made for the world.',
    navigation: 'Navigation', support: 'Support', newsletter: 'Field notes',
    newsletterCopy: 'Product releases, trade shows and field stories.', subscribe: 'Subscribe', email: 'Email address',
    rights: 'All rights reserved.', privacy: 'Privacy', terms: 'Terms',
    productCount: 'products', catalogTitle: 'Equipment for life outside',
    catalogCopy: 'Explore our complete line of shelter, sleep and camp-living solutions.',
    breadcrumbHome: 'Home', quantity: 'MOQ', leadTime: 'Lead time', customization: 'Customization',
    moqValue: '50 pieces', leadValue: '25–35 days', customValue: 'Color / Logo / Package',
    aboutTitle: 'Made close to the mountains', aboutEyebrow: 'The WOLFWALKER story',
    aboutLead: 'We build outdoor gear with an industrial mind and an explorer’s instinct.',
    playFilm: 'Play brand film', pauseFilm: 'Pause brand film',
    craftTitle: 'From Huangshan to the outdoors',
    craftText: 'Our team combines product design, material engineering and modern manufacturing under one roof. Every product moves through prototyping, pressure testing and field validation before production.',
    cultureTitle: 'Our culture', visionTitle: 'Our vision',
    cultureText: 'Stay curious. Respect nature. Make useful things. We work openly, test honestly and improve every detail that can make a night outdoors more comfortable.',
    visionText: 'To make considered outdoor living accessible across borders, and become a trusted long-term partner for retailers and adventurers worldwide.',
    values: ['Useful by design', 'Tested in the field', 'Responsible growth'],
    contactTitle: 'Let’s build the next journey', contactLead: 'Tell us what you need. Our international sales team usually replies within one business day.',
    office: 'Head office & factory', address: 'Building 2, Phase I, No. 13 Furong Road, Huangshan Economic Development Zone, Anhui, China',
    sales: 'International sales', hours: 'Monday–Friday · 08:30–17:30 CST',
    name: 'Name', company: 'Company', phone: 'Phone', message: 'How can we help?', send: 'Send message',
    formSuccess: 'Thank you. Your inquiry has been recorded.', locate: 'View larger map',
  },
  zh: {
    home: '首页', products: '商品', brand: '品牌', contact: '联系我们',
    explore: '探索产品系列', discover: '查看全部系列', inquiry: '发送询盘',
    allProducts: '全部商品', featured: '热门装备', featuredCopy: '源自真实旅途，为每一次户外生活精心打磨。',
    categories: '商品分类', viewProduct: '查看详情', viewAll: '查看全部商品', learnMore: '了解品牌',
    specs: '产品参数', overview: '产品介绍', requestQuote: '获取报价',
    related: '相关推荐', backProducts: '返回商品页', menu: '打开菜单', close: '关闭菜单',
    noProducts: '暂未找到相关商品', filterAll: '全部装备', language: 'EN',
    since: '专注户外装备，始于 2012', global: '为更远的户外而生',
    brandIntro: 'WOLFWALKER 专注于露营、越野旅行与日常户外生活装备。从第一张草图到最终实地测试，我们始终关注舒适体验、便携结构和经久耐用的材料。',
    footerText: '来自黄山的专业户外生活装备，为全球用户而设计。',
    navigation: '快捷导航', support: '客户支持', newsletter: '订阅动态',
    newsletterCopy: '获取新品、展会与户外故事。', subscribe: '订阅', email: '邮箱地址',
    rights: '保留所有权利。', privacy: '隐私政策', terms: '使用条款',
    productCount: '件商品', catalogTitle: '自在户外，装备有度',
    catalogCopy: '探索完整的帐篷、睡眠与营地生活解决方案。',
    breadcrumbHome: '首页', quantity: '起订量', leadTime: '交付周期', customization: '定制服务',
    moqValue: '50 件', leadValue: '25–35 天', customValue: '颜色 / Logo / 包装',
    aboutTitle: '生长于群山之间', aboutEyebrow: 'WOLFWALKER 品牌故事',
    aboutLead: '用工业思维制造装备，以探索本能理解户外。',
    playFilm: '播放品牌影片', pauseFilm: '暂停品牌影片',
    craftTitle: '从黄山，走向世界户外',
    craftText: '我们将产品设计、材料工程与现代制造汇聚在同一团队。每一件产品在量产前，都会经历打样、压力测试与真实环境验证。',
    cultureTitle: '企业文化', visionTitle: '企业愿景',
    cultureText: '保持好奇，尊重自然，制造真正有用的产品。我们开放协作、诚实测试，持续改善每一个让户外之夜更舒适的细节。',
    visionText: '让高品质户外生活跨越地域触手可及，成为全球零售伙伴与户外爱好者长期信赖的品牌。',
    values: ['实用设计', '实地验证', '责任成长'],
    contactTitle: '一起开启下一段旅程', contactLead: '告诉我们您的需求，国际销售团队通常会在一个工作日内回复。',
    office: '总部及工厂', address: '中国安徽省黄山市经济开发区芙蓉路13号一期2号厂房',
    sales: '国际销售', hours: '周一至周五 · 08:30–17:30（北京时间）',
    name: '姓名', company: '公司名称', phone: '联系电话', message: '请描述您的需求', send: '提交留言',
    formSuccess: '感谢您的留言，我们已记录您的询盘。', locate: '在地图中查看',
  },
}

watch(locale, (value) => {
  localStorage.setItem('wolfwalker-locale', value)
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en'
  document.title = value === 'zh' ? 'WOLFWALKER | 专业户外装备' : 'WOLFWALKER | Outdoor Equipment'
  document.querySelector('meta[name="description"]')?.setAttribute('content', value === 'zh'
    ? 'WOLFWALKER 专注帐篷、睡垫、户外家具及配件。'
    : 'Wolfwalker professional outdoor equipment for global adventures.')
}, { immediate: true })

export function useLocale() {
  const t = computed(() => dictionary[locale.value])
  const toggleLocale = () => { locale.value = locale.value === 'en' ? 'zh' : 'en' }
  return { locale, t, toggleLocale }
}
