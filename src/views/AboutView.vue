<script setup>
import { EffectScatterChart, LinesChart } from "echarts/charts";
import { GeoComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ArrowDownLeft, ArrowRight } from "lucide-vue-next";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useLocale } from "../composables/useLocale";
import {
  aboutCopy,
  aboutImages,
  channelLogos,
  heroFixedContent,
  outdoorCategories,
} from "../data/about";
import worldGeoJson from "../data/world.geo.json";

echarts.use([
  GeoComponent,
  TooltipComponent,
  EffectScatterChart,
  LinesChart,
  CanvasRenderer,
]);
echarts.registerMap("wolfwalker-world", worldGeoJson);

const { locale, t } = useLocale();
const copy = computed(() => aboutCopy[locale.value] ?? aboutCopy.zh);
const images = aboutImages;
// Hero 玻璃卡内容为设计稿固定图文，不随语言切换
const fixed = heroFixedContent;

// 「从帐篷到充气垫」左图右按钮：默认激活第一项，点击只切图不跳转
// （跳转入口语义仍由首页轮播/底部/产品页承担）
const outdoorCats = outdoorCategories;
const activeCatKey = ref(outdoorCats[0].key);
const activeCat = computed(
  () => outdoorCats.find((c) => c.key === activeCatKey.value) ?? outdoorCats[0]
);

const worldMapEl = ref(null);
let worldMapChart;
let worldMapResizeObserver;

const HUANGSHAN_COORD = [118.3376, 29.7147];
const PLANE_SYMBOL =
  "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";

const ROUTE_PALETTE = ["#a6c84c", "#ffa022", "#46bee9"];

const routeDestinations = [
  { key: "africa", zh: "非洲", en: "Africa", coord: [21.5, 5.5] },
  {
    key: "north-america",
    zh: "北美洲",
    en: "North America",
    coord: [-103, 44],
  },
  {
    key: "south-america",
    zh: "南美洲",
    en: "South America",
    coord: [-61, -17],
  },
  { key: "europe", zh: "欧洲", en: "Europe", coord: [12, 50] },
  { key: "oceania", zh: "大洋洲", en: "Oceania", coord: [134, -25] },
  { key: "russia", zh: "俄罗斯", en: "Russia", coord: [90, 61] },
  { key: "france", zh: "法国", en: "France", coord: [2.21, 46.23] },
  {
    key: "houston",
    zh: "美国 · 休斯顿",
    en: "Houston, USA",
    coord: [-95.37, 29.76],
  },
  {
    key: "argentina",
    zh: "阿根廷",
    en: "Argentina",
    coord: [-63.62, -38.42],
  },
  { key: "japan", zh: "日本", en: "Japan", coord: [138.25, 36.2] },
  {
    key: "saudi-arabia",
    zh: "沙特阿拉伯",
    en: "Saudi Arabia",
    coord: [45.08, 23.89],
  },
].map((destination, index) => ({
  ...destination,
  routeColor: ROUTE_PALETTE[index % ROUTE_PALETTE.length],
}));

const getWorldMapOption = () => {
  const isEnglish = locale.value === "en";
  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const originName = isEnglish ? "Huangshan, China" : "中国 · 黄山";
  const routeGroups = ROUTE_PALETTE.map((color) => ({
    color,
    data: routeDestinations
      .filter((destination) => destination.routeColor === color)
      .map((destination) => ({
        fromName: originName,
        toName: isEnglish ? destination.en : destination.zh,
        coords: [HUANGSHAN_COORD, destination.coord],
        value: 100,
      })),
  }));
  const pointData = [
    {
      name: originName,
      value: [...HUANGSHAN_COORD, 120],
      isOrigin: true,
      routeColor: "#de2910",
    },
    ...routeDestinations.map((destination) => ({
      name: isEnglish ? destination.en : destination.zh,
      value: [...destination.coord, 80],
      routeColor: destination.routeColor,
    })),
  ];
  const routeSeries = routeGroups.flatMap((group, groupIndex) => [
    {
      name: isEnglish ? "Route flow" : "航线流光",
      type: "lines",
      coordinateSystem: "geo",
      zlevel: 1,
      silent: true,
      effect: {
        show: !reduceMotion,
        loop: true,
        period: 6.5 + groupIndex * 0.6,
        delay: (index) => groupIndex * 260 + index * 520,
        trailLength: 0.68,
        color: group.color,
        symbolSize: 3,
      },
      lineStyle: {
        color: group.color,
        width: 0,
        opacity: 0.72,
        curveness: 0.2,
      },
      data: group.data,
    },
    {
      name: isEnglish ? "Global routes" : "全球航线",
      type: "lines",
      coordinateSystem: "geo",
      zlevel: 2,
      symbol: ["none", "arrow"],
      symbolSize: 8,
      silent: true,
      effect: {
        show: !reduceMotion,
        loop: true,
        period: 8.5 + groupIndex * 0.7,
        delay: (index) => groupIndex * 340 + index * 660,
        trailLength: 0,
        symbol: PLANE_SYMBOL,
        symbolSize: 17,
        color: group.color,
      },
      lineStyle: {
        color: group.color,
        width: 1.25,
        opacity: 0.72,
        curveness: 0.2,
      },
      data: group.data,
    },
  ]);

  return {
    animation: !reduceMotion,
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: "rgba(255, 255, 255, 0.96)",
      borderColor: "#d2d7db",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: "#30363b", fontSize: 12 },
      extraCssText: "box-shadow: 0 8px 24px rgba(37, 45, 51, 0.12);",
      formatter: (params) => {
        if (params.seriesType === "lines") {
          return `${params.data.fromName} → ${params.data.toName}`;
        }
        return params.name || "";
      },
    },
    geo: {
      map: "wolfwalker-world",
      roam: false,
      zoom: 1,
      left: "3%",
      right: "3%",
      top: "17%",
      bottom: "20%",
      label: { show: false },
      itemStyle: {
        areaColor: "#d9dde0",
        borderColor: "#ffffff",
        borderWidth: 0.9,
      },
      emphasis: {
        label: { show: true, color: "#30363b", fontSize: 11 },
        itemStyle: { areaColor: "#c7cdd2" },
      },
      select: { disabled: true },
    },
    series: [
      ...routeSeries,
      {
        name: isEnglish ? "Global destinations" : "全球目的地",
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 3,
        showEffectOn: reduceMotion ? "emphasis" : "render",
        rippleEffect: {
          period: 4,
          scale: 3.5,
          brushType: "stroke",
        },
        symbolSize: (_, params) => (params.data.isOrigin ? 13 : 9),
        itemStyle: {
          color: (params) => params.data.routeColor,
          shadowBlur: 8,
          shadowColor: (params) => params.data.routeColor,
        },
        label: {
          show: true,
          position: "right",
          distance: 6,
          color: "#30363b",
          fontSize: 10,
          fontWeight: 700,
          textBorderColor: "rgba(245, 246, 247, 0.96)",
          textBorderWidth: 4,
          formatter: "{b}",
        },
        data: pointData,
      },
    ],
  };
};const renderWorldMap = () => {
  if (!worldMapEl.value) return;
  worldMapChart ??= echarts.init(worldMapEl.value, null, {
    renderer: "canvas",
  });
  worldMapChart.setOption(getWorldMapOption(), true);
};

onMounted(async () => {
  await nextTick();
  renderWorldMap();
  worldMapResizeObserver = new ResizeObserver(() => worldMapChart?.resize());
  worldMapResizeObserver.observe(worldMapEl.value);
});

watch(locale, () => renderWorldMap());

onBeforeUnmount(() => {
  worldMapResizeObserver?.disconnect();
  worldMapChart?.dispose();
  worldMapChart = undefined;
});

// 品牌影像视频：使用原生 controls，不另做自制控制按钮
</script>

<template>
  <div class="about-page">
    <!-- 1. Hero：设计稿 y 0-1080（16:9），玻璃卡 (114,208,450)，底部四标签 -->
    <section class="about-hero">
      <img
        :src="images.hero"
        alt="Wolfwalker outdoor camping"
        fetchpriority="high"
        class="about-hero__bg"
      />
      <div class="about-hero__card" v-reveal="'animate__fadeIn'">
        <img :src="images.logo" alt="Wolf Walker" class="about-hero__logo" />
        <img
          :src="images.calligraphy"
          alt=""
          aria-hidden="true"
          class="about-hero__calligraphy"
        />
        <p class="about-hero__sub">{{ fixed.sub }}</p>
        <p class="about-hero__founded">
          {{ fixed.founded }}<br />{{ fixed.foundedEn }}
        </p>
        <RouterLink to="/product" class="about-hero__cta">
          {{ fixed.cta }} <ArrowRight :size="15" />
        </RouterLink>
      </div>
      <div class="about-hero__tags">
        <span v-for="tag in copy.heroTags" :key="tag">{{ tag }}</span>
      </div>
    </section>

    <!-- 2. 十年品牌：棕区 1080-2160（标题/文案/四宫格卡） -->
    <section class="about-decade">
      <h2 v-reveal="'animate__fadeInUp'" class="about-decade__title">
        {{ copy.decadeTitle }}
      </h2>
      <div class="about-decade__bar" v-reveal="'animate__fadeInUp'"></div>
      <div class="about-decade__lines" v-reveal="'animate__fadeInUp'">
        <p v-for="line in copy.decadeLines" :key="line">{{ line }}</p>
      </div>
      <div class="about-decade__cards" v-reveal="'animate__fadeIn'">
        <div
          v-for="card in copy.cards"
          :key="card.en"
          class="about-decade__card"
        >
          <img :src="card.image" :alt="card.en" loading="lazy" />
          <div class="about-decade__figure" v-reveal="'animate__zoomIn'">
            <img :src="card.icon" alt="" />
            <strong>{{ card.value }}</strong>
            <span>{{ card.en }}</span>
            <div class="about-decade__flag">{{ card.label }}</div>
          </div>
        </div>
      </div>
    </section>
    <!-- 3. 视频区：设计稿 2160-3240（1920×1080） -->
    <section class="about-video"  v-reveal="'animate__fadeIn'">
      <video
        controls
        loop
        playsinline
        preload="metadata"
        class="about-video__media"
      >
        <source
          src="https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/about/video.mp4"
          type="video/mp4"
        />
      </video>
    </section>

    <!-- 4. 棕色标题条（3240-3436）+ 白底区（3436-4308：沙发图/分类胶囊） -->
    <section class="about-outdoor">
      <h2 class="about-outdoor__title" v-reveal="'animate__fadeIn'">
        {{ copy.outdoorTitle }}
      </h2>
      <div class="about-outdoor__body">
        <img
          v-reveal="'animate__fadeIn'"
          :src="images.bg"
          alt=""
          aria-hidden="true"
          class="about-outdoor__bg"
        />
        <!-- 点击左图跳转对应分类的产品列表页，与公共底部链接同款效果 -->
        <RouterLink
          v-reveal="'animate__fadeInLeft'"
          :to="`/product?category=${activeCatKey}#product-list`"
          class="about-outdoor__photoFrame"
          :aria-label="activeCat[locale]"
        >
          <img
            :src="activeCat.image"
            :alt="activeCat[locale]"
            class="about-outdoor__photo"
          />
        </RouterLink>
        <nav
          class="about-outdoor__pills"
          :aria-label="t.products"
          v-reveal="'animate__fadeInRight'"
        >
          <button
            v-for="cat in outdoorCats"
            :key="cat.key"
            type="button"
            class="about-outdoor__pill"
            :class="{ 'is-active': cat.key === activeCatKey }"
            :aria-pressed="cat.key === activeCatKey"
            @click="activeCatKey = cat.key"
          >
            <ArrowDownLeft
              class="about-outdoor__pillArrow"
              :stroke-width="3"
              aria-hidden="true"
            />
            <span>{{ cat[locale] }}</span>
          </button>
        </nav>
      </div>
    </section>
    <!-- 5. 全球布局：浅灰平面世界地图与多色动态航线 -->
    <section class="about-global" v-reveal="'animate__fadeIn'">
      <div
        ref="worldMapEl"
        class="about-global__bg"
        role="img"
        :aria-label="
          locale === 'en'
            ? 'Animated multicolor global routes departing from Huangshan, China'
            : '从中国黄山出发前往全球国家与城市的多色动态航线地图'
        "
      ></div>
      <div class="about-global__heading">
        <h2 v-reveal class="about-global__title">{{ copy.globalTitle }}</h2>
        <p v-reveal class="about-global__sub">{{ copy.globalSub }}</p>
      </div>
      <div class="about-global__channels" v-reveal="'animate__fadeIn'">
        <span
          v-for="logo in channelLogos"
          :key="logo.name"
          class="about-global__channelCard"
        >
          <img :src="logo.image" :alt="logo.name" loading="lazy" />
        </span>
      </div>
    </section>

    <!-- 6. 行业认可：浅灰底上的白卡 5458-6288 -->
    <section class="about-industry"  v-reveal="'animate__fadeIn'">
      <div v-reveal class="about-industry__card">
        <h2 class="about-industry__title">{{ copy.industryTitle }}</h2>
        <p class="about-industry__sub">{{ copy.industrySub }}</p>
        <div class="about-industry__photoFrame">
          <img
            :src="images.certificates"
            alt="Certificates and awards"
            loading="lazy"
            class="about-industry__photo"
          />
        </div>
      </div>
    </section>

    <!-- 7. 发展历程雪山时间线：6288-8516（年份标注为设计稿内容） -->
    <section class="about-timeline"  v-reveal="'animate__fadeIn'">
      <img
        :src="images.mountain"
        alt="Wolfwalker milestones 2019-2025"
        loading="lazy"
        class="about-timeline__photo"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
// 设计稿 1920 宽，尺寸写法同 CustomView：d(设计px) = min(设计px, vw)，
// 1920 及以上锁定设计值，往下等比缩；平板/手机再单独覆盖。
@function d($px) {
  @return min(#{$px}px, #{$px * 0.0520833}vw);
}

.about-page {
  background: $white;
  color: $custom-body;
  font-family: $font-sans;
  overflow: hidden;
}

// ---------- 1. Hero（0-1080） ----------
.about-hero {
  position: relative;
  overflow: hidden;

  &__bg {
    display: block;
    width: 100%;
    height: auto;
    transition: transform 500ms ease;
    will-change: transform;
  }

  &:hover &__bg {
    transform: scale(1.025);
  }

  &__card {
    position: absolute;
    left: d(114);
    top: d(235);
    width: d(650);
    padding: d(48) d(56) d(52);
    // 设计稿：近透明的玻璃底 + 白色虚线描边（不是白色磨砂卡）
    border-radius: d(12);
    background: rgba(#000, 0.06);
    color: $white;
    text-align: center;
  }

  &__logo {
    display: block;
    width: d(232);
    margin: 0 auto;
  }

  &__calligraphy {
    display: block;
    width: 82%;
    margin: d(34) auto 0;
  }

  &__sub {
    margin: d(26) 0 0;
    font-size: d(27);
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  &__founded {
    margin: d(20) 0 0;
    font-size: d(19);
    line-height: 1.7;
    color: rgba($white, 0.92);
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: d(8);
    margin: d(34) 0 0;
    padding: d(14) d(42);
    // 设计稿按钮：透明底 + 黄色描边 + 黄字
    border: 1px solid #fff;
    color: #fff;
    font-size: d(21);
    font-weight: 700;
    text-decoration: none;
    transition: background-color 240ms ease, color 240ms ease;

    &:hover {
      background: #93563a;
      border-color: #93563a;
      color: #1c1c1c;
    }
  }

  &__tags {
    position: absolute;
    inset: auto 0 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: d(14) d(200);
    background: rgba(#0d130c, 0.55);
    color: rgba($white, 0.9);
    font-size: d(17);
    font-weight: 700;
    letter-spacing: 0.12em;

    // 设计稿：每个 tag 左侧一条白色竖线、最后一个右侧也有一条 ——
    // 首线由首项 ::before 提供、末线由末项 ::after 提供，相邻项共享中线。
    // 不做 uppercase：设计稿就是小写原样。
    span {
      position: relative;
      flex: 1;
      text-align: center;
      box-sizing: border-box;
      display: flex;
      justify-content: center;

      &::before,
      &:last-child::after {
        content: "";
        position: absolute;
        top: 50%;
        width: 4px;
        height: d(22);
        background: rgba($white, 1);
        transform: translateY(-50%);
      }

      &::before {
        left: 0;
      }

      &:last-child::after {
        right: 0;
      }
    }
  }
}

// ---------- 2. 十年品牌（1080-2160） ----------
.about-decade {
  position: relative;
  padding: d(48) 0 0;
  background: #93563a;

  &__title {
    margin: 0;
    color: $white;
    font-size: d(46);
    font-weight: 900;
    text-align: center;
    line-height: 1.15;
  }

  &__bar {
    width: d(56);
    height: d(6);
    margin: d(26) auto 0;
    background: #f5d90a;
  }

  &__lines {
    margin: d(34) auto d(48);
    max-width: d(1500);
    text-align: center;
    color: rgba($white, 0.92);
    font-size: d(24);
    line-height: d(42);
    font-weight: 500;
  }

  &__cards {
    display: flex;
    // 设计稿四卡无缝拼接，不留缝
    gap: 0;
    margin-top: d(0);
  }

  &__card {
    flex: 1;
    position: relative;
    overflow: hidden;

    // 只命中直接子级的背景大图；卡内还有 figure 的图标 img，
    // 不加 > 会被 width:100% 拉满整卡
    > img {
      display: block;
      width: 100%;
      height: d(712);
      object-fit: cover;
      transition: transform 500ms ease;
      will-change: transform;
    }

    &:hover > img {
      transform: scale(1.035);
    }
  }

  // 卡面信息组：图标 / 数字 / 英文 / 黄旗整体水平居中、沉在卡下部
  &__figure {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    bottom: d(100);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $white;
    text-align: center;
  }

  &__icon {
    display: block;
    width: d(55);
    height: auto;
    // 切图仅 55px，放大 3 倍勉强可看；拿到高清切图后换图即可
    image-rendering: auto;
    margin-bottom: d(34);
  }

  strong {
    display: block;
    font-family: $font-sans;
    font-size: d(52);
    font-weight: 900;
    line-height: 1.1;
  }

  &__en {
    display: block;
    margin-top: d(12);
    font-size: d(30);
    font-weight: 600;
    letter-spacing: 0.02em;
    color: rgba($white, 0.95);
  }

  &__flag {
    margin-top: d(22);
    padding: d(9) d(28);
    border-radius: d(10);
    background: #f5d90a;
    color: #1c1c1c;
    font-size: d(26);
    font-weight: 700;
  }
}

// ---------- 3. 视频区（2160-3240） ----------
.about-video {
  position: relative;

  &__media {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
    object-fit: cover;
    background: #e1dfe2;
  }

  &__control {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: d(96);
    height: d(96);
    border: 0;
    background: $signal;
    color: $white;
    cursor: pointer;
    transition: background-color 240ms ease;

    &:hover {
      background: #c95021;
    }
  }
}

// ---------- 4. 棕色标题条 + 沙发/胶囊（3240-4308） ----------
.about-outdoor {
  &__title {
    margin: 0;
    height: d(196);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #93563a;
    color: $white;
    font-size: d(52);
    font-weight: 900;
    text-align: center;
  }

  // 白底区：左大图（随激活分类切换）+ 右侧分类按钮列。
  // 背景铺雪山云海图（bg.png），内容上浮一层
  &__body {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: d(56);
    padding: d(54) d(120) d(60);
  }

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    // 原图 960x435 淡雅底图，铺满放大后压一点透明度，避免抢过前景
    opacity: 0.9;
  }

  &__photoFrame {
    position: relative;
    z-index: 1;
    display: block;
    width: d(1310);
    height: d(770);
    overflow: hidden;
  }

  &__photo {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 500ms ease;
    will-change: transform;
  }

  &__photoFrame:hover &__photo {
    transform: scale(1.025);
  }

  &__pills {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    // 与左侧大图同高、垂直均匀分布（设计稿按钮首尾对齐图顶/图底）
    height: d(770);
    padding: d(43) 0;
    box-sizing: border-box;
    justify-content: space-between;
  }

  &__pill {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: d(16);
    min-width: d(294);
    padding: d(10) d(28);
    border: 2px solid $white;
    border-radius: d(999);
    background: #262626;
    box-shadow: d(3) d(4) 0 rgba(0, 0, 0, 0.28);
    color: $white;
    font-size: d(28);
    font-weight: 700;
    cursor: pointer;
    transition:
      background-color 240ms ease,
      box-shadow 240ms ease,
      transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1);

    &::after {
      content: "";
      position: absolute;
      z-index: 0;
      top: -70%;
      left: -34%;
      width: 24%;
      height: 240%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($white, 0.34),
        transparent
      );
      pointer-events: none;
      transform: rotate(18deg) translateX(-180%);
      transition: transform 520ms ease;
    }

    > span,
    .about-outdoor__pillArrow {
      position: relative;
      z-index: 1;
    }

    .about-outdoor__pillArrow {
      width: d(28);
      height: d(28);
      color: #dff122;
      flex: none;
      transition: transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1);
    }

    &.is-active {
      background: #a34a2b;
    }

    &:hover,
    &:focus-visible {
      transform: translateY(d(-3)) scale(1.025);
      box-shadow: d(5) d(8) 0 rgba(0, 0, 0, 0.22);

      &::after {
        transform: rotate(18deg) translateX(650%);
      }

      .about-outdoor__pillArrow {
        transform: translate(d(-3), d(3)) rotate(-8deg);
      }
    }

    &:hover:not(.is-active),
    &:focus-visible:not(.is-active) {
      background: #3a3a3a;
    }

    &.is-active:hover,
    &.is-active:focus-visible {
      background: #b85634;
    }

    &:focus-visible {
      outline: d(3) solid #dff122;
      outline-offset: d(3);
    }
  }
}

// ---------- 5. 全球布局（4308-5366） ----------
.about-global {
  position: relative;
  min-height: d(1058);
  padding: d(34) 0 d(560);
  overflow: hidden;
  background: #eef0f1;
  text-align: center;

  &__heading {
    position: relative;
    z-index: 3;
  }

  &__title {
    margin: 0;
    color: #202428;
    font-size: d(56);
    font-weight: 900;
  }

  &__sub {
    margin: d(14) 0 0;
    color: rgba(#202428, 0.46);
    font-size: d(16);
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  // 平面化世界地图；ECharts 只响应悬停，不允许拖拽或滚轮缩放。
  &__bg {
    position: absolute;
    z-index: 1;
    inset: 0;
    width: 100%;
    height: 100%;
    cursor: default;
  }

  &__channels {
    position: absolute;
    z-index: 3;
    left: d(120);
    right: d(120);
    bottom: d(30);
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: d(12);
    padding: d(10);
    border-radius: d(14);
    background: rgba($white, 0.6);
    box-shadow: 0 d(10) d(28) rgba(42, 49, 54, 0.08);
  }

  &__channelCard {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: d(110);
    background: $white;

    img {
      max-width: 76%;
      max-height: 64%;
      object-fit: contain;
    }
  }
}
// ---------- 6. 行业认可（5458-6288） ----------
.about-industry {
  padding: 0 d(60) 0;

  &__card {
    background: $white;
    padding: d(112) d(80) d(40);
    text-align: center;
  }

  &__title {
    margin: 0;
    color: #1c1c1c;
    font-size: d(56);
    font-weight: 900;
  }

  &__sub {
    margin: d(14) 0 0;
    color: rgba(#1c1c1c, 0.4);
    font-size: d(16);
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  // 证书图（certificates.png，817×303）按自身比例完整展示。
  // 之前框写死 aspect-ratio: 1920/474 + cover，把图上下裁掉近三分之一。
  &__photoFrame {
    width: 100%;
    margin-top: d(44);
    overflow: hidden;
  }

  &__photo {
    display: block;
    width: 100%;
    height: auto;
    transition: transform 500ms ease;
    will-change: transform;
  }

  &__photoFrame:hover &__photo {
    transform: scale(1.025);
  }
}

// ---------- 7. 雪山时间线（6288-8516） ----------
.about-timeline {
  background: $white;
  overflow: hidden;

  &__photo {
    display: block;
    width: 100%;
    height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-hero__bg,
  .about-decade__card > img,
  .about-outdoor__photo,
  .about-industry__photo,
  .about-timeline__photo,
  .about-outdoor__pill,
  .about-outdoor__pillArrow {
    transition: none;
  }

  .about-hero:hover .about-hero__bg,
  .about-decade__card:hover > img,
  .about-outdoor__photoFrame:hover .about-outdoor__photo,
  .about-industry__photoFrame:hover .about-industry__photo,
  .about-timeline:hover .about-timeline__photo,
  .about-outdoor__pill:hover,
  .about-outdoor__pill:focus-visible,
  .about-outdoor__pill:hover .about-outdoor__pillArrow,
  .about-outdoor__pill:focus-visible .about-outdoor__pillArrow {
    transform: none;
  }

  .about-outdoor__pill::after {
    display: none;
  }
}

// ---------- 平板及以下：自由流堆叠 ----------
@include tablet-down {
  .about-hero {
    // 手机端 hero 图只有约 219px 高，玻璃卡塞不下且底部 tags 会压住卡片
    // 尾部 —— tags 改为流内深条排在图下方，卡片获得完整叠放空间
    &__card {
      left: 5%;
      top: 3%;
      width: 62%;
      padding: 3% 3%;
      border-radius: 10px;
    }

    // 卡内各级尺寸相对卡宽收敛，保证卡高 ≤ hero 图高（实测按钮曾压到 tags）
    &__logo {
      width: 40%;
    }

    // 手机端约为桌面观感的一半，避免书法字占满小卡
    &__calligraphy {
      width: 37%;
      margin-top: 3%;
    }

    &__sub {
      margin-top: 6px;
      font-size: clamp(9px, 2.6vw, 12px);
    }

    &__founded {
      margin-top: 4px;
      font-size: clamp(7px, 2vw, 9px);
    }

    &__cta {
      margin-top: 6px;
      padding: 4px 10px;
      gap: 4px;
      font-size: clamp(8px, 2.2vw, 11px);
    }

    &__tags {
      position: static;
      font-size: clamp(9px, 1.8vw, 13px);
      padding: 8px 0;
    }
  }

  .about-decade {
    padding-top: 8vw;

    &__title {
      font-size: clamp(22px, 4.4vw, 40px);
      padding: 0 4vw;
    }

    &__bar {
      margin-top: 3vw;
      width: 40px;
      height: 4px;
    }

    &__lines {
      margin-top: 4vw;
      padding: 0 6vw;
      font-size: clamp(12px, 2.4vw, 18px);
      line-height: 1.9;
    }

    // 一行两张，卡内上下留出呼吸间距
    &__cards {
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 5vw;
    }

    &__card {
      flex: 0 0 calc(50% - 4px);

      img {
        height: auto;
      }
    }

    &__figure {
      bottom: 7vw;
    }

    &__icon {
      margin-bottom: 3vw;
    }

    &__en {
      margin-top: 2vw;
      font-size: clamp(8px, 2.2vw, 12px);
    }

    &__flag {
      margin-top: 2.4vw;
      font-size: clamp(8px, 2.2vw, 12px);
    }

    &__card img {
      height: auto;
      margin-bottom: 2vw;
    }

    // figure 与桌面端同为居中列（图标/数字/英文/旗子流内堆叠），
    // 各级尺寸用 clamp 收敛，避免溢出 2 列小卡
    &__figure {
      left: 0;
      right: 0;
      bottom: 6vw;
    }

    &__icon {
      width: 15vw;
      max-width: 60px;
      margin-bottom: 2vw;
    }

    &__en {
      margin-top: 1vw;
      font-size: clamp(8px, 2vw, 12px);
    }

    &__flag {
      margin-top: 1.6vw;
      padding: 1.4vw 3.6vw;
      border-radius: 1.6vw;
      font-size: clamp(8px, 2vw, 12px);
    }

    &__figure strong {
      font-size: clamp(15px, 4vw, 28px);
    }
  }

  .about-outdoor {
    &__title {
      height: auto;
      padding: 6vw 4vw;
      font-size: clamp(18px, 3.6vw, 32px);
    }

    // 左图与右侧按钮列等高（stretch），按钮缩到约原来的 2/5 宽
    &__body {
      height: auto;
      flex-direction: row;
      align-items: stretch;
      gap: 3.5vw;
      padding: 6vw 4vw;
    }

    &__photoFrame {
      position: relative;
      width: 70%;
      height: auto;
      align-self: stretch;
    }

    &__photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center bottom;
    }

    &__pills {
      flex: 1;
      height: auto;
      justify-content: flex-start;
      align-items: center;
      gap: 2.2vw;
    }

    &__pill {
      // 约为原先通栏宽的 2/5，列内居中
      width: 80%;
      min-width: 0;
      justify-content: center;
      padding: 1vw 1.5vw;
      font-size: clamp(7px, 1.8vw, 10px);

      .about-outdoor__pillArrow {
        width: 2.2vw;
        max-width: 10px;
        height: auto;
      }
    }
  }

  .about-global {
    min-height: 134vw;
    padding: 9vw 0 36vw;

    &__title {
      font-size: clamp(22px, 4.4vw, 40px);
    }

    &__sub {
      margin-top: 2vw;
      padding: 0 5vw;
      font-size: clamp(9px, 1.7vw, 13px);
    }


    &__bg {
      top: 9vw;
      bottom: auto;
      height: 92vw;
    }

    // 两行渠道卡收回区块内部，避免 overflow:hidden 将其裁掉。
    &__channels {
      top: auto;
      bottom: 5vw;
      left: 4vw;
      right: 4vw;
      margin-top: 0;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2vw;
      padding: 2vw;
      border-radius: 2vw;
    }

    &__channelCard {
      flex: 0 0 22.5%;
      min-width: 0;
      height: 10vw;
      border-radius: 1.6vw;
    }

    &__channelCard img {
      max-width: 64%;
      max-height: 58%;
    }
  }

  .about-industry {
    margin-top: 0;
    padding: 6vw 4vw 0;

    &__card {
      padding: 7vw 5vw 5vw;
    }

    &__title {
      font-size: clamp(22px, 4.4vw, 40px);
    }

    &__sub {
      margin-top: 2vw;
      font-size: clamp(10px, 1.7vw, 13px);
    }

    &__photoFrame {
      margin-top: 6vw;
    }
  }
}
</style>
