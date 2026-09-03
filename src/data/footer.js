export const footerImages = {
  logoMark:
    'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/logo-black.png',
  wechatQr:
    'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/qrcode.png'
};

// 与 copy.*Links 逐项对应，长度必须一致。
//
// 七项现在都有真实分类可指，不再有回落到全部产品页的了。
// category 的值必须是 data/products.js 里 categories 真实存在的 key ——
// ProductView 对未知 key 会静默回落到「全部」，拼错不报错、只会筛不出东西。
// NeckPillow 的大小写照抄，别改成小写。
export const footerRoutes = {
  product: [
    '/product?category=tent',
    '/product?category=airpad',
    '/product?category=foampad',
    '/product?category=sofa',
    '/product?category=NeckPillow',
    '/product?category=tableAndchair',
    '/product?category=accessories'
  ],
  solution: ['/factory', '/factory'],
  about: ['/AboutUs']
};

export const contactInfo = {
  phone: '16605655602',
  email: 'wolfwalkershop@163.com',
  place: {
    zh: '安徽省黄山市屯溪区百鸟亭路新城时代大厦A12',
    en: 'A12, Xincheng Times Building, Bainiaoting Road, Tunxi District, Huangshan, Anhui, China'
  }
};

export const copy = {
  zh: {
    brandName: 'WOLF WALKER',
    brandHome: 'Wolf Walker 首页',
    products: '产品分类',
    // 与 data/products.js 的 categories 逐项同名，顺序照 footerRoutes。
    productLinks: [
      '山野帐篷',
      '充气卧垫',
      '棉护睡垫',
      '户外软座',
      '舒柔枕头',
      '便携桌椅',
      '随行配件'
    ],
    solutions: '工厂介绍',
    solutionLinks: ['帐篷工厂', '气垫工厂'],
    about: '关于我们',
    aboutLinks: ['公司简介'],
    contact: '联系我们',
    phone: `联系电话：${contactInfo.phone}`,
    email: `品牌邮箱：${contactInfo.email}`,
    place: `品牌地址：${contactInfo.place.zh}`,
    scan: '扫一扫，联系我们',
    rights: '保留所有权利。',
    wechatQrAlt: 'Wolf Walker 微信二维码'
  },
  en: {
    brandName: 'WOLF WALKER',
    brandHome: 'Wolf Walker home',
    products: 'Product Categories',
    // 不逐字直译 ——「Moisture-proof Sleeping Pads」「Outdoor Soft Seating」
    // 这类说法在英文产品目录里不成立，按同类产品的常见叫法写。
    // 下标与 footerRoutes.product 和 zh.productLinks 一一对应，长度必须一致。
    productLinks: [
      'Backcountry Tents',
      'Inflatable Sleeping Mats',
      'Foam Sleeping Pads',
      'Camp Seating',
      'Camp Pillows',
      'Portable Tables & Chairs',
      'Trail Accessories'
    ],
    solutions: 'Our Factories',
    solutionLinks: ['Tent Factory', 'Air Mattress Factory'],
    about: 'About Us',
    aboutLinks: ['Company Profile'],
    contact: 'Contact Us',
    phone: `Tel: ${contactInfo.phone}`,
    email: `Email: ${contactInfo.email}`,
    // 中文那条有「品牌地址：」前缀，英文原来只有地址本身，
    // 三行并排时最后一行没有标签、对不齐
    place: `Address: ${contactInfo.place.en}`,
    scan: 'Scan to contact us',
    rights: 'All rights reserved.',
    wechatQrAlt: 'Wolf Walker WeChat QR code'
  }
};
