const images = {
  tent: [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1533873984035-25970ab07461?auto=format&fit=crop&w=1200&q=85',
  ],
  sofa: [
    'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85',
  ],
  tableAndchair: [
    'https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1496545672447-f699b503d270?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=1200&q=85',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=85',
  ],
  // 三类拆分后的商品沿用现有图库中的相近题材占位图，拿到真图后只替换 URL。
  airpad: [
    'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1526491109672-74740652b963?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
  ],
  foampad: [
    'https://images.unsplash.com/photo-1496947850313-7743325fa58c?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=1200&q=85',
  ],
  NeckPillow: [
    'https://images.unsplash.com/photo-1526491109672-74740652b963?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1496947850313-7743325fa58c?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
  ],
}

// 分类顺序决定产品页筛选条的排列，也决定 /product?category=xxx 的可选值。
// 充气卧垫、棉护睡垫、舒柔枕头是独立分类，不再保留 sleepingpad 总类。
// zh / en 与 data/footer.js 的 productLinks 逐项同名 —— 同一个品类在底部、
// 筛选条、商品卡角标、详情页面包屑上必须是同一个叫法，改一处要同步另一处。
// NeckPillow 的大小写是刻意的：路由里就写成 /product/NeckPillow/1，
// 路由参数大小写敏感，这里必须和路由枚举、footerRoutes 三处完全一致。
export const categories = [
  { key: 'tent', zh: '山野帐篷', en: 'Backcountry Tents', introZh: '从快速搭建到宽敞充气结构，为营地提供可靠庇护。', introEn: 'Reliable shelter, from quick-pitch privacy tents to spacious inflatable cabins.' },
  { key: 'airpad', zh: '充气卧垫', en: 'Inflatable Sleeping Mats', introZh: '一次充气撑起整夜支撑，收起来只有一只水壶大小。', introEn: 'Full-night support from a single inflation, packing down to the size of a water bottle.' },
  { key: 'foampad', zh: '棉护睡垫', en: 'Foam Sleeping Pads', introZh: '海绵夹层不怕扎、不用充气，铺开即睡。', introEn: 'Puncture-proof foam cores that need no inflation — unroll and sleep.' },
  { key: 'NeckPillow', zh: '舒柔枕头', en: 'Camp Pillows', introZh: '贴合颈部曲线的营地枕，长途车程与帐篷里都用得上。', introEn: 'Neck-contoured pillows that work as well on long drives as they do in the tent.' },
  { key: 'sofa', zh: '户外软座', en: 'Camp Seating', introZh: '将居家般的放松体验带到草地、海边与营地。', introEn: 'Lounge-level comfort designed for campsites, beaches and backyards.' },
  { key: 'tableAndchair', zh: '便携桌椅', en: 'Portable Tables & Chairs', introZh: '稳定轻量的营地家具，适合用餐、休息和社交。', introEn: 'Stable, lightweight camp furniture for dining, resting and gathering.' },
  { key: 'accessories', zh: '随行配件', en: 'Trail Accessories', introZh: '从充气到收纳，让营地搭建更轻松的小型装备。', introEn: 'Compact essentials that make setup, inflation and packing effortless.' },
]

const names = {
  tent: [
    ['云阁充气小屋', 'Cloud Pavilion Air Cabin'], ['中号充气帐篷', 'Medium Inflatable Tent'],
    ['单人破舰者', 'Solo Breaker Tent'], ['充气凉棚', 'Inflatable Sun Shelter'],
    ['支架款更衣帐篷', 'Frame Privacy Tent'], ['速开款更衣帐篷', 'Quick-open Privacy Tent'],
    ['行军床帐篷', 'Cot Tent'],
  ],
  // 原睡垫总类的 17 款按属性拆进了 airpad / foampad / NeckPillow：
  // 充气的进 airpad，不充气的海绵坐垫进 foampad，枕头进 NeckPillow，
  // tpu直拉带是配件件不是垫子，归到 accessories。一款都没丢。
  sofa: [
    ['悠扬·双人躺卧沙发', 'Serenade Double Lounger'], ['星野双人坐式沙发', 'Starfield Double Sofa'],
    ['单人坐桶沙发', 'Solo Barrel Sofa'], ['升级款单人沙发', 'Upgraded Solo Sofa'], ['悠扬·单人充气沙发', 'Serenade Solo Air Sofa'],
  ],
  tableAndchair: [
    ['单横杆椅子', 'Single-bar Camp Chair'], ['碳纤维椅子', 'Carbon Fiber Chair'], ['四角马扎', 'Four-corner Folding Stool'],
    ['双横杆躺椅', 'Double-bar Recliner'], ['后背提拉椅子', 'Lift-back Camp Chair'],
  ],
  accessories: [
    ['水桶', 'Collapsible Water Bucket'], ['排气收纳包', 'Vented Storage Bag'], ['气密收纳包', 'Airtight Storage Bag'],
    ['云朵包', 'Cloud Carry Bag'], ['手打泵', 'Manual Air Pump'], ['智能充气泵', 'Smart Electric Pump'], ['小泵', 'Mini Pump'],
    ['tpu直拉带', 'TPU Straight Pull Strap'],
  ],
  // 下面三类里带 ★ 的商品名是我拟的补充款，其余都是原睡垫总类里的真实清单。
  // 拿到产品部的正式清单后替换即可，id 按下标顺延、不影响别处。
  airpad: [
    ['薄款奶酪垫', 'Slim Cheese Mat'], ['星栖奶酪垫', 'Starrest Cheese Mat'], ['战术奶酪垫', 'Tactical Cheese Mat'],
    ['拉丝垫子', 'Drop-stitch Mat'], ['拉丝云床', 'Drop-stitch Cloud Bed'], ['电动加厚充气床', 'Electric Comfort Air Bed'],
    ['带枕菱形脚踩气垫', 'Diamond Foot-pump Mat with Pillow'], ['V型气垫', 'V-shaped Air Mat'],
    ['多点位恒温气垫', 'Multi-zone Thermal Air Mat'], ['星途恒温气垫', 'Startrail Thermal Air Mat'],
  ],
  foampad: [
    ['恒温坐垫', 'Thermal Seat Pad'], ['普通坐垫', 'Classic Seat Pad'],
    // ★ 补充款
    ['云憩棉护睡垫', 'Cloudrest Foam Pad'], ['加厚棉护折叠垫', 'Thick Folding Foam Pad'],
    ['铝膜保温棉垫', 'Foil-backed Insulated Foam Pad'], ['蛋巢棉护垫', 'Egg-nest Foam Pad'],
  ],
  NeckPillow: [
    ['羽绒枕头', 'Down Pillow'], ['战术枕头', 'Tactical Pillow'],
    ['云憩海绵软枕', 'Cloudrest Foam Pillow'], ['U型充气枕', 'U-shaped Air Pillow'],
    // ★ 补充款
    ['记忆棉营地枕', 'Memory Foam Camp Pillow'],
  ],
}

const categoryDetails = {
  tent: {
    zh: '采用耐磨防泼水面料与稳定支撑结构，兼顾通风、搭建效率和全天候营地体验。',
    en: 'Built with abrasion-resistant, water-repellent fabric and a stable support system for ventilation, fast setup and reliable all-weather use.',
    specsZh: [['外帐面料', '210D 牛津布'], ['防水指数', 'PU 3000 mm'], ['适用季节', '三季'], ['定制', '颜色 / 品牌标识 / 包装']],
    specsEn: [['Flysheet', '210D Oxford'], ['Waterproof rating', 'PU 3000 mm'], ['Season', '3 season'], ['Custom', 'Color / Logo / Package']],
  },
  sofa: {
    zh: '宽大承托面配合稳定气室，快速充放气，在营地也能拥有松弛舒适的休息空间。',
    en: 'A generous support area and stable air chambers create a relaxed camp lounge that inflates and packs quickly.',
    specsZh: [['材质', '耐磨 PVC 复合面料'], ['气阀', '大流量气阀'], ['承重', '150–240 kg'], ['定制', '颜色 / 品牌标识 / 包装']],
    specsEn: [['Material', 'Durable PVC composite'], ['Valve', 'High-flow valve'], ['Load', '150–240 kg'], ['Custom', 'Color / Logo / Package']],
  },
  tableAndchair: {
    zh: '轻量金属结构与高强度座布相结合，展开快捷、支撑稳定，满足多种营地活动。',
    en: 'A lightweight metal frame and high-strength fabric deliver quick setup and dependable support around camp.',
    specsZh: [['支架', '轻量合金'], ['面料', '600D 牛津布'], ['结构', '快速折叠'], ['定制', '颜色 / 品牌标识 / 包装']],
    specsEn: [['Frame', 'Lightweight alloy'], ['Fabric', '600D Oxford'], ['Structure', 'Quick folding'], ['Custom', 'Color / Logo / Package']],
  },
  accessories: {
    zh: '围绕营地搭建、充气与收纳设计，体积小巧、使用直观，是户外系统中不可缺少的一环。',
    en: 'Designed around setup, inflation and storage, this compact essential keeps every camp system working smoothly.',
    specsZh: [['设计', '轻量便携'], ['适用', '多场景户外'], ['包装', '独立包装'], ['定制', '颜色 / 品牌标识 / 包装']],
    specsEn: [['Design', 'Lightweight / Portable'], ['Use', 'Multi-scene outdoor'], ['Packing', 'Individual pack'], ['Custom', 'Color / Logo / Package']],
  },
  airpad: {
    zh: '内置支撑气室撑起均匀承托，双向气阀快充快放，收纳后仅一只水壶大小。',
    en: 'Internal support chambers spread weight evenly, while a two-way valve inflates and empties fast — packed down, it is no bigger than a water bottle.',
    specsZh: [['表层材质', '40D 尼龙 TPU 复合'], ['气阀', '快速双向阀'], ['收纳尺寸', '约 φ12 × 25 cm'], ['定制', '颜色 / 品牌标识 / 包装']],
    specsEn: [['Surface', '40D nylon TPU composite'], ['Valve', 'Fast two-way valve'], ['Packed size', 'Approx. φ12 × 25 cm'], ['Custom', 'Color / Logo / Package']],
  },
  foampad: {
    zh: '海绵夹层不用充气也不怕扎破，铺开即睡；折叠后可当营地坐垫。',
    en: 'A foam core needs no inflation and shrugs off punctures — unroll to sleep, fold it up to sit on.',
    specsZh: [['芯材', '高回弹海绵'], ['表层', '抗撕拉面料'], ['结构', '折叠 / 卷收'], ['定制', '颜色 / 品牌标识 / 包装']],
    specsEn: [['Core', 'High-resilience foam'], ['Surface', 'Tear-resistant fabric'], ['Format', 'Folding / roll-up'], ['Custom', 'Color / Logo / Package']],
  },
  NeckPillow: {
    zh: '贴合颈部曲线的支撑造型，亲肤外套可拆洗，长途车程与帐篷里都用得上。',
    en: 'Neck-contoured support with a removable, washable cover — equally at home on a long drive or in the tent.',
    specsZh: [['芯材', '记忆棉 / 充气气室'], ['外套', '可拆洗亲肤面料'], ['收纳', '附收纳袋'], ['定制', '颜色 / 品牌标识 / 包装']],
    specsEn: [['Core', 'Memory foam / air chamber'], ['Cover', 'Removable soft-touch fabric'], ['Storage', 'Stuff sack included'], ['Custom', 'Color / Logo / Package']],
  },
}

export const products = Object.entries(names).flatMap(([category, items]) =>
  items.map(([zh, en], index) => ({
    id: String(index + 1),
    sku: `${category}-${String(index + 1).padStart(2, '0')}`,
    category,
    name: { zh, en },
    description: { zh: categoryDetails[category].zh, en: categoryDetails[category].en },
    specs: { zh: categoryDetails[category].specsZh, en: categoryDetails[category].specsEn },
    image: images[category][index % images[category].length],
    imageAlt: { zh: `${zh}户外产品`, en: `${en} outdoor product` },
    featured: (category === 'tent' && index < 4) || (category === 'airpad' && index < 2),
  })),
)

export const getProduct = (category, id) => products.find((item) => item.category === category && item.id === String(id))
export const getCategory = (key) => categories.find((item) => item.key === key)

// ---------- 商品页首屏轮播 ----------
// 每张图配一个品类，按钮文案不写死在这里 —— 由 category 去 categories 里取
// zh/en，跟公共底部、筛选条、商品卡角标共用同一个叫法，改品类名这里自动跟上。
// 顺序是需求给的图片顺序（one..seven），和 categories 的顺序不同，这是刻意的：
// 图拍的是什么题材就配哪个品类。
// eyebrow 七张共用，写在 productHeroEyebrow。
//
// titleEn 有长度上限：标题在 ProductHero 里是 white-space: nowrap，文案框又收在
// 视口 80% 以内，768px 那一档（英文字号已经压到 clamp 下限 30px）算下来约 614px，
// 折成字符数就是 35 上下。原先写的 "Follow the wind, rest wherever it takes you"
// （42 字符）实测溢出 17px，已改短。新增英文标题请控制在 35 字符内。
export const productHeroEyebrow = { zh: 'WOLFWALKER / 产品系列', en: 'WOLFWALKER / PRODUCT COLLECTION' }

export const productHeroSlides = [
  {
    image: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/product/one.jpg',
    category: 'tent',
    titleZh: '奔赴山野，解锁自由', titleEn: 'Into the wild, unlock freedom',
    subtitleZh: '探寻帐篷气垫智造，尽享户外安歇',
    subtitleEn: 'Smart-made tents and air mats for a restful night outdoors',
  },
  {
    image: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/product/two.jpg',
    category: 'airpad',
    titleZh: '栖于天地，乐享自然', titleEn: 'Dwell in the open, live with nature',
    subtitleZh: '深耕帐篷、充气气垫研发生产，定制户外理想居所',
    subtitleEn: 'Tents and inflatable mats, developed and built in-house for your ideal camp',
  },
  {
    image: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/product/three.jpg',
    category: 'foampad',
    titleZh: '纵情山海，自在无拘', titleEn: 'Roam peaks and coasts, wholly free',
    subtitleZh: '专注帐篷与充气气垫，让山野旅居轻松随性',
    subtitleEn: 'Focused on tents and air mats that keep life outdoors easy and unhurried',
  },
  {
    image: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/product/four.jpg',
    category: 'sofa',
    titleZh: '身归旷野，心觅安然', titleEn: 'Body in the wild, mind at ease',
    subtitleZh: '帐篷气垫源头工厂，打造户外舒适休憩方案',
    subtitleEn: 'A source factory for tents and air mats, building comfort into every campsite',
  },
  {
    image: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/product/five.jpg',
    category: 'NeckPillow',
    titleZh: '逐风而行，随遇而安', titleEn: 'Follow the wind, at ease anywhere',
    subtitleZh: '枕垫相伴，享受美景，四海皆可安眠',
    subtitleEn: 'Pillows and pads that turn any view into a good night’s sleep',
  },
  {
    image: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/product/six.jpg',
    category: 'accessories',
    titleZh: '向野出发，静守清欢', titleEn: 'Head outdoors, keep the quiet joy',
    subtitleZh: '一帐一垫搭配随行配件，尽享天地间松弛时刻',
    subtitleEn: 'One tent, one mat and the right accessories for unhurried hours outside',
  },
  {
    image: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/product/seven.jpg',
    category: 'tableAndchair',
    titleZh: '匠心致造，野境可期', titleEn: 'Crafted with care, made for the wild',
    subtitleZh: '专注帐篷桌椅研发生产，铸就高品质户外旅居装备',
    subtitleEn: 'Tents, tables and chairs developed in-house for high-quality life outdoors',
  },
]
