<script setup>
// 工厂介绍页。1:1 还原蓝湖「工厂介绍（中文板式）」/「工厂介绍」两版设计稿
// （画板 1920×4885，与 CSS px 一致），文案与尺寸见 src/data/factory.js 的注释。
//
// 尺寸写法：设计稿是定宽 1920 的稿子，所以每个尺寸都写成 d(设计px) ——
// 展开是 min(设计px, 对应vw)，1920 及以上锁定设计值，往下按比例缩，
// 手机端再单独覆盖（见样式末尾的 mobile 块）。
import { computed } from 'vue';
import { useLocale } from '../composables/useLocale';
import {
  contactRows,
  factoryCopy,
  factoryIcons,
  factoryImages,
  factoryLinks,
  statIcons
} from '../data/factory';

const { locale } = useLocale();

const copy = computed(() => factoryCopy[locale.value] ?? factoryCopy.zh);

// 四项厂房数据：数值文案来自 copy，图标是固定的四张，按下标配对。
const stats = computed(() =>
  copy.value.stats.map((item, index) => ({
    ...item,
    icon: statIcons[index]
  }))
);

// 两张工厂卡：卡片文案来自 copy，跳转地址来自 factoryLinks，按下标配对。
// 图片同样按下标取，卡 1 是帐篷工厂、卡 2 是气垫工厂。
const cardImages = [factoryImages.tentFactory, factoryImages.airFactory];
const factories = computed(() =>
  copy.value.factories.map((item, index) => ({
    ...item,
    image: cardImages[index],
    to: factoryLinks[index]
  }))
);

// 图标蒙版走 CSS 自定义属性下发，模板里不直接写 url()
const maskVar = (name) => ({ '--icon': `url(${factoryIcons[name]})` });
</script>

<template>
  <div class="factory-page">
    <!-- 右侧竖排 WOLFWALKER 水印。设计稿是 293×2923 的文字图层，
         首页已有同一张位图（bg2.png），这里复用，避免再传一份。 -->
    <img
      class="factory-page__watermark"
      src="https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/bg2.png"
      alt=""
      aria-hidden="true"
      loading="lazy"
    />

    <!-- 首屏大图：设计稿 1920×1044，与首页 hero 同比例 -->
    <section class="factory-hero">
      <img
        :src="factoryImages.hero"
        :alt="copy.heroAlt"
        decoding="async"
        fetchpriority="high"
      />
    </section>

    <!-- 十一年，只为一件事：左标题右正文 -->
    <section class="factory-intro">
      <div class="factory-intro__inner">
        <div class="factory-intro__lead" v-reveal="'animate__bounceInLeft'">
          <h1>{{ copy.introTitle }}</h1>
          <p class="factory-intro__tagline">
            {{ copy.introTagline }}
          </p>
        </div>
        <p v-reveal="'animate__bounceInRight'" class="factory-intro__body">
          {{ copy.introBody }}
        </p>
      </div>
    </section>

    <!-- 厂房面积 -->
    <section v-reveal="'animate__bounceIn'" class="factory-area">
      <strong class="factory-area__value">{{ copy.areaValue }}</strong>
      <h2 class="factory-area__label">{{ copy.areaLabel }}</h2>
      <p class="factory-area__note">{{ copy.areaNote }}</p>
    </section>

    <!-- 四项数据。灰色色带只到图标的一半高，图标是压在色带上沿的 -->
    <section class="factory-stats">
      <div class="factory-stats__band" aria-hidden="true"></div>
      <ul class="factory-stats__list">
        <li
          v-for="item in stats"
          :key="item.label"
          v-reveal="'animate__fadeInDown'"
        >
          <img :src="item.icon" alt="" aria-hidden="true" loading="lazy" />
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </section>

    <!-- 两张工厂卡，图和数据格左右交替 -->
    <section class="factory-cards">
      <div class="factory-cards__inner">
        <article
          v-for="(item, index) in factories"
          :key="item.alt"
          v-reveal
          class="factory-card"
          :class="{ 'factory-card--flip': index % 2 === 1 }"
        >
          <div class="factory-card__media">
            <img :src="item.image" :alt="item.alt" loading="lazy" />
            <RouterLink :to="item.to" class="factory-card__cta">
              {{ copy.cardCta }}
              <span class="factory-card__arrow" aria-hidden="true"></span>
            </RouterLink>
          </div>
          <ul class="factory-card__grid">
            <li
              v-for="cell in item.cells"
              :key="cell.label"
              v-reveal="'animate__fadeInUp'"
              :class="`is-${cell.tone}`"
            >
              <i
                class="factory-card__icon"
                :class="`is-${cell.icon}`"
                :style="maskVar(cell.icon)"
                aria-hidden="true"
              ></i>
              <strong>{{ cell.value }}</strong>
              <span>{{ cell.label }}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <!-- 联系方式 -->
    <section class="factory-contact">
      <div class="factory-contact__inner">
        <h2 v-reveal class="factory-contact__title">{{ copy.ctaTitle }}</h2>
        <ul
          v-reveal
          class="factory-contact__list"
          :aria-label="copy.contactLabel"
        >
          <li v-for="row in contactRows" :key="row.text">
            <a :href="row.href">
              <i
                class="factory-contact__icon"
                :class="`is-${row.icon}`"
                :style="maskVar(row.icon)"
                aria-hidden="true"
              ></i>
              <span>{{ row.text }}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
// 设计稿定宽 1920，所以每个尺寸都按「1920 以上锁死、往下等比缩」处理。
// 0.0520833 = 1/19.2，即 1 设计px 折算成 vw 的系数；只用乘法，避免 Sass 的除法弃用警告。
// 两个参数都插值成字符串，Sass 就不会去算这个 min()，原样输出成 CSS 的 min()。
@function d($px) {
  @return min(#{$px}px, #{$px * 0.0520833}vw);
}

// 正文小字不能纯按比例缩：设计稿 1920 下的 16.67px 到 1440 只剩 12.5px，
// 到 1024 更是 8.9px，没法读。这几处用 dm()，等比缩但不低于 $floor。
// 标题和数值不用管 —— 它们本来就大，缩下去仍然够看。
@function dm($px, $floor) {
  @return max(#{$floor}px, min(#{$px}px, #{$px * 0.0520833}vw));
}

.factory-page {
  position: relative;
  min-width: 320px;
  overflow: hidden;
  background: $white;
  color: $factory-text;
  font-family: $font-sans;

  // 首屏图 1920×1044，和首页 hero 同比例，所以沿用同一条高度表达式。
  // 水印要按它定位，提成变量给两处共用。
  --hero-height: #{max(min(54.375vw, 1044px), 557px)};

  @include tablet-down {
    --hero-height: #{max(min(64vw, 700px), 320px)};
  }
}

// 右侧竖排 WOLFWALKER。设计稿里是 293×2923 的文字图层，起点在首屏图底往上 23px。
// 复用的 bg2.png 自身是 268×2922，比 0.100 的设计稿更瘦（0.092），
// 按「图片保持原始比例」不写死 height，高度上限折进宽度里：
// 设计稿高度 2923 换算成这张图的宽度就是 2923 × 0.0917 ≈ 268，所以取 d(268) 而不是 d(293)。
// 给 293 的话高度会拉到 3194，多出来的 271 正好压在联系方式那几行字后面。
.factory-page__watermark {
  position: absolute;
  top: calc(var(--hero-height) - #{d(23)});
  right: 0;
  z-index: 0;
  width: d(268);
  pointer-events: none;

  // 手机端不显示：293 的原始宽度在 390 的屏上要占掉四分之三
  @include mobile {
    display: none;
  }
}

.factory-hero {
  position: relative;
  width: 100%;
  height: var(--hero-height);
  overflow: hidden;
  background: $card-placeholder;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 「十一年，只为一件事」这一屏。设计稿这块比下面的正文区更宽（120..1828），
// 所以单独用 $shell-factory-wide，不跟卡片区共用栏宽。
.factory-intro {
  position: relative;
  z-index: 1;
  // 首屏图底 1190 到标题 1222
  padding-top: d(32);

  &__inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: d(60);
    width: min(#{$shell-factory-wide}, 88.96%);
    margin: 0 auto;
  }

  h1 {
    margin: 0;
    color: $factory-brown;
    font-family: $font-serif;
    font-size: d(62.5);
    // 84.13 / 62.5，设计稿给的行距
    line-height: 1.346;
    // 文案里的 \n 就是设计稿的断行位置
    white-space: pre-line;
  }

  &__tagline {
    // 标题底 1367 到副标题 1378
    margin: d(11) 0 0;
    font-size: dm(16.67, 14);
    line-height: 1.497;
  }

  // 右栏正文，设计稿 550 宽、顶边比标题低 23
  &__body {
    flex: 0 0 auto;
    width: d(550);
    margin: d(23) 0 0;
    font-size: dm(16.67, 14);
    line-height: 1.497;
    white-space: pre-line;
  }
}

// 英文版正文设计稿给的是 12.5px（比中文小一档，因为同一段英文长得多）。
// :lang(en) 前缀匹配 documentElement 上的 en，由 useLocale 的 watch 同步。
:root:lang(en) .factory-intro {
  &__body {
    font-size: dm(12.5, 13);
  }

  // 英文标题设计稿是 54.17px，行距 leading 73.79 / 54.17 = 1.362
  h1 {
    font-size: d(54.17);
    line-height: 1.362;
  }
}

// 厂房面积。三行都居中：设计稿三个文本框中心分别在 974.5 / 949.5 / 944.5，
// 画板中心是 960，偏差在 15px 内，是设计稿手放的误差，按居中处理。
.factory-area {
  position: relative;
  z-index: 1;
  // 正文底 1411 到 12000m² 顶 1524
  padding-top: d(113);
  text-align: center;

  &__value {
    display: block;
    color: $factory-brown;
    font-family: $font-serif;
    font-size: d(240.4);
    // 设计稿这个文本框 180 高、字号 240.4，行高压到 0.75 才是这个高度；
    // 默认 1.2 会白多出 100 多 px，下面两行的位置就全错了。
    line-height: 0.75;
  }

  &__label {
    // 12000m² 底 1704 到「厂房面积」顶 1731
    margin: d(27) 0 0;
    font-family: $font-serif;
    font-size: d(41.67);
    line-height: 0.96;
  }

  &__note {
    // 「厂房面积」底 1771 到说明 1787
    margin: d(16) 0 0;
    font-family: $font-serif;
    font-size: d(25);
    line-height: 1;
    // 设计稿英文版这句是两行，中文是一行，都按内容自然断
    white-space: pre-line;
  }
}

// 四项厂房数据。灰色色带的上沿压在图标中间（图标 1914..2100，色带 2006 起），
// 所以色带单独一层绝对定位，不能用 section 的 background —— 那样只能整块铺满。
.factory-stats {
  position: relative;
  z-index: 1;
  // 说明文字底 1812 到图标顶 1914
  padding-top: d(102);
  // 色带底 2300 比最后一行文字底 2262 还低 38
  padding-bottom: d(38);

  &__band {
    position: absolute;
    top: d(194); // 1812 → 2006
    right: 0;
    left: 0;
    z-index: 0;
    height: d(294);
    background: $factory-band;
  }

  &__list {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    // 这一排比正文区宽：四个图标中心在 275/728/1182/1635，等间距 453，
    // 反推出栏宽 1813（≈94.44%），不是 $shell-factory 那 1598。
    width: min(1813px, 94.44%);
    margin: 0 auto;
    padding: 0;
    list-style: none;

    li {
      text-align: center;
    }

    img {
      display: block;
      width: d(186);
      height: d(186);
      margin: 0 auto;
      transition: scale 500ms ease;
    }

    // 鼠标移入放大 5%。这里比工厂卡那 2.5% 大一档：图标只有 186px，
    // 同样的比例在小图上几乎看不出来。
    //
    // 不裁切也不用包裹层 —— 一栏宽 453（1813 / 4），图标 186 居中，
    // 两侧各有 133px 余量，放大 5% 只多出 4.65px，落在余量里。
    // 悬停判定给整个 li 而不是 img：一栏里数值和标签都在图标正下方，
    // 指针落在文字上时图标跟着放大更自然。
    //
    // li 挂着 v-reveal（fadeInDown 用 transform），这里改的是 img 的
    // scale —— 独立属性，两者不共用一个属性槽，不会互相抹掉。
    @media (hover: hover) {
      li:hover img {
        scale: 1.05;
      }
    }

    strong {
      display: block;
      // 图标底 2100 到数值顶 2126
      margin-top: d(26);
      color: $factory-brown;
      font-family: $font-serif;
      font-size: d(125);
      // 设计稿这个文本框 92~94 高、字号 125，行高 0.75 才对得上
      line-height: 0.75;
    }

    // 「150+」是四个字符，设计稿单独收到 112.5px 求视觉等宽，照抄
    li:first-child strong {
      font-size: d(112.5);
    }

    span {
      display: block;
      // 数值底 2220 到标签顶 2237
      margin-top: d(17);
      font-family: $font-serif;
      font-size: d(25);
      line-height: 1;
    }
  }
}

// 两张工厂卡外面那条灰底：设计稿 2364.2..3367.8 通栏，卡片在里面上下各留一点。
.factory-cards {
  position: relative;
  z-index: 1;
  // 灰色色带底 2300 到这条灰底顶 2364.2
  margin-top: d(64.2);
  padding: d(26.8) 0 d(39.8);
  background: $factory-card-band;

  &__inner {
    display: grid;
    // 卡 1 底 2842 到卡 2 顶 2877.7
    gap: d(35.7);
    width: min(#{$shell-factory}, 83.23%);
    margin: 0 auto;
  }
}

.factory-card {
  display: grid;
  // 两栏各 764，中间 70（938 → 1008）
  grid-template-columns: 1fr 1fr;
  gap: d(70);
  align-items: start;

  // 卡 1 是数据格在左、图在右；卡 2 反过来。
  // 用 grid-column 换位而不是 order，DOM 顺序保持「图 → 数据」，读屏先念图再念数据。
  // grid-row 必须一起写死：卡 1 的图在第 2 栏、数据格在第 1 栏，
  // 稀疏排布下自动光标走过第 1 栏就不会再回填，数据格会掉到第二行去。
  &__media {
    grid-area: 1 / 2;
  }

  &__grid {
    grid-area: 1 / 1;
  }

  &--flip &__media {
    grid-area: 1 / 1;
  }

  &--flip &__grid {
    grid-area: 1 / 2;
  }
}

.factory-card__media {
  position: relative;
  // 设计稿 764×444，切出来的图正好是这个尺寸，cover 不会裁到
  aspect-ratio: 764 / 444;
  overflow: hidden;
  background: $card-placeholder;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: scale 500ms ease;
  }

  // 鼠标移入放大 2.5%，跟首页分类卡一个量。外层有 overflow: hidden，
  // 多出来的部分被框裁掉，版面不动。
  // 只在有真实指针的设备上：触屏点一下 hover 会一直粘着，图会一直保持放大。
  // 用 scale 而不是 transform：卡片外层挂着 v-reveal，虽然入场位移在
  // article 上、这里是子级的 img，但统一用独立属性，以后给图自己加 reveal
  // 也不会打架。
  @media (hover: hover) {
    &:hover img {
      scale: 1.025;
    }
  }
}

// 图上左下角的「查看」按钮，设计稿 174×55
.factory-card__cta {
  position: absolute;
  bottom: d(18);
  left: d(32);
  display: inline-flex;
  align-items: center;
  // 文字右边 106 到圆点 124.8
  gap: d(18.8);
  // 英文是 View，比「查看」宽，撑开就好，别裁
  min-width: d(174);
  // 上下按 55 高居中，左右按文字 32 / 圆点右侧 15.8
  padding: 0 d(15.8) 0 d(32);
  height: d(55);
  border-radius: d(27.5);
  background: $factory-brown;
  color: $white;
  font-size: d(38.64);
  font-weight: 900;
  line-height: 1;
  text-decoration: none;
  transition: background 300ms ease;

  &:hover,
  &:focus-visible {
    background: $factory-brown-dark;
  }
}

// 白圆点 + 棕色右向三角，设计稿圆 33.4、三角 18.5×21.6
.factory-card__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: d(33.4);
  height: d(33.4);
  border-radius: 50%;
  background: $white;

  &::before {
    content: '';
    // 用 border 画三角：左边框给宽度，上下透明边框给高度
    border-top: d(10.8) solid transparent;
    border-bottom: d(10.8) solid transparent;
    border-left: d(18.5) solid $factory-brown;
  }
}

// 2×2 的风车格：窄格 236、宽格 500，两行左右互换，所以不能用两列模板。
// 拆成五列（236 / 28间隙 / 236 / 28间隙 / 236），宽格跨后三列或前三列，
// 间隙也用 fr 参与分配，整块跟着容器等比缩。
.factory-card__grid {
  display: grid;
  grid-template-columns: 236fr 28fr 236fr 28fr 236fr;
  // 上行 194 高、下行 236 高，中间 20
  grid-template-rows: 194fr 20fr 236fr;
  // 设计稿 764×450。高度靠这条比例定下来，行的 fr 才有东西可分。
  aspect-ratio: 764 / 450;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    flex-direction: column;
    // 设计稿里图标贴右上、数值和标签贴左下，两行格子高度不同（194 / 236）
    // 也是这么排的，所以用 margin-top: auto 顶到底，而不是写死间距。
    padding: d(11) d(16) d(17) d(25);
    // 入场动效由 v-reveal 的 animate__fadeInUp 负责，收得比默认的 1s 快一点，
    // 四格错开后整组才不至于拖太长。
    --animate-duration: 620ms;
    // hover 用独立的 translate / scale，不用 transform ——
    // animate.css 是 fill-mode: both，动画结束后 transform 停在终值上并继续
    // 占着这个属性，hover 再写 transform 会把两个意图挤到一处。
    transition:
      translate 320ms $ease-rise,
      scale 320ms $ease-rise;
  }

  // 四格依次进场，每格错 90ms。顺序按视觉位置而不是 DOM 顺序 ——
  // 下面的 grid-area 把第 2 格放在了右上、第 3 格放在左下，
  // 而 DOM 里它们是 1→2→3→4，视觉上正好是「左上、右上、左下、右下」，
  // 两者一致，所以直接按 nth-child 排延迟就行。
  li:nth-child(2) {
    animation-delay: 90ms;
  }

  li:nth-child(3) {
    animation-delay: 180ms;
  }

  li:nth-child(4) {
    animation-delay: 270ms;
  }

  // 鼠标移入整格上浮 4px 并微放大。只在有真实指针的设备上：
  // 触屏 hover 会一直粘着，格子会保持抬起。
  @media (hover: hover) {
    li:hover {
      translate: 0 -4px;
      scale: 1.012;
    }

    // 格子抬起时图标同步放大一点，两个动作一起收尾
    li:hover .factory-card__icon {
      scale: 1.12;
    }
  }

  li:nth-child(1) {
    grid-area: 1 / 1;
  }

  li:nth-child(2) {
    grid-area: 1 / 3 / 2 / 6;
  }

  li:nth-child(3) {
    grid-area: 3 / 1 / 4 / 4;
  }

  li:nth-child(4) {
    grid-area: 3 / 5;
  }

  .is-dark {
    background: $factory-brown;
    color: $factory-cell;
  }

  .is-light {
    background: $factory-cell;
    color: $factory-brown;
  }

  strong {
    margin-top: auto;
    font-size: d(54.17);
    font-weight: 900;
    // 设计稿文本框 38~39 高、字号 54.17
    line-height: 0.72;
  }

  // _motion.scss 的全局兜底把 animation-duration 压到 0.01ms，但没管
  // animation-delay。animate.css 是 fill-mode: both，延迟期间格子停在
  // opacity: 0 —— 不清掉延迟，后三格会先空着再突然出现。
  @include reduced-motion {
    li {
      animation-delay: 0ms !important;
    }
  }

  span {
    // 数值底到标签顶，两行格子都是 31
    margin-top: d(31);
    font-size: d(20.83);
    font-weight: 900;
    line-height: 1;
  }
}

// 品类图标。设计稿里同一个图形在深浅两种格子上是白线 / 棕线两种颜色，
// 所以切图存成只有 alpha 的蒙版，颜色由 background-color 给，一份文件两处用。
.factory-card__icon {
  align-self: flex-end;
  mask-image: var(--icon);
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  background-color: currentcolor;
  // 跟着格子的 hover 一起放大（规则在 .factory-card__grid 里）。
  // 时长与格子一致，两个动作同时收尾。
  transition: scale 320ms $ease-rise;

  // 两张卡的图标原始尺寸不同，各自按原尺寸给，别互相拉伸
  &.is-tent {
    width: d(30);
    height: d(24);
  }

  &.is-pad {
    width: d(38);
    height: d(26);
  }
}

// 联系方式。左边大标题，右边三行「图标 + 右对齐文字 + 下划线」。
.factory-contact {
  position: relative;
  z-index: 1;
  // 灰底底 3367.8 到标题顶 3600
  padding: d(232) 0 d(245);

  &__inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: d(60);
    // 标题从 162 起、联系方式右端 1754
    width: min(1592px, 82.92%);
    margin: 0 auto;
  }

  &__title {
    margin: 0;
    color: $factory-brown;
    font-size: d(125);
    font-weight: 900;
    // 145.06 / 125
    line-height: 1.16;
    white-space: pre-line;
  }
}

// 英文版这句设计稿给到 175.27px
// 英文版这块不只是字号变了，行距也另设了一套：
// 设计稿 leading 174.14 / size 175.27 = 0.994，中文版是 145.06 / 125 = 1.16。
// 照中文那 1.16 排，两行会高出 58px。
:root:lang(en) .factory-contact__title {
  font-size: d(175.27);
  line-height: 0.994;
}

// 三行联系方式。设计稿里每行右端都对齐在 1754，下划线从图标左沿一直画到文字右沿 ——
// 也就是「整行加一条下边框」，行越长线越长，不是三条等长的线。
.factory-contact__list {
  display: flex;
  flex-direction: column;
  // 右对齐，行宽各自由内容决定
  align-items: flex-end;
  // 下划线到下一行图标 14.4~17.9
  gap: d(16);
  // 标题顶 3600 到第一行图标顶 3685
  margin: d(85) 0 0;
  // 加了外框，得给内容留出与框的间距，否则文字贴在线上。
  // 左右比上下宽一档：右侧要留住三行右对齐的视觉边界，左侧最长那行的
  // 图标也不能顶着框。
  padding: d(30) d(38);
  list-style: none;
  // 2px 实线不跟着 d() 缩 —— 与行内那条下划线同理，缩到 1px 以下会看不见。
  border: 2px solid #000;
  // 20px 是定值，不随视口缩：圆角跟着缩会在窄屏几乎看不出弧度。
  border-radius: 20px;

  a {
    display: inline-flex;
    align-items: center;
    // 图标右沿到文字左沿 16~18
    gap: d(17);
    padding-bottom: d(4);
    // 设计稿是 2px 的实线，这条不跟着缩，缩到 1px 以下会看不见
    border-bottom: 2px solid $factory-contact;
    color: $factory-contact;
    font-size: d(33.33);
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    transition:
      color 300ms ease,
      border-color 300ms ease;

    &:hover,
    &:focus-visible {
      border-color: $factory-brown;
      color: $factory-brown;
    }
  }
}

// 联系方式图标同样是 alpha 蒙版，颜色跟着 a 的 currentcolor 走，hover 一起变。
.factory-contact__icon {
  flex: 0 0 auto;
  mask-image: var(--icon);
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  background-color: currentcolor;

  &.is-tel {
    width: d(39);
    height: d(32);
  }

  &.is-mobile {
    width: d(37);
    height: d(37);
  }

  &.is-mail {
    width: d(44);
    height: d(33);
  }
}

// ---------- 平板及以下 ----------
// 设计稿只有 1920 一版，窄屏的版式是这里定的。
// 一旦左右并排改成上下堆叠，元素相对视口就宽了很多，字号不能再跟着 vw 缩，
// 所以下面这些块把字号显式写死，不再用 d()。
@include tablet-down {
  .factory-intro {
    padding-top: 44px;

    &__inner {
      flex-direction: column;
      gap: 22px;
      width: calc(100% - 64px);
    }

    h1 {
      font-size: 40px;
    }

    &__body {
      width: 100%;
      margin-top: 0;
      font-size: 15px;
    }
  }

  :root:lang(en) .factory-intro h1 {
    font-size: 36px;
  }

  :root:lang(en) .factory-intro__body {
    font-size: 14px;
  }

  .factory-area {
    padding-top: 72px;

    &__value {
      font-size: 96px;
    }

    &__label {
      margin-top: 18px;
      font-size: 26px;
    }

    &__note {
      width: calc(100% - 64px);
      margin-right: auto;
      margin-left: auto;
      font-size: 15px;
    }
  }

  .factory-stats {
    padding: 64px 0 32px;

    &__list {
      width: calc(100% - 48px);

      img {
        width: 108px;
        height: 108px;
      }

      strong,
      li:first-child strong {
        margin-top: 18px;
        font-size: 54px;
      }

      span {
        margin-top: 12px;
        font-size: 15px;
      }
    }

    // 色带原本压在图标腰上（图标 186 高、色带从 92 处开始），
    // 图标缩到 108 后按同一比例：顶边 = 上留白 64 + 108×92/186 ≈ 117
    &__band {
      top: 117px;
      height: 170px;
    }
  }

  .factory-cards {
    margin-top: 48px;
    padding: 24px 0 28px;

    &__inner {
      gap: 28px;
      width: calc(100% - 48px);
    }
  }

  // 图和数据格改上下排：DOM 里图在前，堆叠后就是「图 → 数据」，两张卡一致。
  .factory-card {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  // grid-row 也要放开：宽屏那边写的是 grid-area: 1 / x，
  // 只改 grid-column 的话两个还都钉在第 1 行，会重叠在一起。
  .factory-card__media,
  .factory-card__grid,
  .factory-card--flip .factory-card__media,
  .factory-card--flip .factory-card__grid {
    grid-row: auto;
    grid-column: 1;
  }

  .factory-card__cta {
    bottom: 16px;
    left: 16px;
    gap: 12px;
    min-width: 0;
    height: 46px;
    padding: 0 14px 0 18px;
    font-size: 20px;
  }

  .factory-card__arrow {
    width: 26px;
    height: 26px;

    &::before {
      border-top-width: 8px;
      border-bottom-width: 8px;
      border-left-width: 14px;
    }
  }

  // 风车格保留（宽窄格左右互换那个效果在窄屏也成立），只把字和内边距调大
  .factory-card__grid {
    li {
      padding: 12px 14px 16px 18px;
    }

    strong {
      font-size: 32px;
    }

    span {
      margin-top: 16px;
      font-size: 13px;
    }
  }

  .factory-card__icon {
    &.is-tent {
      width: 22px;
      height: 18px;
    }

    &.is-pad {
      width: 26px;
      height: 18px;
    }
  }

  .factory-contact {
    padding: 88px 0 92px;

    &__inner {
      flex-direction: column;
      gap: 34px;
      width: calc(100% - 48px);
    }

    &__title {
      font-size: 40px;
    }

    // 堆叠后标题在上，这一列跟着左对齐，右对齐会显得没着落
    &__list {
      align-items: flex-start;
      gap: 14px;
      margin-top: 0;
      // 堆叠后这一列是满宽，框内留白按固定值给（d() 在窄屏会缩到十几px）
      padding: 20px 24px;

      a {
        gap: 12px;
        padding-bottom: 6px;
        font-size: 19px;
      }
    }
  }

  :root:lang(en) .factory-contact__title {
    font-size: 44px;
  }

  .factory-contact__icon {
    &.is-tel {
      width: 23px;
      height: 19px;
    }

    &.is-mobile {
      width: 21px;
      height: 21px;
    }

    &.is-mail {
      width: 25px;
      height: 19px;
    }
  }
}

// ---------- 手机端 ----------
// 必须写在 tablet-down 之后：窄屏两个条件同时命中，权重相同、靠先后决胜。
@include mobile {
  .factory-intro {
    padding-top: 32px;

    &__inner {
      gap: 16px;
      width: calc(100% - 40px);
    }

    h1 {
      font-size: 30px;
      line-height: 1.32;
    }

    &__tagline {
      margin-top: 10px;
      font-size: 14px;
    }

    &__body {
      font-size: 13px;
      line-height: 1.75;
    }
  }

  :root:lang(en) .factory-intro h1 {
    font-size: 27px;
  }

  :root:lang(en) .factory-intro__body {
    font-size: 13px;
  }

  .factory-area {
    padding-top: 52px;

    &__value {
      font-size: 60px;
      line-height: 0.82;
    }

    &__label {
      margin-top: 14px;
      font-size: 21px;
    }

    &__note {
      width: calc(100% - 40px);
      margin-top: 10px;
      font-size: 13px;
      line-height: 1.5;
    }
  }

  // 四项数据在窄屏排两行两列。色带原本只压图标腰部，两行之后那条腰线对不上任何一行，
  // 索引不到位就会变成一条横穿中间的灰带，所以手机端整段铺灰底、把色带撤掉。
  .factory-stats {
    padding: 44px 0 40px;
    background: $factory-band;

    &__band {
      display: none;
    }

    &__list {
      grid-template-columns: repeat(2, 1fr);
      gap: 30px 12px;
      width: calc(100% - 40px);

      img {
        width: 82px;
        height: 82px;
      }

      strong,
      li:first-child strong {
        margin-top: 12px;
        font-size: 38px;
      }

      span {
        margin-top: 9px;
        font-size: 13px;
      }
    }
  }

  .factory-cards {
    margin-top: 40px;
    padding: 18px 0 22px;

    &__inner {
      gap: 20px;
      width: calc(100% - 40px);
    }
  }

  .factory-card {
    gap: 12px;
  }

  .factory-card__cta {
    bottom: 12px;
    left: 12px;
    gap: 9px;
    height: 38px;
    padding: 0 11px 0 14px;
    font-size: 16px;
  }

  .factory-card__arrow {
    width: 21px;
    height: 21px;

    &::before {
      border-top-width: 6px;
      border-bottom-width: 6px;
      border-left-width: 11px;
    }
  }

  // 风车格在 390 屏也放得下，所以不拆成等宽两列 —— 宽窄格互换是这版设计的样子。
  // 390 下卡宽 350，窄格 108×89：去掉内边距还有 86×61，够装 6 个 11px 的字。
  .factory-card__grid {
    li {
      padding: 8px 10px 10px 12px;
    }

    strong {
      font-size: 26px;
    }

    span {
      margin-top: 6px;
      font-size: 11px;
    }
  }

  .factory-card__icon {
    &.is-tent {
      width: 18px;
      height: 14px;
    }

    &.is-pad {
      width: 21px;
      height: 14px;
    }
  }

  .factory-contact {
    padding: 56px 0 60px;

    &__inner {
      gap: 24px;
      width: calc(100% - 40px);
    }

    &__title {
      font-size: 27px;
      line-height: 1.32;
    }

    &__list {
      gap: 12px;
      padding: 16px 18px;

      a {
        gap: 10px;
        padding-bottom: 5px;
        font-size: 15px;
      }
    }
  }

  :root:lang(en) .factory-contact__title {
    font-size: 30px;
  }

  .factory-contact__icon {
    &.is-tel {
      width: 19px;
      height: 16px;
    }

    &.is-mobile {
      width: 18px;
      height: 18px;
    }

    &.is-mail {
      width: 21px;
      height: 16px;
    }
  }
}
</style>
