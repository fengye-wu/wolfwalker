import { computed, ref, watch } from 'vue'

// 支持四种语言：英语（默认）、中文、日语、俄语。
// 命名约定：lang code = 'en' | 'zh' | 'ja' | 'ru'；
//           对应到 <html lang> 时 zh 映射成 'zh-CN'，其余保持原样。
const SUPPORTED = ['en', 'zh', 'ja', 'ru']
const STORAGE_KEY = 'wolfwalker-locale'

const initialLocale = (() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return SUPPORTED.includes(stored) ? stored : 'en'
})()

const locale = ref(initialLocale)

// 当前 locale 对应的 <html lang> 属性值。中文映射成 'zh-CN'，
// 与既有浏览器识别习惯保持一致（Chrome/SEO 都按 zh-CN 走）。
const langAttr = (value) => (value === 'zh' ? 'zh-CN' : value)

// 切换语言时同步的元信息：title 和 meta description 都按语言给一份，
// 避免再去做运行时拼接。
const metaByLocale = {
  en: {
    title: 'WOLFWALKER | Outdoor Equipment',
    description: 'Wolfwalker professional outdoor equipment for global adventures.',
  },
  zh: {
    title: 'WOLFWALKER | 专业户外装备',
    description: 'WOLFWALKER 专注帐篷、睡垫、户外家具及配件。',
  },
  ja: {
    title: 'WOLFWALKER | アウトドア用品',
    description: 'WOLFWALKERはテント・エアマット・キャンプ家具の専門メーカーです。',
  },
  ru: {
    title: 'WOLFWALKER | Снаряжение для активного отдыха',
    description:
      'WOLFWALKER — профессиональное снаряжение для кемпинга: палатки, коврики, мебель и аксессуары.',
  },
}

// 各语言 UI 文本字典。这里只放跨页共用、文本量不大的全局词典；
// 单页面文案继续留在 data/<page>.js 里按 copy.{en,zh,ja,ru} 维护，跟原约定一致。
//
// 设计要点：
//   1. 命名保持原来的 key 不动，调用点（t.home / t.brand 等）一行不需改；
//   2. values 是数组，每条按语言分别给一份；
//   3. 按钮上「当前语言」按钮文案 currentLanguage 显示当前 locale 的本地写法（带下拉的入口）。
const dictionary = {
  en: {
    home: 'Home', products: 'Products', brand: 'Our Brand', contact: 'Contact',
    explore: 'Explore collection', discover: 'Discover the range', inquiry: 'Send an inquiry',
    allProducts: 'All products', featured: 'Featured gear', featuredCopy: 'Field-ready equipment, refined through real journeys.',
    categories: 'Categories', viewProduct: 'View product', viewAll: 'View all products', learnMore: 'Our story',
    specs: 'Specifications', overview: 'Overview', requestQuote: 'Request a quote',
    related: 'You may also like', backProducts: 'Back to products', menu: 'Open menu', close: 'Close menu',
    noProducts: 'No products found', filterAll: 'All gear',
    since: 'Outdoor equipment since 2012', global: 'Built for the world beyond',
    brandIntro: 'WOLFWALKER designs practical outdoor equipment for campsites, overland journeys and everyday escapes. From first sketch to final field test, we focus on comfort, compact engineering and materials that last.',
    footerText: 'Professional outdoor living equipment designed in Huangshan and made for the world.',
    navigation: 'Navigation', support: 'Support', newsletter: 'Field notes',
    newsletterCopy: 'Product releases, trade shows and field stories.', subscribe: 'Subscribe', email: 'Email address',
    rights: 'All rights reserved.', privacy: 'Privacy', terms: 'Terms',
    productCount: 'products', catalogTitle: 'Equipment for life outside',
    catalogCopy: 'Explore our complete line of shelter, sleep and camp-living solutions.',
    breadcrumbHome: 'Home', quantity: 'MOQ', tierPrice: 'MOQ & Price', tierNotice: 'Note: Prices vary by specification and model and are for reference only. For a detailed quotation sheet, click Request Quote to contact us.',
    leadTime: 'Lead time', customization: 'Customization',
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
    // 语言切换相关。当前按钮上展示「English」，下拉弹层里这套 label 不显示（被各语种 native label 替代）。
    currentLanguage: 'English',
    switchLanguage: 'Switch language',
    languageMenu: 'Language',
    // 搜索框 placeholder 等本来散在视图里的文案，统一搬过来
    searchProducts: 'Search products',
    fieldSystems: 'WOLFWALKER FIELD SYSTEMS',
    skuLabel: 'SKU',
    categoryLabel: 'Category',
    pcsUnit: 'pcs',
    piecesUnit: 'pieces',
    oemValue: 'OEM / ODM',
    brandCustom: 'OEM & ODM',
    pageNotFoundTitle: 'Page not found',
    pageNotFoundBody: 'The page you requested may have moved.',
    backHome: 'Back home',
    productCollectionCarousel: 'Product collection carousel',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
  },
  zh: {
    home: '首页', products: '商品', brand: '品牌', contact: '联系我们',
    explore: '探索产品系列', discover: '查看全部系列', inquiry: '发送询盘',
    allProducts: '全部商品', featured: '热门装备', featuredCopy: '源自真实旅途，为每一次户外生活精心打磨。',
    categories: '商品分类', viewProduct: '查看详情', viewAll: '查看全部商品', learnMore: '了解品牌',
    specs: '产品参数', overview: '产品介绍', requestQuote: '获取报价',
    related: '相关推荐', backProducts: '返回商品页', menu: '打开菜单', close: '关闭菜单',
    noProducts: '暂未找到相关商品', filterAll: '全部装备',
    since: '专注户外装备，始于 2012', global: '为更远的户外而生',
    brandIntro: 'WOLFWALKER 专注于露营、越野旅行与日常户外生活装备。从第一张草图到最终实地测试，我们始终关注舒适体验、便携结构和经久耐用的材料。',
    footerText: '来自黄山的专业户外生活装备，为全球用户而设计。',
    navigation: '快捷导航', support: '客户支持', newsletter: '订阅动态',
    newsletterCopy: '获取新品、展会与户外故事。', subscribe: '订阅', email: '邮箱地址',
    rights: '保留所有权利。', privacy: '隐私政策', terms: '使用条款',
    productCount: '件商品', catalogTitle: '自在户外，装备有度',
    catalogCopy: '探索完整的帐篷、睡眠与营地生活解决方案。',
    breadcrumbHome: '首页', quantity: '起订量', tierPrice: '起订量与价格', tierNotice: '温馨提示：产品规格型号不同，价格会有差异，本价格仅供参考，如需详细报价表格，点击“获取报价”跟我们联系。',
    leadTime: '交付周期', customization: '定制服务',
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
    currentLanguage: '中文',
    switchLanguage: '切换语言',
    languageMenu: '语言',
    searchProducts: '搜索商品',
    fieldSystems: 'WOLFWALKER 户外装备系统',
    skuLabel: '产品货号',
    categoryLabel: '产品类型',
    pcsUnit: '件',
    piecesUnit: '件',
    oemValue: '品牌定制',
    brandCustom: '品牌定制',
    pageNotFoundTitle: '页面未找到',
    pageNotFoundBody: '你访问的页面可能已移动。',
    backHome: '返回首页',
    productCollectionCarousel: '产品系列轮播',
    previousSlide: '上一张',
    nextSlide: '下一张',
  },
  // 日语：与原英文版语序/语态尽量保持一致，称呼用「アウトドア」/「キャンプ」等行内常用词。
  ja: {
    home: 'ホーム', products: '商品', brand: 'ブランド', contact: 'お問い合わせ',
    explore: 'コレクションを見る', discover: 'シリーズ一覧', inquiry: '見積もり依頼',
    allProducts: 'すべての商品', featured: 'おすすめギア', featuredCopy: '本物の旅から生まれ、毎回アウトドアの時間を丁寧に整えるギアです。',
    categories: 'カテゴリー', viewProduct: '商品を見る', viewAll: 'すべての商品を見る', learnMore: 'ブランドについて',
    specs: '仕様', overview: '概要', requestQuote: '見積もりを依頼',
    related: 'おすすめ商品', backProducts: '商品一覧へ戻る', menu: 'メニューを開く', close: 'メニューを閉じる',
    noProducts: '該当する商品がありません', filterAll: 'すべてのギア',
    since: '2012年から続くアウトドア用品', global: 'より遠くのアウトドアのために',
    brandIntro: 'WOLFWALKERはキャンプ、オーバーランド、ドライブなど日常のアウトドアを心地よくするギアを設計しています。最初のスケッチからフィールドテストまで、快適さ、コンパクトさ、長く使える素材を大切にしています。',
    footerText: '黄山から生まれた本格的なアウトドアリビング用品を、世界中へ。',
    navigation: 'ナビゲーション', support: 'サポート', newsletter: 'フィールドノート',
    newsletterCopy: '新作展示会、トレードショー、フィールドストーリーをお届けします。', subscribe: '購読する', email: 'メールアドレス',
    rights: 'All rights reserved.', privacy: 'プライバシー', terms: '利用規約',
    productCount: '件', catalogTitle: '外での暮らしに、よい道具を',
    catalogCopy: 'テント、睡眠、キャンプリビングを一つのラインで。',
    breadcrumbHome: 'ホーム', quantity: '最小発注数', tierPrice: '最小発注数と価格', tierNotice: '※仕様やモデルにより価格は変動します。掲載価格は参考価格です。詳細なお見積もりは「見積もりを依頼」よりお問い合わせください。',
    leadTime: '納期', customization: 'カスタマイズ',
    moqValue: '50 個', leadValue: '25〜35 日', customValue: 'カラー / ロゴ / パッケージ',
    aboutTitle: '山の近くで、つくりました', aboutEyebrow: 'WOLFWALKER の物語',
    aboutLead: '工業の視点で道具を作り、探検家の感覚でアウトドアを読み解く。',
    playFilm: 'ブランド映像を再生', pauseFilm: 'ブランド映像を一時停止',
    craftTitle: '黄山から、世界のアウトドアへ',
    craftText: '製品設計、素材工学、モダンなものづくりを同じチームに集約。量産前には試作、耐久試験、そしてフィールドでの検証を重ねています。',
    cultureTitle: '私たちのカルチャー', visionTitle: '私たちのビジョン',
    cultureText: '好奇心を持ち、自然を敬い、本当に使えるものをつくる。オープンに話し合い、正直に試し、外での夜を少しでも快適にする細部にこだわり続けます。',
    visionText: '国境を越え、思慮あるアウトドアライフを届ける。小売パートナーと冒険家の双方から、長く信頼されるブランドになります。',
    values: ['使うための設計', '現場での検証', '責任ある成長'],
    currentLanguage: '日本語',
    switchLanguage: '言語を切り替える',
    languageMenu: '言語',
    searchProducts: '商品を検索',
    fieldSystems: 'WOLFWALKER アウトドアシステム',
    skuLabel: '型番',
    categoryLabel: 'カテゴリー',
    pcsUnit: '個',
    piecesUnit: '個',
    oemValue: 'OEM / ODM',
    brandCustom: 'OEM・ODM対応',
    pageNotFoundTitle: 'ページが見つかりません',
    pageNotFoundBody: 'お探しのページは移動した可能性があります。',
    backHome: 'ホームへ戻る',
    productCollectionCarousel: '商品シリーズカルーセル',
    previousSlide: '前のスライド',
    nextSlide: '次のスライド',
  },
  // 俄语：使用行业内常见说法（「палатки」「спальные коврики」「кемпинг»）。
  ru: {
    home: 'Главная', products: 'Товары', brand: 'Бренд', contact: 'Контакты',
    explore: 'Посмотреть коллекцию', discover: 'Все серии', inquiry: 'Отправить запрос',
    allProducts: 'Все товары', featured: 'Популярное снаряжение', featuredCopy: 'Снаряжение, проверенное в реальных походах и поездках.',
    categories: 'Категории', viewProduct: 'Открыть товар', viewAll: 'Все товары', learnMore: 'О бренде',
    specs: 'Характеристики', overview: 'Описание', requestQuote: 'Запросить цену',
    related: 'С этим покупают', backProducts: 'Вернуться к товарам', menu: 'Открыть меню', close: 'Закрыть меню',
    noProducts: 'Товары не найдены', filterAll: 'Все снаряжение',
    since: 'Снаряжение для активного отдыха с 2012 года', global: 'Создано для мира за горизонтом',
    brandIntro: 'WOLFWALKER разрабатывает практичное снаряжение для кемпинга, экспедиций и активного отдыха. От первого эскиза до полевых тестов мы фокусируемся на комфорте, продуманной конструкции и долговечных материалах.',
    footerText: 'Профессиональное снаряжение для активного отдыха, разработанное в Хуаншане и созданное для всего мира.',
    navigation: 'Навигация', support: 'Поддержка', newsletter: 'Полевые заметки',
    newsletterCopy: 'Новинки, выставки и истории из походов.', subscribe: 'Подписаться', email: 'Электронная почта',
    rights: 'Все права защищены.', privacy: 'Конфиденциальность', terms: 'Условия',
    productCount: 'товаров', catalogTitle: 'Снаряжение для жизни на природе',
    catalogCopy: 'Полная линейка палаток, спальных принадлежностей и кемпинговой мебели.',
    breadcrumbHome: 'Главная', quantity: 'MOQ', tierPrice: 'MOQ и цена', tierNotice: 'Цены зависят от модели и характеристик и приведены для справки. Для подробного предложения нажмите «Запросить цену» и свяжитесь с нами.',
    leadTime: 'Срок производства', customization: 'Кастомизация',
    moqValue: '50 шт.', leadValue: '25–35 дней', customValue: 'Цвет / Логотип / Упаковка',
    aboutTitle: 'Создано у подножия гор', aboutEyebrow: 'История WOLFWALKER',
    aboutLead: 'Снаряжение с инженерным мышлением и духом исследователя.',
    playFilm: 'Запустить ролик о бренде', pauseFilm: 'Поставить ролик на паузу',
    craftTitle: 'Из Хуаншаня — в мир активного отдыха',
    craftText: 'Дизайн, материаловедение и современное производство работают в одной команде. Перед серийным выпуском каждое изделие проходит прототипирование, испытания под нагрузкой и проверку в реальных условиях.',
    cultureTitle: 'Наша культура', visionTitle: 'Наше видение',
    cultureText: 'Оставаться любопытными. Уважать природу. Делать по-настоящему полезные вещи. Мы работаем открыто, проверяем честно и совершенствуем каждую деталь, которая делает ночь на природе комфортнее.',
    visionText: 'Сделать продуманный активный отдых доступным без границ и стать долгосрочным партнёром для ритейлеров и путешественников по всему миру.',
    values: ['Практичность в дизайне', 'Проверено в поле', 'Ответственный рост'],
    currentLanguage: 'Русский',
    switchLanguage: 'Сменить язык',
    languageMenu: 'Язык',
    searchProducts: 'Поиск товаров',
    fieldSystems: 'WOLFWALKER FIELD SYSTEMS',
    skuLabel: 'Артикул',
    categoryLabel: 'Категория',
    pcsUnit: 'шт.',
    piecesUnit: 'шт.',
    oemValue: 'OEM / ODM',
    brandCustom: 'OEM и ODM',
    pageNotFoundTitle: 'Страница не найдена',
    pageNotFoundBody: 'Запрошенная страница могла быть перемещена.',
    backHome: 'На главную',
    productCollectionCarousel: 'Карусель коллекций',
    previousSlide: 'Предыдущий слайд',
    nextSlide: 'Следующий слайд',
  },
}

watch(locale, (value) => {
  localStorage.setItem(STORAGE_KEY, value)
  document.documentElement.lang = langAttr(value)
  const meta = metaByLocale[value]
  document.title = meta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
}, { immediate: true })

// 支持的全部语言列表（按 UI 顺序：英中日俄），
// 头部下拉菜单和工厂介绍页等多语言场景会用到。
export const localeOptions = SUPPORTED.map((value) => ({
  value,
  // 每种语言用其本地写法显示 ——
  // 进入下拉后会有四行「English / 中文 / 日本語 / Русский」，
  // 当前激活的那行加标记。
  label: dictionary[value].currentLanguage,
}))

export function useLocale() {
  const t = computed(() => dictionary[locale.value])
  // 兼容旧调用点的 toggleLocale —— 二语切换不再需要，全量后改用 setLocale。
  // 保留它是因为早期代码会传 toggleLocale=()=>void，这里给个「循环下一个」的兜底实现，
  // 避免未替换的代码静默失效。
  const toggleLocale = () => {
    const i = SUPPORTED.indexOf(locale.value)
    locale.value = SUPPORTED[(i + 1) % SUPPORTED.length]
  }
  const setLocale = (value) => {
    if (SUPPORTED.includes(value)) locale.value = value
  }
  return { locale, t, toggleLocale, setLocale, locales: localeOptions }
}
