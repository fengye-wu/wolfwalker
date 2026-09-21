const OSS = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/product";

const images = {
  tent: [
    `${OSS}/tent/tent_1.jpg`,
    `${OSS}/tent/tent_2.jpg`,
    `${OSS}/tent/tent_3.jpg`,
    `${OSS}/tent/tent_4.jpg`,
    `${OSS}/tent/tent_5.jpg`,
    `${OSS}/tent/tent_6.jpg`,
    `${OSS}/tent/tent_7.jpg`,
    `${OSS}/tent/tent_8.jpg`,
    `${OSS}/tent/tent_9.jpg`,
    `${OSS}/tent/tent_10.jpg`,
    `${OSS}/tent/tent_11.jpg`,
    `${OSS}/tent/tent_12.jpg`,
    `${OSS}/tent/tent_13.jpg`,
    `${OSS}/tent/tent_14.jpg`,
    `${OSS}/tent/tent_15.jpg`,
    `${OSS}/tent/tent_16.jpg`,
    `${OSS}/tent/tent_17.jpg`,
    `${OSS}/tent/tent_18.jpg`,
    `${OSS}/tent/tent_19.jpg`,
    `${OSS}/tent/tent_20.jpg`,
    `${OSS}/tent/tent_21.jpg`,
    `${OSS}/tent/tent_22.jpg`,
    `${OSS}/tent/tent_23.jpg`,
    `${OSS}/tent/tent_24.jpg`,
    `${OSS}/tent/tent_25.jpg`,
    `${OSS}/tent/tent_26.jpg`,
  ],
  sofa: [
    `${OSS}/sofa/sofa-1.png`,
    `${OSS}/sofa/sofa-2.png`,
    `${OSS}/sofa/sofa-3.png`,
    `${OSS}/sofa/sofa-4.png`,
    `${OSS}/sofa/sofa-5.png`,
  ],
  tableAndchair: [
    `${OSS}/tableAndchair/tableAndchair_1.jpg`,
    `${OSS}/tableAndchair/tableAndchair_2.jpg`,
    `${OSS}/tableAndchair/tableAndchair_3.jpg`,
    `${OSS}/tableAndchair/tableAndchair_4.jpg`,
    `${OSS}/tableAndchair/tableAndchair_5.jpg`,
    `${OSS}/tableAndchair/tableAndchair_6.jpg`,
    `${OSS}/tableAndchair/tableAndchair_7.jpg`,
    `${OSS}/tableAndchair/tableAndchair_8.jpg`,
    `${OSS}/tableAndchair/tableAndchair_9.jpg`,
  ],
  accessories: [
    `${OSS}/accessories/accessories_1.jpg`,
    `${OSS}/accessories/accessories_2.jpg`,
    `${OSS}/accessories/accessories_3.jpg`,
    `${OSS}/accessories/accessories_4.jpg`,
    `${OSS}/accessories/accessories_5.jpg`,
    `${OSS}/accessories/accessories_6.jpg`,
    `${OSS}/accessories/accessories_7.jpg`,
    `${OSS}/accessories/accessories_8.jpg`,
    `${OSS}/accessories/accessories_9.jpg`,
  ],
  // 三类拆分后的商品沿用现有图库中的相近题材占位图，拿到真图后只替换 URL。
  airpad: [
    `${OSS}/airpad/airpad_1.jpg`,
    `${OSS}/airpad/airpad_2.jpg`,
    `${OSS}/airpad/airpad_3.jpg`,
    `${OSS}/airpad/airpad_4.jpg`,
    `${OSS}/airpad/airpad_5.jpg`,
    `${OSS}/airpad/airpad_6.jpg`,
    `${OSS}/airpad/airpad_7.jpg`,
    `${OSS}/airpad/airpad_8.jpg`,
    `${OSS}/airpad/airpad_9.jpg`,
    `${OSS}/airpad/airpad_10.jpg`,
    `${OSS}/airpad/airpad_11.jpg`,
    `${OSS}/airpad/airpad_12.jpg`,
  ],
  foampad: [
    `${OSS}/foampad/foampad_1.jpg`,
    `${OSS}/foampad/foampad_2.jpg`,
    `${OSS}/foampad/foampad_3.jpg`,
    `${OSS}/foampad/foampad_4.jpg`,
    `${OSS}/foampad/foampad_5.jpg`,
    `${OSS}/foampad/foampad_6.jpg`,
    `${OSS}/foampad/foampad_7.jpg`,
    `${OSS}/foampad/foampad_8.jpg`,
  ],
  NeckPillow: [
    `${OSS}/neckpillow/Neck%20Pillow_1.jpg`,
    `${OSS}/neckpillow/Neck%20Pillow_2.jpg`,
    `${OSS}/neckpillow/Neck%20Pillow_3.jpg`,
    `${OSS}/neckpillow/Neck%20Pillow_4.jpg`,
    `${OSS}/neckpillow/Neck%20Pillow_5.jpg`,
    `${OSS}/neckpillow/Neck%20Pillow_6.jpg`,
  ],
};

// 分类顺序决定产品页筛选条的排列，也决定 /product?category=xxx 的可选值。
// 充气卧垫、棉护睡垫、舒柔枕头是独立分类，不再保留 sleepingpad 总类。
// zh / en 与 data/footer.js 的 productLinks 逐项同名 —— 同一个品类在底部、
// 筛选条、商品卡角标、详情页面包屑上必须是同一个叫法，改一处要同步另一处。
// NeckPillow 的大小写是刻意的：路由里就写成 /product/NeckPillow/1，
// 路由参数大小写敏感，这里必须和路由枚举、footerRoutes 三处完全一致。
export const categories = [
  {
    key: "tent",
    zh: "山野帐篷",
    en: "tent",
    introZh: "从快速搭建到宽敞充气结构，为营地提供可靠庇护。",
    introEn:
      "Reliable shelter, from quick-pitch privacy tents to spacious inflatable cabins.",
  },
  {
    key: "airpad",
    zh: "充气卧垫",
    en: "airpad",
    introZh: "一次充气撑起整夜支撑，收起来只有一只水壶大小。",
    introEn:
      "Full-night support from a single inflation, packing down to the size of a water bottle.",
  },
  {
    key: "foampad",
    zh: "棉护睡垫",
    en: "foampad",
    introZh: "海绵夹层不怕扎、不用充气，铺开即睡。",
    introEn:
      "Puncture-proof foam cores that need no inflation — unroll and sleep.",
  },
  {
    key: "NeckPillow",
    zh: "舒柔枕头",
    en: "neckpillow",
    introZh: "贴合颈部曲线的营地枕，长途车程与帐篷里都用得上。",
    introEn:
      "Neck-contoured pillows that work as well on long drives as they do in the tent.",
  },
  {
    key: "sofa",
    zh: "户外软座",
    en: "sofa",
    introZh: "将居家般的放松体验带到草地、海边与营地。",
    introEn:
      "Lounge-level comfort designed for campsites, beaches and backyards.",
  },
  {
    key: "accessories",
    zh: "随行配件",
    en: "accessories",
    introZh: "从充气到收纳，让营地搭建更轻松的小型装备。",
    introEn:
      "Compact essentials that make setup, inflation and packing effortless.",
  },
  {
    key: "tableAndchair",
    zh: "便携桌椅",
    en: "tableAndchair",
    introZh: "稳定轻量的营地家具，适合用餐、休息和社交。",
    introEn:
      "Stable, lightweight camp furniture for dining, resting and gathering.",
  },
];

// 商品清单以 src/utils/products.json 为准。
// 中文名 / 编号按 JSON 原样保留；英文名是我按品名补的对应译法。
// JSON 里枕头分类写成了 "Neck Pillow"，路由和详情页仍用 NeckPillow，
// 这里继续用路由那个 key，否则 /product/NeckPillow/:id 会 404。
// 主图还没有到位：每类先循环现有占位图，详情页再从同类商品里抽两张补齐
// 三张缩略图。后期真图到了，只替换 images 对应下标即可。
const names = {
  tent: [
    [
      "云阁充气帐篷",
      "Cloud Pavilion Air Tent",
      "Lxz-1150-1102",
      "融入自然的栖居空间，为户外生活带来从容与雅致",
      "A dwelling that blends into nature, bringing ease and elegance to outdoor living.",
      [
        { num: 100, price: 97.0 },
        { num: 500, price: 89.6 },
        { num: 1000, price: 82.1 },
      ],
    ],
    [
      "中号充气帐篷",
      "Medium Inflatable Tent",
      "LXZ-1150-1116",
      "适中体量的户外居所，兼顾空间感与便携性",
      "A right-sized outdoor shelter balancing space and portability.",
      [
        { num: 100, price: 126.9 },
        { num: 300, price: 119.4 },
        { num: 500, price: 111.9 },
      ],
    ],
    [
      "破舰者帐篷",
      "Breaker Tent",
      "lxz-1200-0001",
      "以硬朗姿态迎接旷野，陪伴每一次出发",
      "A rugged companion that meets the wild on every departure.",
      [
        { num: 100, price: 47.8 },
        { num: 500, price: 41.8 },
        { num: 1000, price: 38.8 },
      ],
    ],
    [
      "充气凉棚天幕",
      "Inflatable Shade Canopy",
      "lxz-1150-1117",
      "开阔的户外会客厅，让相聚更有氛围",
      "A spacious open-air lounge that warms up every gathering.",
      [
        { num: 100, price: 119.4 },
        { num: 500, price: 117.9 },
        { num: 1000, price: 116.4 },
      ],
    ],
    [
      "支架更衣帐篷",
      "Frame Changing Tent",
      "lxz-1100-1",
      "户外生活的私密角落，守护从容与体面",
      "A private corner outdoors that guards your comfort and dignity.",
      [
        { num: 200, price: 31.3 },
        { num: 500, price: 29.9 },
        { num: 1000, price: 26.9 },
      ],
    ],
    [
      "折叠式更衣帐篷",
      "Folding Changing Tent",
      "lxz-1101-1001",
      "轻巧随行的私密空间，收纳无忧",
      "A light, portable private space that packs away without worry.",
      [
        { num: 300, price: 11.9 },
        { num: 700, price: 11.2 },
        { num: 1000, price: 10.4 },
      ],
    ],
    [
      "行军床帐篷",
      "Cot Tent",
      "lxz-1221-001",
      "离地而居的户外体验，干爽舒适一整晚",
      "An off-the-ground camping experience, dry and comfy all night.",
      [
        { num: 100, price: 46.3 },
        { num: 500, price: 41.8 },
        { num: 1000, price: 38.8 },
      ],
    ],
    [
      "充气穹顶天幕",
      "Inflatable Dome Canopy",
      "lxz-1001-0017",
      "圆润舒展的遮蔽空间，为营地增添仪式感",
      "A rounded, spacious shelter that adds ceremony to the campsite.",
      [
        { num: 500, price: 74.6 },
        { num: 1000, price: 70.1 },
        { num: 1500, price: 67.2 },
      ],
    ],
    [
      "阔野·半自动天幕",
      "Widefield Semi-auto Canopy",
      "lxz-1000-1330",
      "快速展开的旷野庇护，把时间留给风景",
      "Quick-opening shelter for the wild, saving your time for the view.",
      [
        { num: 500, price: 71.6 },
        { num: 1000, price: 70.1 },
        { num: 1500, price: 67.2 },
      ],
    ],
    [
      "袋鼠帐篷",
      "Kangaroo Tent",
      "lxz-1201-0012",
      "贴心的亲子户外空间，承载温暖的家庭记忆",
      "A thoughtful parent-child space that carries warm family memories.",
      [
        { num: 500, price: 41.8 },
        { num: 1000, price: 38.8 },
        { num: 1500, price: 37.3 },
      ],
    ],
    [
      "行者隧道帐篷",
      "Wanderer Tunnel Tent",
      "LXZ-1148-1105",
      "修长的户外走廊，串联起营地的每个角落",
      "A long tunnel gallery linking every corner of the campsite.",
      [
        { num: 100, price: 283.6 },
        { num: 200, price: 268.7 },
        { num: 300, price: 253.7 },
      ],
    ],
    [
      "大号半球形帐篷",
      "Large Dome Tent",
      "lxz-1143-5001",
      "宽敞的半球形居所，容纳更多户外想象",
      "A roomy dome dwelling with space for bigger outdoor imaginations.",
      [
        { num: 100, price: 268.7 },
        { num: 200, price: 261.2 },
        { num: 300, price: 253.7 },
      ],
    ],
    [
      "狼堡支架帐篷",
      "Wolfkeep Frame Tent",
      "LXZ-1144-1201-1",
      "稳固的营地堡垒，给足户外安全感",
      "A steady camp fortress that feels safe and solid outdoors.",
      [
        { num: 100, price: 194.0 },
        { num: 200, price: 179.1 },
        { num: 300, price: 164.2 },
      ],
    ],
    [
      "屋檐天幕",
      "Eave Canopy",
      "LXZ-1152-1304",
      "如屋檐般延展的遮蔽，营造家的归属感",
      "Eave-like shelter that brings the feeling of home.",
      [
        { num: 500, price: 29.9 },
        { num: 1000, price: 26.9 },
        { num: 1500, price: 25.4 },
      ],
    ],
    [
      "船形速开帐篷",
      "Boat Instant Tent",
      "lxz-1136-1304",
      "即刻开启的户外之旅，省时省心",
      "An instant start to your trip — quick to pitch, easy to love.",
      [
        { num: 500, price: 34.3 },
        { num: 1000, price: 31.3 },
        { num: 1500, price: 28.4 },
      ],
    ],
    [
      "游侠·铝杆帐篷",
      "Ranger Aluminum-pole Tent",
      "lxz-1200-0013",
      "轻量坚韧的旅伴，陪你走得更远",
      "A light yet tough companion that goes the extra mile.",
      [
        { num: 500, price: 67.2 },
        { num: 1000, price: 64.2 },
        { num: 1500, price: 61.2 },
      ],
    ],
    [
      "冰屋圆形帐篷",
      "Igloo Round Tent",
      "lxz-1143-2122",
      "独特的圆形居所，打造别具一格的营地风景",
      "A distinctive round dwelling with one-of-a-kind campsite charm.",
      [
        { num: 100, price: 238.8 },
        { num: 200, price: 235.8 },
        { num: 300, price: 231.3 },
      ],
    ],
    [
      "手搭穹顶天幕",
      "Hand-pitch Dome Canopy",
      "lxz-1000-1138",
      "亲手搭建的穹顶空间，享受动手的乐趣",
      "A hand-pitched dome for the joy of building it yourself.",
      [
        { num: 500, price: 82.1 },
        { num: 1000, price: 73.0 },
        { num: 1500, price: 70.0 },
      ],
    ],
    [
      "自动穹顶天幕",
      "Auto Dome Canopy",
      "lxz-1000-2030",
      "一键展开的穹顶庇护，轻松享受户外",
      "One-touch dome shelter for effortless time outdoors.",
      [
        { num: 500, price: 58.2 },
        { num: 1000, price: 55.2 },
        { num: 1500, price: 50.7 },
      ],
    ],
    [
      "六角速开帐篷",
      "Hex Instant Tent",
      "lxz-1151-1204",
      "六角造型的快速居所，空间利用更从容",
      "A hexagonal instant tent that uses space with ease.",
      [
        { num: 500, price: 23.9 },
        { num: 1000, price: 23.1 },
        { num: 1500, price: 22.4 },
      ],
    ],
    [
      "驼峰天幕",
      "Hump Canopy",
      "LXZ-1152-1302",
      "高耸的尖顶造型，如山峰般矗立营地",
      "A towering peak that stands tall over the campsite.",
      [
        { num: 100, price: 223.9 },
        { num: 500, price: 220.9 },
        { num: 1000, price: 216.4 },
      ],
    ],
    [
      "单层弹簧帐篷",
      "Single-layer Spring Tent",
      "lxz-1002",
      "弹簧结构的轻便居所，开合之间尽显巧思",
      "A spring-framed shelter whose open-and-close is pure ingenuity.",
      [
        { num: 500, price: 11.2 },
        { num: 1000, price: 10.4 },
        { num: 2000, price: 10.1 },
      ],
    ],
    [
      "苍狼·半球形帐篷",
      "Greywolf Dome Tent",
      "lxz-1143-2002",
      "沉稳的半球形设计，低调而可靠",
      "A calm dome design, understated and dependable.",
      [
        { num: 100, price: 223.9 },
        { num: 500, price: 220.9 },
        { num: 1000, price: 216.4 },
      ],
    ],
    [
      "摩托车帐篷",
      "Motorcycle Camping Tent",
      "lxz-1066",
      "专为摩旅打造的居所，与爱车一同出发",
      "Built for motorcycle touring — set off together with your ride.",
      [
        { num: 100, price: 104.5 },
        { num: 500, price: 101.5 },
        { num: 1000, price: 100.0 },
      ],
    ],
    [
      "印第安型帐篷",
      "Tipi Tent",
      "lxz-1143-1401",
      "复古的 tipi 造型，为营地注入异域风情",
      "A retro tipi silhouette that adds exotic flair to camp.",
      [
        { num: 500, price: 89.6 },
        { num: 1000, price: 86.6 },
        { num: 1500, price: 82.1 },
      ],
    ],
    [
      "风衫天幕",
      "Windshirt Canopy",
      "lxz-1141-1101",
      "如披风般的流线设计，与风共舞于旷野",
      "A cloak-like streamlined canopy dancing with the wind.",
      [
        { num: 200, price: 38.8 },
        { num: 500, price: 37.3 },
        { num: 800, price: 35.8 },
      ],
    ],
  ],
  airpad: [
    [
      "拉丝矮垫（单）",
      "Low-profile Drop-stitch Mat",
      "lxz-4339-1106",
      "低矮贴合的睡眠基底，让身体彻底放松",
      "A low-profile sleep base that lets the body fully relax.",
      [
        { num: 100, price: 19.4 },
        { num: 500, price: 17.9 },
        { num: 1000, price: 15.7 },
      ],
    ],
    [
      "星途恒温气垫",
      "Startrail Thermal Air Mat",
      "lxz-4042-1208",
      "如星空般静谧的睡眠体验，温暖相伴",
      "A serene, starry-quiet sleep with warmth all along.",
      [
        { num: 100, price: 31.3 },
        { num: 500, price: 29.9 },
        { num: 1000, price: 28.4 },
      ],
    ],
    [
      "电动加厚充气床",
      "Electric Thick Air Bed",
      "lxz-4217-92",
      "厚实饱满的充气床面，接近居家睡眠感",
      "A thick, plush air bed close to a home-bed feel.",
      [
        { num: 200, price: 41.8 },
        { num: 500, price: 40.3 },
        { num: 1000, price: 38.8 },
      ],
    ],
    [
      "两用坐垫",
      "Dual-use Seat Pad",
      "lxz-4381-1206",
      "一物两用的贴心设计，坐卧皆宜",
      "A thoughtful two-in-one design for sitting and lying.",
      [
        { num: 500, price: 2.7 },
        { num: 1000, price: 2.2 },
        { num: 2000, price: 1.9 },
      ],
    ],
    [
      "恒温坐垫",
      "Thermal Seat Pad",
      "lxz-4381-1211",
      "温暖的座靠体验，久坐也舒适",
      "Warm seating comfort that lasts through long sits.",
      [
        { num: 300, price: 9.7 },
        { num: 600, price: 9.0 },
        { num: 1000, price: 8.2 },
      ],
    ],
    [
      "海绵拉丝云床",
      "Foam Drop-stitch Cloud Bed",
      "lxzqd1206",
      "如云般柔软的睡感，沉入梦乡",
      "A cloud-soft sleep that sinks you into dreams.",
      [
        { num: 100, price: 89.6 },
        { num: 500, price: 86.6 },
        { num: 700, price: 82.1 },
      ],
    ],
    [
      "tpu直拉带气垫",
      "TPU Straight-strap Air Mat",
      "lxz-4135-4",
      "利落的支撑结构，平稳承托每一次翻身",
      "A clean support structure that steadies every turn.",
      [
        { num: 500, price: 12.7 },
        { num: 1000, price: 11.9 },
        { num: 1500, price: 10.4 },
      ],
    ],
    [
      "带枕菱形脚踩气垫",
      "Diamond Foot-pump Mat with Pillow",
      "lxz-4154-1002",
      "自带枕头的贴心设计，脚踩充气更便捷",
      "Built-in pillow and foot pump for easier inflation.",
      [
        { num: 500, price: 7.5 },
        { num: 1000, price: 7.2 },
        { num: 1500, price: 6.9 },
      ],
    ],
    [
      "V型气垫",
      "V-shaped Air Mat",
      "lxz-4039-1",
      "V型人体工学轮廓，贴合身体曲线",
      "A V-shaped ergonomic contour that hugs the body.",
      [
        { num: 500, price: 9.7 },
        { num: 1000, price: 9.0 },
        { num: 1500, price: 8.2 },
      ],
    ],
    [
      "糖葫芦充气床",
      "Candy-stick Air Bed",
      "LXZ-4239-1122",
      "趣味的串珠造型，为营地增添活泼气息",
      "A playful bead-on-a-stick look that livens up camp.",
      [
        { num: 500, price: 21.6 },
        { num: 1000, price: 20.9 },
        { num: 1500, price: 20.1 },
      ],
    ],
    [
      "双人加厚TPU充气床",
      "Double Thick TPU Air Bed",
      "lxz-4217-7",
      "双人共享的厚实睡感，安心入眠",
      "Thick double sleeping comfort for restful nights.",
      [
        { num: 500, price: 26.1 },
        { num: 1000, price: 25.1 },
        { num: 1500, price: 24.6 },
      ],
    ],
    [
      "花棱形双人带枕脚踩充气垫",
      "Faceted Double Foot-pump Mat with Pillow",
      "lxz-4316-4",
      "花棱纹理的双人垫面，美观与舒适兼得",
      "A faceted double surface both good-looking and comfy.",
      [
        { num: 500, price: 12.7 },
        { num: 1000, price: 11.8 },
        { num: 1500, price: 11.2 },
      ],
    ],
  ],
  foampad: [
    [
      "薄款奶酪垫",
      "Slim Cheese Pad",
      "lxz-4339-4001",
      "轻薄随行的泡沫垫，收纳无负担",
      "A slim foam pad that travels light and stores easy.",
      [
        { num: 300, price: 12.7 },
        { num: 500, price: 11.9 },
        { num: 1000, price: 10.4 },
      ],
    ],
    [
      "星栖奶酪垫",
      "Starrest Cheese Pad",
      "lxz-4339-1115",
      "如栖身星空下的柔软触感，伴你入眠",
      "Soft like sleeping under the stars, straight into dreams.",
      [
        { num: 200, price: 37.3 },
        { num: 500, price: 34.3 },
        { num: 1000, price: 31.3 },
      ],
    ],
    [
      "战术奶酪垫",
      "Tactical Cheese Pad",
      "lxz-4339-1103",
      "硬朗风格的泡沫垫，适配多种户外场景",
      "A rugged-style foam pad for many outdoor scenarios.",
      [
        { num: 200, price: 37.3 },
        { num: 500, price: 34.3 },
        { num: 1000, price: 31.3 },
      ],
    ],
    [
      "双人波点形自动充气垫",
      "Double Dotted Self-inflating Pad",
      "lxz-4335-1402",
      "波点纹理的双人垫，自动充气更省心",
      "A dotted double pad that self-inflates with ease.",
      [
        { num: 500, price: 14.9 },
        { num: 1000, price: 14.6 },
        { num: 1500, price: 14.2 },
      ],
    ],
    [
      "单人波点形自动充气垫",
      "Solo Dotted Self-inflating Pad",
      "lxz-4335-1403",
      "单人独享的波点垫，轻盈出发",
      "A solo dotted pad for a light start.",
      [
        { num: 500, price: 8.2 },
        { num: 1000, price: 7.9 },
        { num: 1500, price: 7.6 },
      ],
    ],
    [
      "一键式充放奶酪床",
      "One-touch Cheese Bed",
      "lxz-4239-1113",
      "一键操作的便捷睡床，充放自如",
      "One-touch inflation and deflation, fully effortless.",
      [
        { num: 500, price: 82.1 },
        { num: 1000, price: 80.6 },
        { num: 1500, price: 74.6 },
      ],
    ],
    [
      "青春版奶酪床",
      "Youth Cheese Bed",
      "LXZ-4239-1105",
      "活力满满的青春设计，为户外注入朝气",
      "A youthful design that energizes the outdoors.",
      [
        { num: 500, price: 53.7 },
        { num: 1000, price: 52.2 },
        { num: 1500, price: 49.3 },
      ],
    ],
    [
      "猛禽奶酪垫",
      "Raptor Cheese Pad",
      "lxz-3145-1104",
      "如猛禽般锐利的风格，硬核户外之选",
      "A raptor-sharp style for hardcore outdoor use.",
      [
        { num: 500, price: 52.2 },
        { num: 1000, price: 50.7 },
        { num: 1500, price: 49.3 },
      ],
    ],
  ],
  sofa: [
    [
      "双人躺靠式充气沙发",
      "Double Reclining Air Sofa",
      "LXZ-4321-1106",
      "双人躺靠的慵懒时光，尽享户外惬意",
      "Lazy lounging for two, fully enjoying the outdoors.",
      [
        { num: 100, price: 43.3 },
        { num: 500, price: 41.8 },
        { num: 1000, price: 38.8 },
      ],
    ],
    [
      "双人坐式充气沙发",
      "Double Seated Air Sofa",
      "LXZ-4321-1312",
      "并肩而坐的户外沙发，拉近彼此距离",
      "A side-by-side sofa that brings people closer.",
      [
        { num: 100, price: 56.7 },
        { num: 500, price: 53.7 },
        { num: 1000, price: 52.2 },
      ],
    ],
    [
      "单人两用沙发",
      "Solo Dual-use Sofa",
      "LXZ-4321-2001",
      "坐卧两用的灵活设计，随心切换",
      "A flexible sit-or-lie design, switch as you like.",
      [
        { num: 100, price: 59.7 },
        { num: 500, price: 56.7 },
        { num: 1000, price: 53.7 },
      ],
    ],
    [
      "头等舱单人充气沙发",
      "First-class Solo Air Sofa",
      "LXZ-4321-3001",
      "如头等舱般的包裹感，奢享户外休憩",
      "First-class embrace for a luxurious outdoor rest.",
      [
        { num: 100, price: 29.9 },
        { num: 500, price: 26.9 },
        { num: 1000, price: 25.4 },
      ],
    ],
    [
      "悠然·单人充气沙发",
      "Leisure Solo Air Sofa",
      "LXZ-4321-1203",
      "悠然自得的单人座，独享户外宁静",
      "An easygoing solo seat to own the outdoor quiet.",
      [
        { num: 300, price: 20.9 },
        { num: 1000, price: 20.1 },
        { num: 2000, price: 19.4 },
      ],
    ],
  ],
  NeckPillow: [
    [
      "羽绒充气枕头",
      "Down Inflatable Pillow",
      "lxz-4332-1605",
      "羽绒般的柔软触感，轻盈随行",
      "Down-soft touch that travels light.",
      [
        { num: 300, price: 11.9 },
        { num: 600, price: 11.2 },
        { num: 1000, price: 10.4 },
      ],
    ],
    [
      "U型旅行枕头",
      "U-shaped Travel Pillow",
      "lxz-4339-1120",
      "U型护颈设计，旅途中也能安心小憩",
      "A U-shaped neck support for naps on the go.",
      [
        { num: 500, price: 7.2 },
        { num: 1500, price: 6.7 },
        { num: 3000, price: 6.4 },
      ],
    ],
    [
      "海绵舒适软枕",
      "Soft Foam Camp Pillow",
      "lxz-4332-1602",
      "柔软蓬松的海绵枕，如居家般舒适",
      "A fluffy foam pillow as comfy as home.",
      [
        { num: 300, price: 6.7 },
        { num: 600, price: 6.0 },
        { num: 1000, price: 5.2 },
      ],
    ],
    [
      "战术风格充气枕头",
      "Tactical Inflatable Pillow",
      "lxz-4339-1109",
      "硬朗战术风格，与硬核装备相得益彰",
      "Tactical styling that matches hardcore gear.",
      [
        { num: 300, price: 7.5 },
        { num: 600, price: 7.2 },
        { num: 1000, price: 6.7 },
      ],
    ],
    [
      "卡其色奶酪枕",
      "Khaki Cheese Pillow",
      "lxz-4339-1501",
      "温润卡其色调，为营地增添柔和氛围",
      "Warm khaki tones that soften the campsite.",
      [
        { num: 300, price: 6.7 },
        { num: 600, price: 6.4 },
        { num: 1000, price: 6.0 },
      ],
    ],
    [
      "魔方自动充气枕",
      "Cube Self-inflating Pillow",
      "lxz-4332-1201",
      "魔方造型的自动充气枕，趣味与实用并存",
      "A cube-shaped self-inflating pillow, fun and practical.",
      [
        { num: 300, price: 4.5 },
        { num: 600, price: 4.2 },
        { num: 1000, price: 3.7 },
      ],
    ],
  ],
  tableAndchair: [
    [
      "小号单横杆月亮椅",
      "Small Single-bar Moon Chair",
      "lxz-3145-1115",
      "小巧的月亮椅造型，轻盈便携",
      "A compact moon chair, light and portable.",
      [
        { num: 100, price: 9.0 },
        { num: 500, price: 8.2 },
        { num: 1000, price: 7.9 },
      ],
    ],
    [
      "碳纤维月亮椅",
      "Carbon Fiber Moon Chair",
      "lxz-6128-2610",
      "碳纤维材质的轻量座椅，高端户外之选",
      "A carbon-fiber lightweight seat for premium outdoors.",
      [
        { num: 100, price: 25.4 },
        { num: 500, price: 23.9 },
        { num: 1000, price: 22.4 },
      ],
    ],
    [
      "四角马扎",
      "Four-corner Folding Stool",
      "lxz-6128-2604",
      "经典的四角马扎，稳固耐用",
      "The classic four-corner stool, steady and durable.",
      [
        { num: 100, price: 4.9 },
        { num: 500, price: 4.5 },
        { num: 1000, price: 4.2 },
      ],
    ],
    [
      "双横杆折叠躺椅",
      "Double-bar Folding Recliner",
      "lxz-6131-1507",
      "双横杆支撑的躺椅，舒展全身",
      "A double-bar recliner that stretches you out.",
      [
        { num: 100, price: 28.4 },
        { num: 500, price: 26.9 },
        { num: 1000, price: 24.6 },
      ],
    ],
    [
      "后背提拉椅",
      "Lift-back Camp Chair",
      "lxz-3145-1125",
      "提拉式便携设计，拎起就走",
      "A lift-and-go design — grab it and go.",
      [
        { num: 100, price: 29.9 },
        { num: 500, price: 26.9 },
        { num: 1000, price: 25.4 },
      ],
    ],
    [
      "四方躺平椅",
      "Square Flat Recliner",
      "lxz-6131-1513",
      "方正的躺平设计，彻底放松身心",
      "A square flat-recline design for total relaxation.",
      [
        { num: 100, price: 25.4 },
        { num: 500, price: 23.9 },
        { num: 1000, price: 23.1 },
      ],
    ],
    [
      "战术蝴蝶椅",
      "Tactical Butterfly Chair",
      "lxz-3145-1111",
      "蝴蝶展开的造型，战术风格拉满",
      "A butterfly-open shape with full tactical style.",
      [
        { num: 100, price: 13.4 },
        { num: 500, price: 11.9 },
        { num: 1000, price: 11.2 },
      ],
    ],
    [
      "车载钓鱼椅",
      "Car-mount Fishing Chair",
      "lxz-3145-1105",
      "专为车载与垂钓设计，陪伴悠闲时光",
      "Made for car trips and fishing, for leisurely hours.",
      [
        { num: 100, price: 25.4 },
        { num: 500, price: 24.6 },
        { num: 1000, price: 22.4 },
      ],
    ],
    [
      "轻便折叠布面桌",
      "Lightweight Folding Fabric Table",
      "lxz-3145-1801",
      "轻便的布面折叠桌，营地用餐好搭档",
      "A light fabric folding table, a great camp-dining mate.",
      [
        { num: 100, price: 11.9 },
        { num: 500, price: 11.2 },
        { num: 1000, price: 10.4 },
      ],
    ],
  ],
  accessories: [
    [
      "户外折叠水桶",
      "Collapsible Outdoor Bucket",
      "LXZ-3124-3002",
      "可折叠的便携水桶，户外取水好帮手",
      "A collapsible bucket, a handy helper for water outdoors.",
      [
        { num: 300, price: 4.5 },
        { num: 600, price: 4.2 },
        { num: 1000, price: 3.9 },
      ],
    ],
    [
      "排气式收纳包",
      "Vented Storage Bag",
      "lxz-4042-1218",
      "排气压缩的收纳设计，节省更多空间",
      "Vented compression storage that saves more space.",
      [
        { num: 300, price: 3.0 },
        { num: 600, price: 2.8 },
        { num: 1000, price: 2.5 },
      ],
    ],
    [
      "气密式收纳包",
      "Airtight Storage Bag",
      "lxz-4042-3201",
      "气密密封的收纳方案，妥善保护装备",
      "An airtight storage solution that protects your gear.",
      [
        { num: 100, price: 6.0 },
        { num: 500, price: 5.7 },
        { num: 1000, price: 5.2 },
      ],
    ],
    [
      "云朵背包",
      "Cloud Backpack",
      "lxz-4381-4201",
      "如云朵般轻盈的背包，背负无负担",
      "A cloud-light backpack with effortless carry.",
      [
        { num: 100, price: 10.4 },
        { num: 500, price: 10.1 },
        { num: 1000, price: 9.7 },
      ],
    ],
    [
      "手持气泵",
      "Handheld Air Pump",
      "lxz-3125-8891",
      "小巧的手持充气泵，随时为装备补气",
      "A compact hand pump to top up gear anytime.",
      [
        { num: 200, price: 18.7 },
        { num: 500, price: 17.9 },
        { num: 1000, price: 16.4 },
      ],
    ],
    [
      "智能充气泵",
      "Smart Electric Pump",
      "lxz-3125-8890",
      "智能控压的充气泵，省心又精准",
      "A smart pump with precise, worry-free control.",
      [
        { num: 200, price: 37.3 },
        { num: 500, price: 35.8 },
        { num: 1000, price: 32.8 },
      ],
    ],
    [
      "mini款充气泵",
      "Mini Air Pump",
      "lxz-3125-1101",
      "迷你尺寸的充气泵，收纳携带两相宜",
      "A mini pump that stores and carries well.",
      [
        { num: 200, price: 12.7 },
        { num: 500, price: 11.9 },
        { num: 1000, price: 11.2 },
      ],
    ],
    [
      "户外徒步雨衣",
      "Trail Rain Jacket",
      "lxz-3436-1009",
      "轻量便携的徒步雨衣，风雨中从容前行",
      "A light trail rain jacket for calm walking in the rain.",
      [
        { num: 500, price: 4.2 },
        { num: 1500, price: 3.9 },
        { num: 3000, price: 3.6 },
      ],
    ],
    [
      "户外速干毛巾",
      "Quick-dry Outdoor Towel",
      "lxz-4381-2006",
      "速干透气的户外毛巾，运动后快速干爽",
      "A quick-dry breathable towel, dry again in no time.",
      [
        { num: 500, price: 3.7 },
        { num: 1500, price: 3.0 },
        { num: 3000, price: 2.7 },
      ],
    ],
  ],
};

const categoryDetails = {
  tent: {
    zh: "采用耐磨防泼水面料与稳定支撑结构，兼顾通风、搭建效率和全天候营地体验。",
    en: "Built with abrasion-resistant, water-repellent fabric and a stable support system for ventilation, fast setup and reliable all-weather use.",
    // 详情页参数表头两行固定为「产品货号 / 产品类型」（渲染层生成），
    // 这里只保留品类特有的剩余参数。
    specsZh: [
      ["适用季节", "三季"],
      ["定制", "颜色 / 品牌标识 / 包装"],
    ],
    specsEn: [
      ["Season", "3 season"],
      ["Custom", "Color / Logo / Package"],
    ],
  },
  sofa: {
    zh: "宽大承托面配合稳定气室，快速充放气，在营地也能拥有松弛舒适的休息空间。",
    en: "A generous support area and stable air chambers create a relaxed camp lounge that inflates and packs quickly.",
    specsZh: [
      ["承重", "150–240 kg"],
      ["定制", "颜色 / 品牌标识 / 包装"],
    ],
    specsEn: [
      ["Load", "150–240 kg"],
      ["Custom", "Color / Logo / Package"],
    ],
  },
  tableAndchair: {
    zh: "轻量金属结构与高强度座布相结合，展开快捷、支撑稳定，满足多种营地活动。",
    en: "A lightweight metal frame and high-strength fabric deliver quick setup and dependable support around camp.",
    specsZh: [
      ["结构", "快速折叠"],
      ["定制", "颜色 / 品牌标识 / 包装"],
    ],
    specsEn: [
      ["Structure", "Quick folding"],
      ["Custom", "Color / Logo / Package"],
    ],
  },
  accessories: {
    zh: "围绕营地搭建、充气与收纳设计，体积小巧、使用直观，是户外系统中不可缺少的一环。",
    en: "Designed around setup, inflation and storage, this compact essential keeps every camp system working smoothly.",
    specsZh: [
      ["包装", "独立包装"],
      ["定制", "颜色 / 品牌标识 / 包装"],
    ],
    specsEn: [
      ["Packing", "Individual pack"],
      ["Custom", "Color / Logo / Package"],
    ],
  },
  airpad: {
    zh: "内置支撑气室撑起均匀承托，双向气阀快充快放，收纳后仅一只水壶大小。",
    en: "Internal support chambers spread weight evenly, while a two-way valve inflates and empties fast — packed down, it is no bigger than a water bottle.",
    specsZh: [
      ["收纳尺寸", "约 φ12 × 25 cm"],
      ["定制", "颜色 / 品牌标识 / 包装"],
    ],
    specsEn: [
      ["Packed size", "Approx. φ12 × 25 cm"],
      ["Custom", "Color / Logo / Package"],
    ],
  },
  foampad: {
    zh: "海绵夹层不用充气也不怕扎破，铺开即睡；折叠后可当营地坐垫。",
    en: "A foam core needs no inflation and shrugs off punctures — unroll to sleep, fold it up to sit on.",
    specsZh: [
      ["结构", "折叠 / 卷收"],
      ["定制", "颜色 / 品牌标识 / 包装"],
    ],
    specsEn: [
      ["Format", "Folding / roll-up"],
      ["Custom", "Color / Logo / Package"],
    ],
  },
  NeckPillow: {
    zh: "贴合颈部曲线的支撑造型，亲肤外套可拆洗，长途车程与帐篷里都用得上。",
    en: "Neck-contoured support with a removable, washable cover — equally at home on a long drive or in the tent.",
    specsZh: [
      ["收纳", "附收纳袋"],
      ["定制", "颜色 / 品牌标识 / 包装"],
    ],
    specsEn: [
      ["Storage", "Stuff sack included"],
      ["Custom", "Color / Logo / Package"],
    ],
  },
};

// names 每项结构：[中文名, 英文名, 货号, 中文简介, 英文简介, 档位价格]。
// description 直接用每个商品自己的简介（names 第 4/5 位），
// 不再回落到 categoryDetails 的品类描述（那两段保留给其它场景用）。
// tiers 是档位价格：[{ num, price }, ...]，详情页按三行展示。
export const products = Object.entries(names).flatMap(([category, items]) =>
  items.map(([zh, en, sku, zhIntro, enIntro, tiers], index) => ({
    id: String(index + 1),
    sku,
    category,
    name: { zh, en },
    description: {
      zh: zhIntro,
      en: enIntro,
    },
    tiers,
    specs: {
      zh: categoryDetails[category].specsZh,
      en: categoryDetails[category].specsEn,
    },
    image: images[category][index % images[category].length],
    imageAlt: { zh: `${zh}户外产品`, en: `${en} outdoor product` },
    featured:
      (category === "tent" && index < 4) ||
      (category === "airpad" && index < 2),
  })),
);

export const getProduct = (category, id) =>
  products.find((item) => item.category === category && item.id === String(id));
export const getCategory = (key) => categories.find((item) => item.key === key);

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
export const productHeroEyebrow = {
  zh: "WOLFWALKER / 产品系列",
  en: "WOLFWALKER / PRODUCT COLLECTION",
};

export const productHeroSlides = [
  {
    image: `${OSS}/one.jpg`,
    category: "tent",
    titleZh: "奔赴山野，解锁自由",
    titleEn: "Into the wild, unlock freedom",
    subtitleZh: "探寻帐篷气垫智造，尽享户外安歇",
    subtitleEn: "Smart-made tents and air mats for a restful night outdoors",
  },
  {
    image: `${OSS}/two.jpg`,
    category: "airpad",
    titleZh: "栖于天地，乐享自然",
    titleEn: "Dwell in the open, live with nature",
    subtitleZh: "深耕帐篷、充气气垫研发生产，定制户外理想居所",
    subtitleEn:
      "Tents and inflatable mats, developed and built in-house for your ideal camp",
  },
  {
    image: `${OSS}/three.jpg`,
    category: "foampad",
    titleZh: "纵情山海，自在无拘",
    titleEn: "Roam peaks and coasts, wholly free",
    subtitleZh: "专注帐篷与充气气垫，让山野旅居轻松随性",
    subtitleEn:
      "Focused on tents and air mats that keep life outdoors easy and unhurried",
  },
  {
    image: `${OSS}/four.jpg`,
    category: "sofa",
    titleZh: "身归旷野，心觅安然",
    titleEn: "Body in the wild, mind at ease",
    subtitleZh: "帐篷气垫源头工厂，打造户外舒适休憩方案",
    subtitleEn:
      "A source factory for tents and air mats, building comfort into every campsite",
  },
  {
    image: `${OSS}/five.jpg`,
    category: "NeckPillow",
    titleZh: "逐风而行，随遇而安",
    titleEn: "Follow the wind, at ease anywhere",
    subtitleZh: "枕垫相伴，享受美景，四海皆可安眠",
    subtitleEn: "Pillows and pads that turn any view into a good night’s sleep",
  },
  {
    image: `${OSS}/six.jpg`,
    category: "accessories",
    titleZh: "向野出发，静守清欢",
    titleEn: "Head outdoors, keep the quiet joy",
    subtitleZh: "一帐一垫搭配随行配件，尽享天地间松弛时刻",
    subtitleEn:
      "One tent, one mat and the right accessories for unhurried hours outside",
  },
  {
    image: `${OSS}/seven.jpg`,
    category: "tableAndchair",
    titleZh: "匠心致造，野境可期",
    titleEn: "Crafted with care, made for the wild",
    subtitleZh: "专注帐篷桌椅研发生产，铸就高品质户外旅居装备",
    subtitleEn:
      "Tents, tables and chairs developed in-house for high-quality life outdoors",
  },
];
