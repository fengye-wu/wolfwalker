<script setup>
// 定制专区页。1:1 还原蓝湖「产品定制」设计稿（画板 1920×5363，与 CSS px 一致），
// 文案与尺寸见 src/data/custom.js 的注释。
//
// 尺寸写法：设计稿是定宽 1920 的稿子，所以每个尺寸都写成 d(设计px) ——
// 展开是 min(设计px, 对应vw)，1920 及以上锁定设计值，往下按比例缩，
// 平板/手机再单独覆盖（见样式末尾的 tablet-down / mobile 块）。
import { computed } from 'vue';
import { useLocale } from '../composables/useLocale';
import { customCopy, customImages, flowRows, stepImages } from '../data/custom';

const { locale } = useLocale();

const copy = computed(() => customCopy[locale.value] ?? customCopy.zh);

// 定制优势区改为左右两张成品切图（标题块 / 照片组合，文案都已烘焙在图里），
// 不再用实时标题与三个椭圆。
const adImages = {
  left: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/ad-left.png',
  right: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/custom/ad-right.png',
};

// 12 步切成 4 排，每排 3 步。reverse 的那两排要从右往左走 ——
// 设计稿是回形（蛇形）走位，不是每排都从左开始。
//
// 这里只把数组倒序交给 CSS grid 去排，DOM 顺序保持 1→12 不变，
// 读屏和 Tab 键仍然按真实流程顺序走。倒序靠 grid-column 指定，见样式。
const rows = computed(() =>
  flowRows.map((row, rowIndex) => ({
    ...row,
    steps: copy.value.steps
      .slice(rowIndex * 3, rowIndex * 3 + 3)
      .map((step, i) => {
        const index = rowIndex * 3 + i;
        return {
          ...step,
          image: stepImages[index],
          // 这一排里的列号：正序 1,2,3；倒序 3,2,1。
          column: row.reverse ? 3 - i : i + 1,
          // 每排最后一步那张图在设计稿里是窄的（496 而不是 568）
          narrow: i === 2
        };
      })
  }))
);
</script>

<template>
  <div class="custom-page">
    <!-- 右侧竖排 WOLFWALKER 水印。设计稿是 286×2922 的文字图层，
         首页和工厂介绍页已有同一张位图（bg2.png），这里复用，避免再传一份。 -->
    <img
      class="custom-page__watermark"
      src="https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/bg2.png"
      alt=""
      aria-hidden="true"
      loading="lazy"
    />

    <!-- 首屏图：设计稿 1920×483，照片往下收进白底，接的白由页面底色延续 -->
    <div class="custom-hero">
      <img
        :src="customImages.hero"
        :alt="copy.heroAlt"
        decoding="async"
        fetchpriority="high"
      />
    </div>

    <!-- 定制优势：左右两张成品切图（左标题块 / 右照片组合，文案已烘焙在图里） -->
    <section class="custom-adv">
      <div class="custom-adv__inner">
        <img
          v-reveal="'animate__bounceInLeft'"
          class="custom-adv__ad"
          :src="adImages.left"
          alt="产品定制优势 Product Customization Advantages"
        />
        <img
          v-reveal="'animate__bounceInRight'"
          class="custom-adv__ad custom-adv__ad--photos"
          :src="adImages.right"
          alt="多台专业设备可控成本，11年专业定制源头工厂，精湛工艺技术严格品控"
          loading="lazy"
        />
      </div>
    </section>

    <!-- 定制流程：标题两侧各一条渐变短条，下面四排、每排三步 -->
    <section class="custom-flow">
      <div class="custom-flow__inner">
        <h2 v-reveal class="custom-flow__title">{{ copy.flowTitle }}</h2>

        <ol class="custom-flow__rows">
          <li
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            class="custom-flow__row"
            :class="{ 'custom-flow__row--reverse': row.reverse }"
          >
            <!-- 芯片一行。两个向右箭头落在芯片之间的空档里，
                 倒序排的那两排靠 CSS 水平镜像成向左。 -->
            <div class="custom-flow__chips">
              <span
                v-for="step in row.steps"
                :key="step.label"
                v-reveal
                class="custom-chip"
                :style="{ 'grid-column': step.column }"
              >
                {{ step.label }}
              </span>
              <img
                v-for="gap in 2"
                :key="`arrow-${gap}`"
                class="custom-flow__arrow"
                :style="{ 'grid-column': gap }"
                :src="customImages.arrowH"
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
            </div>

            <!-- 正文一行。设计稿给的是固定高度的槽位（正文顶到图片顶恒 203px），
                 所以不管几行字，下面的图都在同一条水平线上。 -->
            <div class="custom-flow__texts">
              <p
                v-for="step in row.steps"
                :key="step.label"
                v-reveal
                class="custom-flow__text"
                :style="{ 'grid-column': step.column }"
              >
                {{ step.text }}
              </p>
            </div>

            <!-- 图片一行。前两张 568 宽、最后一张 496 宽，
                 窄的那张始终在这一排的「流程终点」那一侧。 -->
            <div class="custom-flow__shots">
              <img
                v-for="step in row.steps"
                :key="step.label"
                v-reveal
                class="custom-flow__shot"
                :class="{ 'custom-flow__shot--narrow': step.narrow }"
                :style="{ 'grid-column': step.column }"
                :src="step.image"
                :alt="step.label"
                loading="lazy"
              />
            </div>

            <!-- 转到下一排的向下箭头。最后一排没有，落点在这一排的流程终点下方。 -->
            <img
              v-if="rowIndex < rows.length - 1"
              v-reveal
              class="custom-flow__turn"
              :src="customImages.arrowV"
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          </li>
        </ol>

        <p v-reveal class="custom-note">
          <strong>{{ copy.noteTitle }}</strong>
          {{ copy.noteBody }}
        </p>
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

.custom-page {
  position: relative;
  min-width: 320px;
  overflow: hidden;
  background: $white;
  color: $custom-body;
  font-family: $font-sans;
}

// 右侧竖排 WOLFWALKER。设计稿是 286×2922 的文字图层，起点在画板 y705。
// 复用的 bg2.png 自身是 268×2922，比 0.0979 的设计稿更瘦（0.0917），
// 按「图片保持原始比例」不写死 height，高度上限折进宽度里：
// 设计稿高度 2922 换算成这张图的宽度就是 2922 × 0.0917 ≈ 268，所以取 d(268) 而不是 d(286)。
// 给 286 的话高度会拉到 3118，多出的 196 会压到流程区第一排的图上。
//
// 颜色用图自带的 10% 黑，没有按设计稿的 #3E0FC3 / 15% 另做一份 ——
// 三个页面共用一张，和首页、工厂介绍保持一致。
.custom-page__watermark {
  position: absolute;
  top: d(705);
  right: 0;
  z-index: 0;
  width: d(268);
  pointer-events: none;

  // 手机端不显示：286 的原始宽度在 390 的屏上要占掉七成
  @include mobile {
    display: none;
  }
}

// 首屏图。设计稿 1920×483，照片往下收进白底。
// 定制优势那一块从 y230 起就压在它上面，所以这里脱离文档流，
// 由 .custom-adv 的 padding-top 负责让出位置。
.custom-hero {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

// ---------- 定制优势 ----------
// 设计稿这一块 y230..940，压在首屏图上（图到 y483），所以顶部留白按 230 给。
// 整区缩至 75%（对照新设计稿）：zoom 连同 padding 一起缩，与 hero 图的压叠、
// 下方流程区的位置随之等比上移；手机端是另排的布局，在末尾 mobile 块恢复 1。
.custom-adv {
  position: relative;
  z-index: 1;
  zoom: 0.75;
  padding-top: d(230);
}

.custom-adv__inner {
  @include shell-width($shell-custom, 364px);

  display: flex;
  // 左标题块图 + 右照片组合图，垂直居中对齐，两端撑开
  align-items: center;
  justify-content: space-between;
  gap: d(60);
  margin: 0 auto;
}

// 左：标题块成品图（781×265，中文标题 / 英文副题 / 六枚圆点都已烘焙）。
// 宽度按设计稿比例定：截图里标题 : 照片 ≈ 450 : 378；按需求两图再放大、
// 中缝收到只剩 ~12px，等比放到 840 / 704。
.custom-adv__ad {
  width: d(810);
  height: auto;
}

// 右：照片组合图（674×684，三张照片、压角圆角与白色大字都已烘焙）。
.custom-adv__ad--photos {
  flex: 0 0 auto;
  width: d(810);
}

// ---------- 定制流程 ----------
// 区块 y1094..5204。标题行盒顶 1092.6，上一块（定制优势）底 939，差 152.6。
// 与 custom-adv 同步缩至 75%（对照新设计稿，图片/文字/间距一起等比缩小），
// 手机端是独立重排布局，在末尾 mobile 块恢复 1。
.custom-flow {
  position: relative;
  z-index: 1;
  zoom: 0.75;
  padding-top: d(152.6);
  padding-bottom: d(159);
}

.custom-flow__inner {
  @include shell-width($shell-custom, 364px);

  margin: 0 auto;
}

// 标题两侧各一条渐变短条，设计稿 349×13，外白内蓝。
// 条子离 shell 两边各 291，与标题文字间距 32；用 flex 居中，
// 英文标题更长时两条会自动往外让，位置关系不变。
.custom-flow__title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  gap: d(32);
  color: $custom-blue;
  font-size: d(77.78);
  font-weight: 700;
  line-height: 1;
  text-align: center;

  &::before,
  &::after {
    flex: 0 0 auto;
    width: d(349);
    height: d(13);
    content: '';
  }

  &::before {
    background: linear-gradient(to right, $white, $custom-blue);
  }

  &::after {
    background: linear-gradient(to right, $custom-blue, $white);
  }
}

// 标题行盒底 1170.4 → 第一排芯片顶 1269，差 98.6。
.custom-flow__rows {
  margin: d(98.6) 0 0;
  padding: 0;
  list-style: none;
}

// 一排 = 芯片行 / 正文行 / 图片行 / 转向箭头，四层共用一套 3 栏栅格。
// 三个子容器用 display: contents 摊平，孩子直接成为这个栅格的项，
// 省掉一层嵌套栅格，也让手机端能按「步」而不是按「种类」重排。
//
// 行距不等（芯片→正文 59.5、正文→图 8.5、图→箭头 53），所以 row-gap 给 0，
// 各自用 margin-top 表达。
.custom-flow__row {
  display: grid;
  // 必须是 minmax(0, 1fr) 而不是 1fr：1fr 的最小值是 auto，
  // 568 宽的步骤图会把所在栏撑到 568，三栏就变成 568/568/496 不再等分，
  // 正序排和倒序排的芯片落点还会不一样（1531 / 1495），设计稿是固定 633 步距。
  // 给 0 下限后栏宽锁定 539，图溢出的部分吃进栏间距 —— 这才是设计稿的排法。
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: d(95);
  row-gap: 0;

  // 箭头底到下一排芯片顶 = 171.5
  & + & {
    margin-top: d(171.5);
  }
}

.custom-flow__chips,
.custom-flow__texts,
.custom-flow__shots {
  display: contents;
}

// 芯片：设计稿 199×76，圆角 r=30（从整稿 PNG 子像素拟合，不是 pill 的 38）。
.custom-chip {
  display: flex;
  grid-row: 1;
  align-items: center;
  justify-content: center;
  justify-self: center;
  // 199×76 是按中文四个字定的。英文标签更长（Sample Production 要 203），
  // 所以给 min- 让它自己长出去，中文那边内容不到 199，仍然锁在设计稿尺寸上。
  min-width: d(199);
  min-height: d(76);
  padding: 0 d(18);
  border-radius: d(30);
  background: $custom-blue;
  color: $white;
  font-size: d(37.5);
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
}

// 芯片之间的向右箭头，设计稿 76×70，纵向与芯片同中线。
// 落点：栏边界往右 85.5 处是箭头右沿，这样中心正好在两枚芯片的空档中点。
.custom-flow__arrow {
  grid-row: 1;
  align-self: center;
  justify-self: end;
  width: d(76);
  height: auto;
  margin-right: d(-85.5);
}

// 正文。不写固定槽位（设计稿的 min-height: 200 是按最长 4 行反推的）：
// grid 行高自动取该排最高那段，图片跟在整排正文之后 —— 短段由高段兜着，
// 排内三张图仍齐平；某排文字多一行只会把自己那排的图往下推，不会压图。
// 代价是跨排的图不再强制同一条线，隔着一整排看不出来。
.custom-flow__text {
  grid-row: 2;
  align-self: start;
  margin: d(59.5) 0 0;
  font-size: d(37.5);
  font-weight: 700;
  line-height: 1.3333;
}

// 图片：与上方正文同宽 —— 正文占满栅格栏，图也拉满同一栏。
// （原设计稿 568/496 固定宽在 75% 缩放后比文字栏窄/不齐，改为随栏自适应。）
// 切图有两种比例（9 张 568×328、3 张 496×328），等比缩会有的高有的矮 ——
// 统一锁 568:328 的宽高比 + cover 裁齐，12 张图完全同尺寸（496 那三张上下
// 各裁约 7%，主体都居中，无伤）。
// 对齐类 --narrow 保留：只管 justify-self 的起点/终点侧，宽度已统一拉满。
.custom-flow__shot {
  grid-row: 3;
  justify-self: stretch;
  width: 100%;
  aspect-ratio: 568 / 328;
  object-fit: cover;
  // 设计稿原值 8.5：正文排满 4 行时墨迹底距图顶只剩十来个像素，视觉太贴。
  // 正文槽位改为内容自适应后（见 .custom-flow__text），这里取 40 ——
  // 间隙由行盒底统一保证，不再受行数影响。
  margin-top: d(40);
  // 前两段是 _motion.scss 里 .reveal-ready 的原值，一字不差照抄过来，
  // 为的是能在同一条 transition 上追加 scale —— transition 是简写，
  // 只写 scale 会把入场的 opacity/transform 过渡整条替换掉，图会硬跳出来。
  transition: opacity 700ms ease, transform 700ms $ease-rise, scale 420ms ease;
}

.custom-flow__shot--narrow {
  justify-self: end;
}

.custom-flow__row--reverse {
  .custom-flow__shot {
    justify-self: end;
  }

  .custom-flow__shot--narrow {
    justify-self: start;
  }

  // 第 2、4 排从右往左走，箭头水平镜像成向左。
  // 这两个元素都没挂 v-reveal，用 transform 不会和入场动效打架。
  .custom-flow__arrow {
    transform: scaleX(-1);
  }
}

// 鼠标移入放大 3.5%。用独立的 scale 属性而不是 transform: scale()：
// 这张图挂着 v-reveal，transform 已经被入场的 translateY 占着，
// 两个意图挤到一个属性上，hover 会把入场位移抹掉、图从半路跳一下。
// scale 是单独的变换属性，按规范先于 transform 参与合成，两者互不干扰。
//
// 不裁切、不加包裹层：从中心放大，多出来的部分落在栏间距里（下面量过余量）。
// 加包裹层的话 display: contents 摊平的那套 nth-of-type 派行号会失效。
//
// 只在有真实指针的设备上：触屏点一下 hover 会一直粘着，图会持续放大溢出，
// 这里不能照 HomeView 用 tablet-up —— 平板同样是触屏。
@media (hover: hover) {
  .custom-flow__shot:hover {
    scale: 1.035;
  }
}

// 转到下一排的向下箭头，设计稿 70×76，落在这一排流程终点那一栏的中线上。
.custom-flow__turn {
  grid-row: 4;
  grid-column: 3;
  justify-self: center;
  width: d(70);
  height: auto;
  margin-top: d(53);
}

.custom-flow__row--reverse .custom-flow__turn {
  grid-column: 1;
}
// 页尾温馨告知。设计稿 W1692（shell 的 93.63%）、33.33px / 1.375、居中。
// 「温馨告知」在设计稿里是独占一行的，所以 strong 提成块级。
.custom-note {
  width: 93.63%;
  margin: d(66) auto 0;
  font-size: d(33.33);
  font-weight: 700;
  line-height: 1.375;
  text-align: center;

  strong {
    display: block;
    font-weight: inherit;
  }
}

// ---------- 平板及以下 ----------
// 三栏并排到这个宽度就排不开了：768 时每栏只剩 222px、正文 15px，
// 芯片更是缩到 80px 装不下四个字。所以整块收成单列，按「步」纵向走。
@include tablet-down {
  // PC 的 75% 缩放和 364px 栏宽 gutter（见上方 base 两条 shell-width）只服务
  // 桌面版式：364px gutter 在手机上 calc(100% - 364px) 只剩 26px，内容全挤成
  // 一根竖条。这里恢复优化前的原始比例与 64px gutter，PC（≥1024）不受影响。
  .custom-adv,
  .custom-flow {
    zoom: 1;
  }

  .custom-adv__inner,
  .custom-flow__inner {
    @include shell-width($shell-custom, 64px);
  }

  // 两张成品图按 d() 的 vw 比例自动缩，窄屏下并排仍放得下，只收栏宽
  .custom-adv__inner {
    @include shell-width($shell-custom, 64px);
  }

  .custom-flow {
    padding-top: 9vw;
    padding-bottom: 12vw;
  }

  .custom-flow__title {
    gap: 2.4vw;
    font-size: clamp(22px, 4.1vw, 56px);

    &::before,
    &::after {
      width: 16%;
      height: 8px;
    }
  }

  // 单列：每步占三行（芯片 / 正文 / 图），后面跟一个向下箭头。
  // display: contents 把三个子容器摊平了，所以这里直接给每个孩子派行号；
  // 派行号靠 nth-of-type，它算的是 DOM 顺序，也就是真实流程顺序 1→12。
  .custom-flow__row {
    grid-template-columns: 1fr;
    column-gap: 0;

    & + & {
      margin-top: 5vw;
    }
  }

  // 内联 style 下发的 grid-column 权重高于选择器，必须 !important 才压得动，
  // 否则三步会横着挤在一行。
  .custom-chip,
  .custom-flow__text,
  .custom-flow__shot,
  .custom-flow__arrow,
  .custom-flow__turn {
    grid-column: 1 !important;
  }

  .custom-chip {
    justify-self: start;
    width: auto;
    min-width: 0;
    height: auto;
    padding: 1.4vw 3.2vw;
    border-radius: 999px;
    font-size: clamp(14px, 2.1vw, 30px);

    &:nth-of-type(1) {
      grid-row: 1;
    }

    &:nth-of-type(2) {
      grid-row: 5;
    }

    &:nth-of-type(3) {
      grid-row: 9;
    }
  }

  .custom-flow__text {
    min-height: 0;
    margin-top: 2vw;
    font-size: clamp(13px, 1.95vw, 28px);

    &:nth-of-type(1) {
      grid-row: 2;
    }

    &:nth-of-type(2) {
      grid-row: 6;
    }

    &:nth-of-type(3) {
      grid-row: 10;
    }
  }

  .custom-flow__shot,
  .custom-flow__shot--narrow {
    justify-self: stretch;
    width: 100%;
    margin-top: 2.6vw;
  }

  .custom-flow__shot {
    &:nth-of-type(1) {
      grid-row: 3;
    }

    &:nth-of-type(2) {
      grid-row: 7;
    }

    &:nth-of-type(3) {
      grid-row: 11;
    }
  }

  // 横向箭头在单列里转 90° 当步间指示用。
  // --reverse 那边桌面写的是 scaleX(-1)，这里要覆盖掉，否则会指向侧面。
  .custom-flow__arrow,
  .custom-flow__row--reverse .custom-flow__arrow {
    align-self: auto;
    justify-self: center;
    width: 4.4vw;
    max-width: 34px;
    margin: 2.4vw 0 0;
    transform: rotate(90deg);
  }

  .custom-flow__arrow:nth-of-type(1) {
    grid-row: 4;
  }

  .custom-flow__arrow:nth-of-type(2) {
    grid-row: 8;
  }

  .custom-flow__turn,
  .custom-flow__row--reverse .custom-flow__turn {
    grid-row: 12;
    justify-self: center;
    width: 4.4vw;
    max-width: 34px;
    margin-top: 2.4vw;
  }

  .custom-note {
    width: 100%;
    margin-top: 7vw;
    font-size: clamp(12px, 1.85vw, 26px);
  }
}

// ---------- 手机 ----------
// 必须写在 tablet-down 之后：两者权重相同，靠先后决胜。
@include mobile {
  // （zoom 与栏宽的恢复已上移到 tablet-down 块，手机/平板一起生效。）

  // 两张成品图在手机上改上下堆叠、各自满宽，比并排缩成小图好读
  .custom-adv__inner {
    display: block;
  }

  .custom-adv__ad {
    width: 100%;
  }

  .custom-adv__ad--photos {
    margin-top: 6vw;
  }

  .custom-flow {
    padding-top: 14vw;
    padding-bottom: 16vw;
  }

  .custom-flow__title {
    gap: 3vw;
    font-size: 21px;

    &::before,
    &::after {
      width: 14%;
      height: 5px;
    }
  }

  .custom-flow__row + .custom-flow__row {
    margin-top: 9vw;
  }

  .custom-chip {
    padding: 7px 16px;
    font-size: 15px;
  }

  .custom-flow__text {
    margin-top: 10px;
    font-size: 14px;
  }

  .custom-flow__shot,
  .custom-flow__shot--narrow {
    margin-top: 12px;
  }

  .custom-flow__arrow,
  .custom-flow__row--reverse .custom-flow__arrow,
  .custom-flow__turn,
  .custom-flow__row--reverse .custom-flow__turn {
    width: 22px;
    max-width: none;
    margin-top: 14px;
  }

  .custom-note {
    margin-top: 12vw;
    font-size: 14px;
  }
}
</style>
