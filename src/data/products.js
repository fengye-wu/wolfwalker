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

// 商品清单以 src/utils/products.json 为准。
// 中文名 / 编号按 JSON 原样保留；英文名是我按品名补的对应译法。
// JSON 里枕头分类写成了 "Neck Pillow"，路由和详情页仍用 NeckPillow，
// 这里继续用路由那个 key，否则 /product/NeckPillow/:id 会 404。
// 主图还没有到位：每类先循环现有占位图，详情页再从同类商品里抽两张补齐
// 三张缩略图。后期真图到了，只替换 images 对应下标即可。
const names = {
  tent: [
    ['云阁充气帐篷', 'Cloud Pavilion Air Tent', 'Lxz-1150-1102'],
    ['中号充气帐篷', 'Medium Inflatable Tent', 'LXZ-1150-1116'],
    ['破舰者帐篷', 'Breaker Tent', 'lxz-1200-0001'],
    ['充气凉棚天幕', 'Inflatable Shade Canopy', 'lxz-1150-1117'],
    ['支架更衣帐篷', 'Frame Changing Tent', 'lxz-1100-1'],
    ['折叠式更衣帐篷', 'Folding Changing Tent', 'lxz-1101-1001'],
    ['行军床帐篷', 'Cot Tent', 'lxz-1221-001'],
    ['充气穹顶天幕', 'Inflatable Dome Canopy', 'lxz-1001-0017'],
    ['阔野·半自动天幕', 'Widefield Semi-auto Canopy', 'lxz-1000-1330'],
    ['袋鼠帐篷', 'Kangaroo Tent', 'lxz-1201-0012'],
    ['行者隧道帐篷', 'Wanderer Tunnel Tent', 'LXZ-1148-1105'],
    ['大号半球形帐篷', 'Large Dome Tent', 'lxz-1143-5001'],
    ['狼堡支架帐篷', 'Wolfkeep Frame Tent', 'LXZ-1144-1201-1'],
    ['屋檐天幕', 'Eave Canopy', 'LXZ-1152-1304'],
    ['船形速开帐篷', 'Boat Instant Tent', 'lxz-1136-1304'],
    ['游侠·铝杆帐篷', 'Ranger Aluminum-pole Tent', 'lxz-1200-0013'],
    ['冰屋圆形帐篷', 'Igloo Round Tent', 'lxz-1143-2122'],
    ['手搭穹顶天幕', 'Hand-pitch Dome Canopy', 'lxz-1000-1138'],
    ['自动穹顶天幕', 'Auto Dome Canopy', 'lxz-1000-2030'],
    ['六角速开帐篷', 'Hex Instant Tent', 'lxz-1151-1204'],
    ['驼峰天幕', 'Hump Canopy', 'LXZ-1152-1302'],
    ['单层弹簧帐篷', 'Single-layer Spring Tent', 'lxz-1002'],
    ['苍狼·半球形帐篷', 'Greywolf Dome Tent', 'lxz-1143-2002'],
    ['单层弹簧帐篷', 'Single-layer Spring Tent', 'lxz-1002-4'],
    ['印第安型帐篷', 'Tipi Tent', 'lxz-1143-1401'],
    ['风衫天幕', 'Windshirt Canopy', 'lxz-1141-1101'],
  ],
  airpad: [
    ['拉丝矮垫', 'Low-profile Drop-stitch Mat', 'lxz-4339-1106'],
    ['星途恒温气垫', 'Startrail Thermal Air Mat', 'lxz-4042-1208'],
    ['电动加厚充气床', 'Electric Thick Air Bed', 'lxz-4217-92'],
    ['两用坐垫', 'Dual-use Seat Pad', 'lxz-4381-1206'],
    ['恒温坐垫', 'Thermal Seat Pad', 'lxz-4381-1211'],
    ['海绵拉丝云床', 'Foam Drop-stitch Cloud Bed', 'lxzqd1206'],
    ['tpu直拉带气垫', 'TPU Straight-strap Air Mat', 'lxz-4135-4'],
    ['带枕菱形脚踩气垫', 'Diamond Foot-pump Mat with Pillow', 'lxz-4154-1002'],
    ['V型气垫', 'V-shaped Air Mat', 'lxz-4039-1'],
    ['糖葫芦充气床', 'Candy-stick Air Bed', 'LXZ-4239-1122'],
    ['双人加厚TPU充气床', 'Double Thick TPU Air Bed', 'lxz-4217-7'],
    ['花棱形双人带枕脚踩充气垫', 'Faceted Double Foot-pump Mat with Pillow', 'lxz-4316-4'],
  ],
  foampad: [
    ['薄款奶酪垫', 'Slim Cheese Pad', 'lxz-4339-4001'],
    ['星栖奶酪垫', 'Starrest Cheese Pad', 'lxz-4339-1115'],
    ['战术奶酪垫', 'Tactical Cheese Pad', 'lxz-4339-1103'],
    ['双人波点形自动充气垫', 'Double Dotted Self-inflating Pad', 'lxz-4335-1402'],
    ['单人波点形自动充气垫', 'Solo Dotted Self-inflating Pad', 'lxz-4335-1403'],
    ['一键式充放奶酪床', 'One-touch Cheese Bed', 'lxz-4239-1113'],
    ['青春版奶酪床', 'Youth Cheese Bed', 'LXZ-4239-1105'],
    ['猛禽奶酪垫', 'Raptor Cheese Pad', 'lxz-3145-1104'],
  ],
  sofa: [
    ['双人躺靠式充气沙发', 'Double Reclining Air Sofa', 'LXZ-4321-1106'],
    ['双人坐式充气沙发', 'Double Seated Air Sofa', 'LXZ-4321-1312'],
    ['单人两用沙发', 'Solo Dual-use Sofa', 'LXZ-4321-2001'],
    ['头等舱单人充气沙发', 'First-class Solo Air Sofa', 'LXZ-4321-3001'],
    ['悠然·单人充气沙发', 'Leisure Solo Air Sofa', 'LXZ-4321-1203'],
  ],
  NeckPillow: [
    ['羽绒充气枕头', 'Down Inflatable Pillow', 'lxz-4332-1605'],
    ['U型旅行枕头', 'U-shaped Travel Pillow', 'lxz-4339-1120'],
    ['海绵舒适软枕', 'Soft Foam Camp Pillow', 'lxz-4332-1602'],
    ['战术风格充气枕头', 'Tactical Inflatable Pillow', 'lxz-4339-1109'],
    ['卡其色奶酪枕', 'Khaki Cheese Pillow', 'lxz-4339-1501'],
    ['魔方自动充气枕', 'Cube Self-inflating Pillow', 'lxz-4332-1201'],
  ],
  tableAndchair: [
    ['小号单横杆月亮椅', 'Small Single-bar Moon Chair', 'lxz-3145-1115'],
    ['碳纤维月亮椅', 'Carbon Fiber Moon Chair', 'lxz-6128-2610'],
    ['四角马扎', 'Four-corner Folding Stool', 'lxz-6128-2604'],
    ['双横杆折叠躺椅', 'Double-bar Folding Recliner', 'lxz-6131-1507'],
    ['后背提拉椅', 'Lift-back Camp Chair', 'lxz-3145-1125'],
    ['四方躺平椅', 'Square Flat Recliner', 'lxz-6131-1513'],
    ['战术蝴蝶椅', 'Tactical Butterfly Chair', 'lxz-3145-1111'],
    ['车载钓鱼椅', 'Car-mount Fishing Chair', 'lxz-3145-1105'],
    ['轻便折叠布面桌', 'Lightweight Folding Fabric Table', 'lxz-3145-1801'],
  ],
  accessories: [
    ['户外折叠水桶', 'Collapsible Outdoor Bucket', 'LXZ-3124-3002'],
    ['排气式收纳包', 'Vented Storage Bag', 'lxz-4042-1218'],
    ['气密式收纳包', 'Airtight Storage Bag', 'lxz-4042-3201'],
    ['云朵背包', 'Cloud Backpack', 'lxz-4381-4201'],
    ['手持气泵', 'Handheld Air Pump', 'lxz-3125-8891'],
    ['智能充气泵', 'Smart Electric Pump', 'lxz-3125-8890'],
    ['mini款充气泵', 'Mini Air Pump', 'lxz-3125-1101'],
    ['户外徒步雨衣', 'Trail Rain Jacket', 'lxz-3436-1009'],
    ['户外速干毛巾', 'Quick-dry Outdoor Towel', 'lxz-4381-2006'],
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
  items.map(([zh, en, sku], index) => ({
    id: String(index + 1),
    sku,
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
