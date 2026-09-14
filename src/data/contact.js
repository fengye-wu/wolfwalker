// 联系我们页的数据与文案。与 home.js / factory.js / custom.js 同一套约定：
// 结构数据（渠道行、表单字段、地图）在上，contactCopy 在下按语言分块。
//
// 页面里的文案原来散在 useLocale.js 的全局字典里，那 16 个键只有本页在用，
// 已整体搬到这里；全局字典只留跨页共用的词。

// Formspree 端点。form 的 action 属性和提交用的 fetch 都读这一个常量，
// 换表单只改这里。注意这个 ID 在前端源码里是公开的，
// 防刷要在 Formspree 后台开 reCAPTCHA 或域名白名单。
export const formEndpoint = 'https://formspree.io/f/xeaqbvek'

// 邮件标题前缀。带商品编号时后台一眼看得出问的是哪件货。
export const mailSubject = {
  withProduct: (product) => `Wolfwalker inquiry · ${product}`,
  fallback: 'Wolfwalker website inquiry',
}

// 左栏四行联系信息。icon 是 lucide 组件名，由视图映射成组件；
// label 为 null 表示这一行的标题走 contactCopy 里的同名键（office / sales / phone），
// 只有「工作时间」在字典里没有独立标题，所以单独给了 hours 键。
//
// href 为 null 的行只显示文字，不做链接。
// 这里的号码和邮箱与 footer.js、factory.js 里的不是同一套（见文件末尾说明）。
export const contactChannels = [
  { key: 'address', icon: 'MapPin', labelKey: 'office', textKey: 'address', href: null, wide: true },
  { key: 'sales', icon: 'Mail', labelKey: 'sales', text: 'wolfwalkershop@163.com', href: 'mailto:wolfwalkershop@163.com' },
  // href 补 +86：手机上点号码要能直接拨，国内号不带国家码在海外网络会拨不出去。
  // 显示仍是明哥给的 11 位原样。
  { key: 'phone', icon: 'Phone', labelKey: 'phone', text: '16605655602', href: 'tel:+8616605655602' },
  { key: 'hours', icon: 'Clock3', labelKey: 'hoursLabel', textKey: 'hours', href: null },
]

// 表单字段。name 就是 Formspree 后台看到的键名，改名等于换字段，别随手改。
// required 的三个同时是校验对象的键；autocomplete 让浏览器能自动填。
// type 走原生 input 类型，textarea 单独标 multiline。
export const contactFields = [
  { name: 'name', labelKey: 'name', type: 'text', autocomplete: 'name', required: true },
  { name: 'company', labelKey: 'company', type: 'text', autocomplete: 'organization', required: false },
  { name: 'email', labelKey: 'email', type: 'email', autocomplete: 'email', required: true },
  { name: 'phone', labelKey: 'phone', type: 'tel', autocomplete: 'tel', required: false },
  { name: 'message', labelKey: 'message', multiline: true, rows: 5, required: true },
]

// 地图。address 是给 Google Maps 的查询串，不带「中国」前缀 —— 带上前缀
// 定位会飘到国家级。两个 URL 都由它 encodeURIComponent 得来，不要各写一份编码值。
const mapQuery = '安徽省黄山市经济开发区芙蓉路13号一期2号厂房'
export const contactMap = {
  embed: `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`,
  link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
}

export const contactCopy = {
  zh: {
    eyebrow: '联系 / WOLFWALKER',
    hqEyebrow: 'WOLFWALKER 总部',
    title: '一起开启下一段旅程',
    lead: '告诉我们您的需求，国际销售团队通常会在一个工作日内回复。',

    office: '总部及工厂',
    address: '中国安徽省黄山市经济开发区芙蓉路13号一期2号厂房',
    sales: '国际销售',
    phone: '联系电话',
    hoursLabel: '工作时间',
    hours: '周一至周五 · 08:30–17:30（北京时间）',

    // 表单标签，键与 contactFields 的 labelKey 对应
    name: '姓名',
    company: '公司名称',
    email: '邮箱地址',
    message: '请描述您的需求',
    send: '提交留言',

    sending: '提交中…',
    success: '感谢您的留言，我们已记录您的询盘。',
    error: '提交失败，请稍后重试，或直接邮件联系 wolfwalkershop@163.com。',

    // 校验提示按「错误类型」分组，视图只存类型 key 不存译文，
    // 这样切语言时已显示的提示会跟着翻，不用重跑校验。
    invalid: {
      required: { name: '请输入姓名', email: '请输入邮箱', message: '请输入留言' },
      email: '请输入有效邮箱',
    },

    // 询盘预填。从详情页「获取报价」带 product / quantity 过来时填进留言框。
    inquiry: (product, quantity) => `商品：${product}\n数量：${quantity}`,

    mapTitle: '狼行者总部位置地图',
    locate: '在地图中查看',
  },
  en: {
    eyebrow: 'CONTACT / WOLFWALKER',
    hqEyebrow: 'WOLFWALKER HQ',
    title: 'Let’s build the next journey',
    lead: 'Tell us what you need. Our international sales team usually replies within one business day.',

    office: 'Head office & factory',
    address: 'Building 2, Phase I, No. 13 Furong Road, Huangshan Economic Development Zone, Anhui, China',
    sales: 'International sales',
    phone: 'Phone',
    hoursLabel: 'Business hours',
    hours: 'Monday–Friday · 08:30–17:30 CST',

    name: 'Name',
    company: 'Company',
    email: 'Email address',
    message: 'How can we help?',
    send: 'Send message',

    sending: 'Sending…',
    success: 'Thank you. Your inquiry has been recorded.',
    error: 'Sending failed. Please try again, or email wolfwalkershop@163.com directly.',

    invalid: {
      required: {
        name: 'Please enter your name',
        email: 'Please enter your email',
        message: 'Please enter a message',
      },
      email: 'Please enter a valid email',
    },

    inquiry: (product, quantity) => `Product: ${product}\nQuantity: ${quantity}`,

    mapTitle: 'Wolfwalker location map',
    locate: 'View larger map',
  },
}

// 表单外观。方角、$mist 底、聚焦时 pine 描边 —— 换成原生表单后由这串 Tailwind
// 接管原先 _element-plus.scss 里 .el-input__wrapper 的覆盖。
// text-base 不能再小：iOS 上小于 16px，聚焦会自动放大整个页面。
export const fieldClass =
  'w-full border border-transparent bg-mist px-4 py-3 text-base leading-6 text-ink outline-none transition placeholder:text-black/30 focus:border-pine focus:bg-white'
export const labelClass =
  'mb-2 block text-xs font-bold uppercase leading-4 tracking-[0.02em] text-black/45'

// 邮箱和电话已按对外口径统一为 wolfwalkershop@163.com / 16605655602，
// 与 footer.js、factory.js 一致；改的时候三处一起改。
//
// 还没统一的两处（明哥只要求改邮箱和电话，这些先按原样留着）：
//   地址   本页写「经济开发区芙蓉路13号一期2号厂房」，
//          footer.js 写「屯溪区百鸟亭路新城时代大厦A12」——一个是厂房一个是写字楼，
//          可能本来就是两个地点，要不要都露出来由明哥定。
//   固话   factory.js 另有一个 15655920120，本页没有这一行。
