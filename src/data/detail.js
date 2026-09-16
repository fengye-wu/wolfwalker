// 商品详情页的品类级业务数据。按品类 key 取值（key 必须与 products.js
// 的 categories 一致，NeckPillow 大小写照抄），渲染层缺省回落到 tent 档。
//
// 交期与起订量的依据：大件（帐篷、沙发）生产周期长，充气/海绵类与
// 桌椅、配件较短；起订量按件型反比 —— 小件起订更高。
const OSS = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/detail";
const common = `${OSS}/common/1.jpg`;
const common2 = `${OSS}/common/2.jpg`;

// 交货时间（zh / en 两个格式）：帐篷、沙发 50-60 天，其余 40-50 天。
export const leadTimeByCategory = {
  tent: { zh: "50-60 天", en: "50-60 days" },
  sofa: { zh: "50-60 天", en: "50-60 days" },
  airpad: { zh: "40-50 天", en: "40-50 days" },
  foampad: { zh: "40-50 天", en: "40-50 days" },
  NeckPillow: { zh: "40-50 天", en: "40-50 days" },
  tableAndchair: { zh: "40-50 天", en: "40-50 days" },
  accessories: { zh: "40-50 天", en: "40-50 days" },
};

// 起订数量（件）：帐篷/沙发/桌椅 100，气垫/棉垫 200，枕头/配件 500。
export const moqByCategory = {
  tent: 100,
  sofa: 100,
  tableAndchair: 100,
  airpad: 200,
  foampad: 200,
  NeckPillow: 500,
  accessories: 500,
};

// ---------- 详情展示数据（detailList）----------
// 方案：分类配置表 + 渲染端破图兜底（ProductDetailView 里 @error 隐藏）。
//
// DETAIL_META 按分类配置：
//   video  该分类详情视频的文件名（OSS/video/ 下）。视频可跨分类共用：
//            airpad / foampad / NeckPillow / sofa 共用 airpad.mp4，
//            tent 用独立的 tent.mp4，桌椅与配件没有视频（null，不渲染视频位）。
//   counts 每个产品的详情图张数，按产品 id 顺序一项一个产品；
//          counts.length 就是该分类的产品数，必须与 products.js 的 names 一致
//
// 图片 URL 按规律生成：OSS/<分类>/<产品序号>/<图序>.jpg（1.jpg 起连号），
// 上传图片时按 counts[i] 的数量连号命名即可，代码不用动。
const DETAIL_META = {
  tent: {
    video: "tent.mp4",
    // 帐篷类的详情公共图单独用第二张（common2），其余分类仍共用 common/1.jpg
    common: common2,
    counts: [
      12, 6, 11, 11, 9, 9, 9, 10, 12, 11, 8, 10, 11, 12, 8, 11, 13, 11, 11, 10,
      7, 8, 10, 7, 8, 8,
    ],
  },
  airpad: {
    video: "airpad.mp4",
    counts: [9, 14, 10, 8, 9, 9, 10, 10, 8, 10, 10, 8],
  },
  foampad: {
    video: "airpad.mp4",
    counts: [10, 9, 9, 9, 8, 8, 7, 7],
  },
  NeckPillow: {
    video: "airpad.mp4",
    counts: [9, 9, 8, 7, 7, 7],
  },
  sofa: {
    video: "airpad.mp4",
    counts: [10, 10, 6, 5, 7],
  },
  tableAndchair: {
    video: null,
    counts: [9, 9, 9, 9, 9, 9, 9, 9, 9],
  },
  accessories: {
    video: null,
    // 产品级视频（下标 = 产品序 - 1，长度必须与 counts 一致）：
    // 1/2/5/6 号用帐篷视频，3/4 号用气垫视频，其余没有视频（null 不渲染视频位）。
    // 配了 videos 时按产品取值，未配的分类仍回落到 video 单值。
    videos: [
      "tent.mp4",
      "tent.mp4",
      "airpad.mp4",
      "airpad.mp4",
      "tent.mp4",
      "tent.mp4",
      null,
      null,
      null,
    ],
    counts: [9, 9, 9, 9, 9, 9, 9, 9, 9],
  },
};

const detailImages = (category, index) =>
  Array.from(
    { length: DETAIL_META[category].counts[index] ?? 0 },
    (_, i) => `${OSS}/${category}/${index + 1}/${i + 1}.jpg`,
  );

export const detailList = Object.fromEntries(
  Object.entries(DETAIL_META).map(([category, meta]) => [
    category,
    meta.counts.map((_, i) => {
      // 产品级 videos[i] 优先于分类级 video，两者都没有则不渲染视频位
      const video = meta.videos?.[i] ?? meta.video;
      return {
        video: video ? `${OSS}/video/${video}` : "",
        common: meta.common ?? common,
        img: detailImages(category, i),
      };
    }),
  ]),
);

// dev 校验：counts.length 与 products.js 该分类的产品数不一致时，
// 详情图会与产品 id 错位 —— 早一点在控制台喊出来。
if (import.meta.env?.DEV) {
  import("./products").then(({ products }) => {
    for (const [category, meta] of Object.entries(DETAIL_META)) {
      const actual = products.filter((p) => p.category === category).length;
      if (meta.counts.length !== actual) {
        console.warn(
          `[detail.js] ${category} 的 counts 有 ${meta.counts.length} 项，` +
            `但该分类有 ${actual} 个产品 —— 详情图会与产品 id 错位，请补齐。`,
        );
      }
    }
  });
}
