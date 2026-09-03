// 定制专区页文案与图片。取值来自蓝湖设计稿「产品定制」（画板 1920×5363，与 CSS px 1:1），
// 本文件里出现的尺寸注释都按这个基准。
//
// 注意：这一页设计稿只有中文一版，没有英文版，所以下面 en 块是我译的，不是设计师给的原文
// （工厂介绍页两版都有，情况不同）。
//
// 图片是蓝湖切图的真图，按 1:1 尺寸托管在 OSS 的 images/custom/ 下，
// 本文件直接引 URL，仓库里不再留本地副本。
// 换图只要替换 OSS 上的同名文件，代码不用动。
// 首屏图。设计稿里是一张照片压一层从下往上收的白蒙版，照片到 y483 就全白了，
// 所以只导出可见的那 1920×490，下面接的白底由页面背景延续，不用整张大图。
export const customImages = {
  hero: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/hero.webp',
  // 定制优势的三个椭圆。设计稿 415×645，软边羽化（四角 alpha=0），
  // 三个在 x753 / 1118 / 1470，间距 365 / 352 < 宽度 415，是刻意互相压边的。
  advantages: ['https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/adv-a.png', 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/adv-b.png', 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/adv-c.png'],
  // 流程箭头。设计稿只有「向右」「向下」两种图形，
  // 第 2、4 排的左向箭头是同一张图的水平镜像（已核对切图像素一致），所以只存两张。
  arrowH: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/arrow-h.png',
  arrowV: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/arrow-v.png',
  // 大标题下面那条六段短横，设计稿 349×35，纯色 #254E94
  dashBar: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/dash.png',
};

// 12 张步骤图，已按「流程顺序」而不是「设计稿从左到右」编号。
// 设计稿是回形走位（第 1、3 排从左到右，第 2、4 排从右到左），
// 每排最后一步那张都是窄的 496 宽，前两步是 568 宽 —— 顺序换过来正好对上。
const step01 = 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-01.png';
const step02 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-02.png"
const step03 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-03.png"
const step04 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-04.png"
const step05 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-05.png"
const step06 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-06.png"
const step07 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-07.png"
const step08 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-08.png"
const step09 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-09.png"
const step10 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-10.png"
const step11 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-11.png"
const step12 = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/step-12.png"

export const stepImages = [
  step01,
  step02,
  step03,
  step04,
  step05,
  step06,
  step07,
  step08,
  step09,
  step10,
  step11,
  step12,
];

// 每排三步，四排共 12 步；true 表示这一排从右往左走。
export const flowRows = [
  { reverse: false },
  { reverse: true },
  { reverse: false },
  { reverse: true },
];

export const customCopy = {
  zh: {
    heroAlt: '狼行者定制帐篷营地',

    // 设计稿 T354 L87，SourceHanSerifSC-Heavy 104.17px / 行距比 1.3，#254E94
    title: ['狼行者', '产品定制优势'],
    // 设计稿 T622 L87，60.42px / 1.3793，#4F4F4F。中文稿里这两行本身就是英文，
    // 是给中文读者看的装饰性副题，不是「英文版文案」。
    subtitle: ['Product Customization', 'Advantages'],

    // 三个椭圆：label 是压在图上的白色大字（设计稿是位图，这里改成实时文字，
    // 字号按切图墨迹高度反推 ≈46px）；nameLines 是椭圆下面那两行蓝字。
    advantages: [
      { label: '11年专业定制', nameLines: ['源头工厂', 'Source Factory'] },
      { label: '多台专业设备', nameLines: ['可控成本', 'Controllable Cost'] },
      { label: '精湛工艺技术', nameLines: ['严格品控', 'Strict Quality Control'] },
    ],

    flowTitle: '产品定制流程',

    // 12 步，流程顺序。芯片文案 37.5px 白字，正文 37.5px / 行距比 1.3333、#4F4F4F。
    //
    // 两处按设计稿原样保留、但需要明哥确认：
    //   1. 第 6 步的芯片写的还是「签署文件」，和第 3 步重名，按上下文应是「样品确认」；
    //   2. 设计稿第 2 排（第 4~6 步）的正文首尾两格放反了 —— 芯片顺序
    //      「样品打样 → 样品寄出 → 签署文件」是对的，但正文是
    //      「样品合格 / 检测寄出 / 打样周期30天」，只有中间一格对得上。
    //      这里已按语义归位，芯片文字未改。
    steps: [
      {
        label: '寄出样品',
        text: '如您有实物样品或参考图片,可寄送给我们；如暂无,我们也可根据您的需求描述推荐相近材质。',
      },
      {
        label: '确定细节',
        text: '我们需要与您确认：面料类型、Logo制作方式等。这一步越细致后续打样越精准。',
      },
      { label: '签署文件', text: '所有需求将整理为书面确认单,由双方核对签字。' },
      {
        label: '样品打样',
        text: '帐篷打样周期约为 30 天,气垫约为 20 天。此为常规预估,实际会因面料库存及工艺复杂度略有浮动（我们会提前告知）。',
      },
      { label: '样品寄出', text: '样品打样完成之后，我们会进行检测；检测完毕会寄出样品。' },
      {
        label: '签署文件',
        text: '您收到样品后,请进行实际试用或尺寸确认。确认无误后,请以邮件或书面形式回复“样品合格”,此后大货将严格按照此标准生产。',
      },
      { label: '签署合同', text: '确认样品无误，并准备下大货订单之后，需要与我们签署合同。' },
      {
        label: '支付定金',
        text: '定金为合同总额的 30%。如需走账期或特殊付款条件,请在下单前与我们沟通确认。',
      },
      {
        label: '生产大货',
        text: '生产周期视订单量及当前排期而定,具体天数将在合同内明确。生产过程中,我们可按约定节点为您提供进度反馈。',
      },
      {
        label: '出厂检验',
        text: '本公司执行双重检验：流水线自检 + 出货前全检。检验不合格产品一律返修,不出厂、不交付。',
      },
      { label: '运输到位', text: '产品从工厂发出后,我们会提供物流单号,并协助跟进在途状态。' },
      {
        label: '完成订单',
        text: '尾款结清后,订单正式完结。我们同时为您保留售后联系人,后续使用问题可随时联系。',
      },
    ],

    // 页尾温馨告知。设计稿 T5051 L113 W1692，33.33px / 1.375、#4F4F4F、居中
    noteTitle: '温馨告知',
    noteBody:
      '亲爱的顾客，为了让您拥有独一无二的定制体验，我们的每一件定制产品都倾注了匠人的心血。需要特别说明的是，由于面料的批次差异、手工剪裁的精细度以及复杂的制作工序，每一件产品的诞生周期都会稍有不同。因此，页面所示的生产时间为常规预估，实际工期可能会有细微浮动。我们会在制作过程中全力以赴，并第一时间为您同步进度。感谢您的耐心等待与理解，这份美好，值得我们共同期待。',
  },

  en: {
    heroAlt: 'Wolfwalker custom tent camp',

    title: ['Wolfwalker', 'Customization Advantages'],
    // 中文稿的副题本身是英文，直译到英文版会和大标题重复，
    // 所以这里换成三个优势的概括，信息量不重复、行数不变。
    subtitle: ['Source factory, controlled cost,', 'strict quality control.'],

    // nameLines 英文版只有一行 —— 中文版第二行是给中文读者的英文注解，
    // 到英文版就成了重复。行数不同不影响排版：这一块给了固定高度。
    advantages: [
      { label: '11 Years of Custom Work', nameLines: ['Source Factory'] },
      { label: 'A Full Equipment Line', nameLines: ['Controllable Cost'] },
      { label: 'Refined Craft Skills', nameLines: ['Strict Quality Control'] },
    ],

    flowTitle: 'How Customization Works',

    // 第 6 步照中文稿直译成 Sign the Document（和第 3 步重名），
    // 等明哥确认是否改成 Sample Approval，两版一起改。
    steps: [
      {
        label: 'Send Us a Sample',
        text: 'If you have a physical sample or reference images, send them over. If not, describe what you need and we will recommend comparable fabrics.',
      },
      {
        label: 'Confirm the Details',
        text: 'We confirm fabric type, logo application and the rest with you. The more precise this step, the more accurate the sample.',
      },
      {
        label: 'Sign the Document',
        text: 'Every requirement goes into a written confirmation sheet, checked and signed by both sides.',
      },
      {
        label: 'Sample Production',
        text: 'Tents take about 30 days to sample, air mattresses about 20. These are normal estimates and may shift a little with fabric stock and construction complexity (we will tell you in advance).',
      },
      {
        label: 'Sample Dispatch',
        text: 'Once the sample is made we inspect it, and ship it out to you as soon as the check is done.',
      },
      {
        label: 'Sign the Document',
        text: 'Test the sample or check its dimensions. Once it is right, reply "sample approved" by email or in writing, and bulk production follows that exact standard.',
      },
      {
        label: 'Sign the Contract',
        text: 'Once the sample is approved and you are ready to place the bulk order, we sign a contract.',
      },
      {
        label: 'Pay the Deposit',
        text: 'The deposit is 30% of the contract total. For payment terms or other special arrangements, talk to us before ordering.',
      },
      {
        label: 'Bulk Production',
        text: 'Lead time depends on order volume and the current schedule, and is stated in the contract. We report progress at the milestones we agree on.',
      },
      {
        label: 'Factory Inspection',
        text: 'We run a double check: in-line self-inspection plus a full inspection before shipping. Anything that fails is reworked, and never leaves the factory.',
      },
      {
        label: 'Delivery',
        text: 'Once the goods leave the factory we provide the tracking number and help follow the shipment.',
      },
      {
        label: 'Order Complete',
        text: 'After the balance is settled the order closes. We keep an after-sales contact on file for any question that comes up later.',
      },
    ],

    noteTitle: 'A Friendly Note',
    noteBody:
      'Dear customer, every custom piece we make carries a maker’s care, and that is what makes your order one of a kind. Because fabric batches vary, hand cutting takes the time it takes, and some construction is genuinely complex, no two pieces take exactly the same time to finish. The production times shown on this page are normal estimates, so the real schedule may move a little. We will give it everything we have and keep you posted as it progresses. Thank you for your patience and understanding, this is something worth waiting for together.',
  },
};
