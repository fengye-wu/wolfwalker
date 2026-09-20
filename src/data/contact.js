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

// 页面图片（蓝湖切图，src/images/contact/ 下）
// 页面图片已上传阿里云 OSS，改用外链（本地 src/images/contact/ 仅留档，不再参与构建）。
// banner / photo 是 jpg，社交图标是 png，与 OSS 上的实际对象一一对应（已逐一探测 200）。
const OSS = 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/contact'
const contactBanner = `${OSS}/banner.jpg`
const contactPhoto = `${OSS}/photo.png`

export const contactImages = { banner: contactBanner, photo: contactPhoto }

// 左列三张社交卡片。账号为明哥给的对外口径；
// Facebook 暂无主页链接，先占位官网地址，有主页后替换 href 即可。
export const contactSocial = [
  {
    key: 'instagram',
    name: 'Ins',
    account: 'wolfwalker_shop',
    icon: `${OSS}/instagram.png`,
    href: 'https://www.instagram.com/wolfwalker_shop',
  },
  {
    key: 'facebook',
    name: 'Facebook',
    account: 'WolfWalker Outdoor Camping Gear',
    icon: `${OSS}/facebook.png`,
    href: 'https://www.facebook.com/',
  },
  {
    key: 'whatsapp',
    name: 'Whatsapp',
    account: 'WolfWalker',
    icon: `${OSS}/whatsapp.png`,
    // 同电话：补国家码，海外点开能直达会话
    href: 'https://wa.me/8616605655602',
  },
]

// 表单字段。name 就是 Formspree 后台看到的键名，改名等于换字段，别随手改。
// required 的三个同时是校验对象的键；autocomplete 让浏览器能自动填。
// type 走原生 input 类型，textarea 单独标 multiline。
// 设计稿只保留三个字段：姓名 / 邮箱 / 需求描述。
// company / phone 从 Formspree 表单里移除；要恢复时补回即可。
export const contactFields = [
  { name: 'name', labelKey: 'name', type: 'text', autocomplete: 'name', required: true },
  { name: 'email', labelKey: 'email', type: 'email', autocomplete: 'email', required: true },
  { name: 'message', labelKey: 'message', multiline: true, rows: 6, required: true },
]

// 地图模块已整块移除：原 Google Maps embed 大陆无法加载，换高德 marker 页后
// 产品侧仍决定不要地图，地址信息由左栏渠道行承载。contactMap 与
// mapTitle / locate 文案一并删除；要恢复时从 git 历史找这次改动前的版本。

export const contactCopy = {
  zh: {
    // Hero 大图文案（设计稿：左下白字两行）
    heroTitle: '深耕户外装备',
    heroSub: '支持定制代工，稳定交付，诚邀洽谈合作',

    // 左列大标题（\n 换行成「联系 / 我们」两行）与介绍段落
    introTitle: '联系\n我们',
    // 固定四行（\n + whitespace-pre-line），各断点行数稳定不漂移
    introBody:
      '专业户外帐篷、充气垫制造工厂，支持来图来样定制。\n提供快速打样、批量生产一站式服务。\n从原材料到成品出货层层质检，交期稳定、性价比高。\n贴牌代工、渠道拿货、项目定制均可洽谈，期待合作共赢。',

    // 表单下方提示语（设计稿：按钮左侧小字）
    notice: '温馨提示带 * 号为必填项，请填写完整姓名与邮箱地址，以便我们及时与您取得联系。',

    // 表单标签，键与 contactFields 的 labelKey 对应
    name: '姓名',
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
  },
  en: {
    heroTitle: 'Focused on Outdoor Gear',
    heroSub: 'OEM & ODM with stable delivery — your cooperation is welcome',

    introTitle: 'Contact\nUs',
    introBody:
      'Professional manufacturer of outdoor tents and air mattresses.\nCustom production from your drawings or samples.\nOne-stop service, strict checks, stable lead times and fair pricing.\nOEM, channel supply and project customization are all welcome.',

    notice: 'Fields marked with * are required. Please leave a complete name and email so we can reach you promptly.',

    name: 'Name',
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
  },
}

// 表单外观。设计稿：白底 + 细灰描边、聚焦转深描边 —— 由这串 Tailwind
// 接管原先 _element-plus.scss 里 .el-input__wrapper 的覆盖。
// text-base 不能再小：iOS 上小于 16px，聚焦会自动放大整个页面。
export const fieldClass =
  'w-full border border-black/15 bg-white px-4 py-3 text-base leading-6 text-ink outline-none transition placeholder:text-black/30 focus:border-ink'
export const labelClass =
  'mb-2 block text-sm font-bold leading-5 text-ink'

// 邮箱和电话已按对外口径统一为 wolfwalkershop@163.com / 16605655602，
// 与 footer.js、factory.js 一致；改的时候三处一起改。
//
// 还没统一的两处（明哥只要求改邮箱和电话，这些先按原样留着）：
//   地址   本页写「经济开发区芙蓉路13号一期2号厂房」，
//          footer.js 写「屯溪区百鸟亭路新城时代大厦A12」——一个是厂房一个是写字楼，
//          可能本来就是两个地点，要不要都露出来由明哥定。
//   固话   factory.js 另有一个 15655920120，本页没有这一行。
