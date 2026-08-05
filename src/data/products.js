const images = {
  tent: [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1533873984035-25970ab07461?auto=format&fit=crop&w=1200&q=85',
  ],
  sleepingpad: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1526491109672-74740652b963?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1496947850313-7743325fa58c?auto=format&fit=crop&w=1200&q=85',
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
}

export const categories = [
  { key: 'tent', zh: '帐篷', en: 'Tents', introZh: '从快速搭建到宽敞充气结构，为营地提供可靠庇护。', introEn: 'Reliable shelter, from quick-pitch privacy tents to spacious inflatable cabins.' },
  { key: 'sleepingpad', zh: '睡垫', en: 'Sleeping Pads', introZh: '兼顾支撑、保温和收纳体积的户外睡眠系统。', introEn: 'Outdoor sleep systems balancing support, insulation and compact packing.' },
  { key: 'sofa', zh: '沙发', en: 'Inflatable Sofas', introZh: '将居家般的放松体验带到草地、海边与营地。', introEn: 'Lounge-level comfort designed for campsites, beaches and backyards.' },
  { key: 'tableAndchair', zh: '桌椅', en: 'Tables & Chairs', introZh: '稳定轻量的营地家具，适合用餐、休息和社交。', introEn: 'Stable, lightweight camp furniture for dining, resting and gathering.' },
  { key: 'accessories', zh: '配件', en: 'Accessories', introZh: '从充气到收纳，让营地搭建更轻松的小型装备。', introEn: 'Compact essentials that make setup, inflation and packing effortless.' },
]

const names = {
  tent: [
    ['云阁充气小屋', 'Cloud Pavilion Air Cabin'], ['中号充气帐篷', 'Medium Inflatable Tent'],
    ['单人破舰者', 'Solo Breaker Tent'], ['充气凉棚', 'Inflatable Sun Shelter'],
    ['支架款更衣帐篷', 'Frame Privacy Tent'], ['速开款更衣帐篷', 'Quick-open Privacy Tent'],
    ['行军床帐篷', 'Cot Tent'],
  ],
  sleepingpad: [
    ['薄款奶酪垫', 'Slim Cheese Mat'], ['星栖奶酪垫', 'Starrest Cheese Mat'], ['拉丝垫子', 'Drop-stitch Mat'],
    ['拉丝云床', 'Drop-stitch Cloud Bed'], ['战术奶酪垫', 'Tactical Cheese Mat'], ['电动加厚充气床', 'Electric Comfort Air Bed'],
    ['羽绒枕头', 'Down Pillow'], ['战术枕头', 'Tactical Pillow'], ['云憩海绵软枕', 'Cloudrest Foam Pillow'],
    ['恒温坐垫', 'Thermal Seat Pad'], ['多点位恒温气垫', 'Multi-zone Thermal Air Mat'], ['星途恒温气垫', 'Startrail Thermal Air Mat'],
    ['普通坐垫', 'Classic Seat Pad'], ['tpu直拉带', 'TPU Straight Pull Strap'], ['带枕菱形脚踩气垫', 'Diamond Foot-pump Mat with Pillow'],
    ['U型充气枕', 'U-shaped Air Pillow'], ['V型气垫', 'V-shaped Air Mat'],
  ],
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
  ],
}

const categoryDetails = {
  tent: {
    zh: '采用耐磨防泼水面料与稳定支撑结构，兼顾通风、搭建效率和全天候营地体验。',
    en: 'Built with abrasion-resistant, water-repellent fabric and a stable support system for ventilation, fast setup and reliable all-weather use.',
    specsZh: [['外帐面料', '210D 牛津布'], ['防水指数', 'PU 3000 mm'], ['适用季节', '三季'], ['定制', '颜色 / 品牌标识 / 包装']],
    specsEn: [['Flysheet', '210D Oxford'], ['Waterproof rating', 'PU 3000 mm'], ['Season', '3 season'], ['Custom', 'Color / Logo / Package']],
  },
  sleepingpad: {
    zh: '人体工学支撑结构有效隔绝地面湿冷，亲肤表层兼顾静音与耐磨，收纳轻松。',
    en: 'Ergonomic support helps isolate cold, uneven ground, while the quiet, skin-friendly surface packs down with ease.',
    specsZh: [['表层材质', '亲肤复合面料'], ['气阀', '快速双向阀'], ['适用场景', '露营 / 自驾'], ['定制', '颜色 / 品牌标识 / 包装']],
    specsEn: [['Surface', 'Soft-touch composite'], ['Valve', 'Fast two-way valve'], ['Use', 'Camping / Overland'], ['Custom', 'Color / Logo / Package']],
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
    featured: (category === 'tent' && index < 4) || (category === 'sleepingpad' && index < 2),
  })),
)

export const getProduct = (category, id) => products.find((item) => item.category === category && item.id === String(id))
export const getCategory = (key) => categories.find((item) => item.key === key)
