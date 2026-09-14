// 工厂介绍页文案与图片。取值来自蓝湖设计稿两版：
//   「工厂介绍（中文板式）」= 中文版，「工厂介绍」= 同一页的英文版，
// 所以中英文两套都是设计师给定的原文，不是我译的（见 zh / en 两块）。
//
// 设计稿画板 1920×4885，与 CSS px 1:1，本文件里出现的尺寸注释都按这个基准。
// 图片是设计稿里的位图图层（不是可下载切图），已按 1:1 裁切后托管到阿里云 OSS，
// 前缀统一为 images/factory/，文件名与原本地文件（src/images/factory/，留档
// 不再参与打包）一一对应。图片路径只有下面这一处，换图传 OSS 同名替换即可。
const OSS = 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/factory';

const airFactory = `${OSS}/air-factory.jpg`;
const engineersIcon = `${OSS}/engineers.png`;
const equipmentIcon = `${OSS}/equipment.png`;
const heroImage = `${OSS}/hero.jpg`;
const mailIcon = `${OSS}/icon-mail.png`;
const mobileIcon = `${OSS}/icon-mobile.png`;
const padIcon = `${OSS}/icon-pad.png`;
const telIcon = `${OSS}/icon-tel.png`;
const tentIcon = `${OSS}/icon-tent.png`;
const patentsIcon = `${OSS}/patents.png`;
const tentFactory = `${OSS}/tent-factory.jpg`;
const workersIcon = `${OSS}/workers.png`;

// 首屏大图，设计稿 1920×1044（比例 1.839），紧贴在 146px 高的头部下面。
export const factoryImages = {
  hero: heroImage,
  tentFactory,
  airFactory,
};

// 厂房数据那一排的图标。设计稿里是 186×186 的透明线稿，压在 #ECECEC 色带上，
// 已按底色反推 alpha 存成带色 PNG（线稿色 #575757），贴任何底色都不会露白框。
const statIcons = [workersIcon, equipmentIcon, patentsIcon, engineersIcon];

// 两张工厂卡里的品类图标、以及联系方式图标。这几个在设计稿里同一张图出现两种颜色
// （浅底棕线 / 棕底白线），所以存成「只有 alpha 有意义」的蒙版，
// 由 CSS 的 mask-image + background-color 上色，一份文件两处复用。
export const factoryIcons = {
  tent: tentIcon,
  pad: padIcon,
  tel: telIcon,
  mobile: mobileIcon,
  mail: mailIcon,
};

// 联系方式三行。tone 决定用哪个图标，右对齐 + 下划线由样式处理。
// 号码和邮箱与页脚 footer.js 里的一致，改的时候两处一起改。
export const contactRows = [
  { icon: 'tel', text: '15655920120', href: 'tel:15655920120' },
  { icon: 'mobile', text: '+86 16605655602', href: 'tel:+8616605655602' },
  {
    icon: 'mail',
    text: 'wolfwalkershop@163.com',
    href: 'mailto:wolfwalkershop@163.com',
  },
];

export const factoryCopy = {
  zh: {
    heroAlt: '狼行者工厂生产车间',

    // 62.5px SourceHanSerif-Bold #93563A，设计稿里就是两行，用 \n 断行
    introTitle: '十一年，\n只为一件事',
    introTagline: '用心做好每一件产品，用心服务好每一个客户。',
    // 右栏正文，设计稿 550px 宽、16.67px
    introBody:
      '凭借在这个行业深耕十一年的经历，我们公司对产品的认真态度，对技术的执着钻研，以及对客户需求的敬畏之心，早已融入每一道工序、每一次检测、每一次交付之中。\n我们深知，真正的专业不是夸夸其谈，而是把简单的事情重复做、用心做、做到极致。正是这份不妥协、不将就的坚持，让我们赢得了客户的信任，也让我们更加坚定——未来的路，依然要用匠心守品质，用行动兑现承诺。',

    areaValue: '12000m²',
    areaLabel: '厂房面积',
    areaNote: '我们约有12000㎡的厂房面积。',

    // 与 statIcons 逐项对应，长度必须一致
    stats: [
      { value: '150+', label: '普通工人数量' },
      { value: '42+', label: '专业生产设备' },
      { value: '50+', label: '发明技术专利' },
      { value: '12+', label: '开发技术人员' },
    ],

    cardCta: '查看',
    factories: [
      {
        alt: '帐篷工厂生产车间',
        // 每张卡是 2×2 的风车格：窄格 236 宽、宽格 500 宽，两行左右互换。
        // tone 为 dark 的格子是棕底浅字，light 是浅底棕字。
        cells: [
          { value: '25+', label: '专业生产设备', tone: 'dark', icon: 'tent' },
          { value: '50+', label: '帐篷产品品类', tone: 'light', icon: 'tent' },
          {
            value: '30+',
            label: '独立的帐篷类产品专利',
            tone: 'light',
            icon: 'tent',
          },
          { value: '60+', label: '普通工人人数', tone: 'dark', icon: 'tent' },
        ],
      },
      {
        alt: '气垫工厂生产车间',
        cells: [
          { value: '17+', label: '专业的生产设备', tone: 'dark', icon: 'pad' },
          // 设计稿中文版这格写的是「帐篷产品品类」，但这是气垫工厂那张卡，
          // 英文版同一格是 PAD CATEGORIES —— 中文版是复制上一张卡时漏改的。
          // 这里按英文版和上下文改成「气垫产品品类」，已同步告知明哥。
          { value: '50+', label: '气垫产品品类', tone: 'light', icon: 'pad' },
          {
            value: '20+',
            label: '独立的气垫类产品专利',
            tone: 'light',
            icon: 'pad',
          },
          { value: '90+', label: '普通工人人数', tone: 'dark', icon: 'pad' },
        ],
      },
    ],

    // 125px #93563A，设计稿两行
    ctaTitle: '您有需求，\n我们有专业方案',
    contactLabel: '联系方式',
  },

  en: {
    heroAlt: 'Wolfwalker factory production line',

    // 英文版设计稿这里是 54.17px（比中文小一档，因为英文更长）
    introTitle: 'Eleven years\nfor one thing only',
    introTagline:
      'Dedicated to crafting every product with care, and serving every customer with heart.',
    // 英文版正文 12.5px
    introBody:
      "With eleven years of deep experience in this industry, our company's serious attitude toward products, relentless pursuit of technology, and profound respect for customer needs have long been embedded in every process, every inspection, and every delivery.\nWe truly understand that true professionalism is not about boasting, but about doing simple things repeatedly, with dedication, and to perfection. It is this unyielding commitment to quality that has earned our customers' trust and strengthened our resolve—that on the road ahead, we will continue to guard quality with craftsmanship and fulfill our promises with action.",

    areaValue: '12000m²',
    areaLabel: 'Factory Area',
    areaNote:
      'THE FACTORY COVERS AN AREA OF APPROXIMATELY 12,000 SQUARE METERS.',

    stats: [
      { value: '150+', label: 'Total Workers' },
      { value: '42+', label: 'Equipment' },
      { value: '50+', label: 'Patents' },
      { value: '12+', label: 'Technical Staff' },
    ],

    cardCta: 'View',
    factories: [
      {
        alt: 'Tent factory production line',
        cells: [
          { value: '25+', label: 'Equipment', tone: 'dark', icon: 'tent' },
          { value: '50+', label: 'Tent categories', tone: 'light', icon: 'tent' },
          {
            value: '30+',
            label: 'Independent patents',
            tone: 'light',
            icon: 'tent',
          },
          { value: '60+', label: 'Total Workers', tone: 'dark', icon: 'tent' },
        ],
      },
      {
        alt: 'Air mattress factory production line',
        cells: [
          { value: '17+', label: 'Equipment', tone: 'dark', icon: 'pad' },
          { value: '50+', label: 'PAD CATEGORIES', tone: 'light', icon: 'pad' },
          {
            value: '20+',
            label: 'Independent patents',
            tone: 'light',
            icon: 'pad',
          },
          { value: '90+', label: 'Total Workers', tone: 'dark', icon: 'pad' },
        ],
      },
    ],

    // 英文版这句设计稿给了 175.27px，比中文的 125px 大
    ctaTitle: 'How to\nreach us?',
    contactLabel: 'Contact',
  },
};

// 两张卡的「查看」按钮去处：帐篷卡去帐篷品类，气垫卡去充气卧垫品类。
// key 必须是 products.js 里真实存在的分类，和首页分类卡同一套写法。
export const factoryLinks = ['/product?category=tent', '/product?category=airpad'];

export { statIcons };
