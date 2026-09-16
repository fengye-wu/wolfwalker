<script setup>
import { ArrowDownLeft, ArrowRight } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useLocale } from "../composables/useLocale";
import {
  aboutCopy,
  aboutImages,
  channelLogos,
  heroFixedContent,
  outdoorCategories,
} from "../data/about";

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
        playsinline
        preload="metadata"
        poster="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=90"
        class="about-video__media"
      >
        <source
          src="https://videos.pexels.com/video-files/3130284/3130284-hd_1920_1080_30fps.mp4"
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
        <img
          v-reveal="'animate__fadeInLeft'"
          :src="activeCat.image"
          :alt="activeCat[locale]"
          class="about-outdoor__photo"
        />
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
    <!-- 5. 全球布局：浅灰区 4308-5366（标题/地图点阵/渠道条） -->
    <section class="about-global"  v-reveal="'animate__fadeIn'">
      <img
        :src="images.worldMap"
        alt=""
        aria-hidden="true"
        loading="lazy"
        class="about-global__bg"
      />
      <h2 v-reveal class="about-global__title">{{ copy.globalTitle }}</h2>
      <p v-reveal class="about-global__sub">{{ copy.globalSub }}</p>
      <div class="about-global__channels"  v-reveal="'animate__fadeIn'">
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
        <img
          :src="images.certificates"
          alt="Certificates and awards"
          loading="lazy"
          class="about-industry__photo"
        />
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

  &__bg {
    display: block;
    width: 100%;
    height: auto;
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

    // 只命中直接子级的背景大图；卡内还有 figure 的图标 img，
    // 不加 > 会被 width:100% 拉满整卡
    > img {
      display: block;
      width: 100%;
      height: d(712);
      object-fit: cover;
    }
  }

  // 卡面信息组：图标 / 数字 / 英文 / 黄旗整体水平居中、沉在卡下部
  &__figure {
    position: absolute;
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

  &__photo {
    position: relative;
    z-index: 1;
    display: block;
    width: d(1310);
    height: d(770);
    object-fit: cover;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: d(16);
    min-width: d(294);
    padding: d(10) d(28);
    // 设计稿按钮是全胶囊（圆角=高度一半），深底 + 白描边 + 右下硬投影
    border: 2px solid $white;
    border-radius: d(999);
    background: #262626;
    box-shadow: d(3) d(4) 0 rgba(0, 0, 0, 0.28);
    color: $white;
    font-size: d(28);
    font-weight: 700;
    cursor: pointer;
    transition: background-color 200ms ease;

    .about-outdoor__pillArrow {
      width: d(28);
      height: d(28);
      color: #dff122;
      flex: none;
    }

    &.is-active {
      // 激活态红棕底（设计稿第一项「山野帐篷」）
      background: #a34a2b;
    }

    &:hover:not(.is-active) {
      background: #3a3a3a;
    }
  }
}

// ---------- 5. 全球布局（4308-5366） ----------
.about-global {
  position: relative;
  padding: d(124) 0 d(560);
  text-align: center;

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

  // worldMap 点阵图铺满整区作背景，标题/副标题/渠道条全部叠在其上
  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  // 渠道 logo 卡片行：白色半透明底 + 轻模糊（毛玻璃），logo 居中
  &__channels {
    position: absolute;
    // 贴底 + 水平居中：左右对称限位（等距内缩），不使用 translate 偏移 ——
    // translateX(-50%) 要配 left: 50% 才是居中，配 left: 0 会把整行推出屏左
    left: d(160);
    right: d(160);
    bottom: d(30);
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: d(14);
    border-radius: d(16);
    background: rgba($white, 0.3);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  &__channelCard {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: d(120);
    border-radius: d(10);

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

  &__photo {
    display: block;
    width: 100%;
    aspect-ratio: 1920 / 474;
    object-fit: cover;
    margin-top: d(44);
  }
}

// ---------- 7. 雪山时间线（6288-8516） ----------
.about-timeline {
  background: $white;

  &__photo {
    display: block;
    width: 100%;
    aspect-ratio: 1920 / 2228;
    object-fit: cover;
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

    &__photo {
      // 保持桌面端的 relative：背景 __bg 是 absolute 定位，
      // photo 若落回 static 会被背景盖住。
      // 高度不写死：随按钮列 stretch 等高，cover 裁剪核心
      position: relative;
      width: 70%;
      height: auto;
      align-self: stretch;
      object-fit: cover;
      // 横图裁竖条：产品/帐篷等核心主体基本都在画面下部，取下核而不是居中
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
    padding: 40vw 0 8vw;

    &__title {
      font-size: clamp(22px, 4.4vw, 40px);
    }

    &__sub {
      margin-top: 2vw;
      font-size: clamp(10px, 1.7vw, 13px);
    }

    // 渠道条定位到区块下方（top:100% + 间距），不再叠在地图上
    &__channels {
      position: absolute;
      top: 100%;
      bottom: auto;
      left: 4vw;
      right: 4vw;
      margin-top: 5vw;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2.5vw;
      padding: 0;
    }

    // 4 列两行（渠道现为 8 个 logo），卡片整体缩小一档。
    // min-width:0 必须带：logo 切图有固有宽度，flex 项默认 min-width:auto
    // 会被图片撑破 basis、挤成三行
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
    // 顶部让出渠道条（absolute 挂在 about-global 下方）的高度
    margin-top: 27vw;
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

    &__photo {
      margin-top: 6vw;
    }
  }
}
</style>
