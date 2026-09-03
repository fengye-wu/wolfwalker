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

// 三个定制优势：文案来自 copy，椭圆图是固定的三张，按下标配对。
const advantages = computed(() =>
  copy.value.advantages.map((item, index) => ({
    ...item,
    image: customImages.advantages[index]
  }))
);

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

    <!-- 定制优势：左边标题块，右边三个互相压边的椭圆 -->
    <section class="custom-adv">
      <div class="custom-adv__inner">
        <div class="custom-adv__head">
          <h1 v-reveal="'animate__bounceInLeft'" class="custom-adv__title">
            <span v-for="line in copy.title" :key="line">{{ line }}</span>
          </h1>
          <p v-reveal="'animate__bounceInLeft'" class="custom-adv__subtitle">
            <span v-for="line in copy.subtitle" :key="line">{{ line }}</span>
          </p>
          <img
            v-reveal="'animate__bounceInLeft'"
            class="custom-adv__dash"
            :src="customImages.dashBar"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </div>

        <ul class="custom-adv__list" v-reveal="'animate__bounceInRight'">
          <li
            v-for="(item, index) in advantages"
            :key="item.label"
            class="custom-adv__item"
            :style="{ '--reveal-delay': `${index * 90}ms` }"
          >
            <div class="custom-adv__figure">
              <img :src="item.image" alt="" aria-hidden="true" loading="lazy" />
              <span class="custom-adv__label">{{ item.label }}</span>
            </div>
            <p class="custom-adv__name">
              <span v-for="line in item.nameLines" :key="line">{{ line }}</span>
            </p>
          </li>
        </ul>
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
.custom-adv {
  position: relative;
  z-index: 1;
  padding-top: d(230);
}

.custom-adv__inner {
  @include shell-width($shell-custom, 64px);

  display: flex;
  // 左标题块 + 右椭圆组，两者宽度和比 shell 多 9px（设计稿本身就压着），
  // 椭圆左侧 30px 是羽化透明区，压这一点看不出来。
  align-items: flex-start;
  justify-content: space-between;
  margin: 0 auto;
}

// 标题块顶到区块顶 = 336.6 - 230 = 106.6。
// 336.6 是标题「行盒」顶：设计稿给的 354 是墨迹顶，
// 两行墨迹共 236、行高 135.4，反推出半行距 17.4，354 - 17.4 = 336.6。
// 宽度锁在设计稿的 684（副题那一行 Product Customization 就要这么宽）。
// 给 flex: 1 1 auto 只能分到 675，副题会被挤成三行、把短横往下顶 83px。
//
// 684 + 1132 比 shell 多 9px —— 设计稿里这两块本来就压着（标题块右沿 771 > 椭圆左沿 753）。
// 用负边距把这 9px 让出来，压的是椭圆左边那段羽化透明区，看不出来；
// 改成缩椭圆的话它会矮 5px，整个流程区跟着上移。
.custom-adv__head {
  flex: 0 0 d(684);
  min-width: 0;
  margin-right: d(-9);
  padding-top: d(106.6);
}

.custom-adv__title {
  margin: 0;
  color: $custom-blue;
  font-family: $font-serif;
  font-size: d(104.17);
  font-weight: 900;
  line-height: 1.3;

  span {
    display: block;
  }
}

// 中文稿里这两行本身就是英文副题。行盒顶 612.15，与标题行盒底 607.4 相差 4.75。
.custom-adv__subtitle {
  margin: d(4.75) 0 0;
  color: $custom-body;
  font-size: d(60.42);
  font-weight: 700;
  line-height: 1.3793;

  span {
    display: block;
  }
}

// 六段短横，设计稿 349×35，纯色 #254E94。副题行盒底 778.85 → 短横顶 822。
.custom-adv__dash {
  display: block;
  width: d(349);
  height: auto;
  margin-top: d(43.15);
}

// 三个椭圆。设计稿 x753 / 1118 / 1470，各 415 宽 —— 间距 365 / 352 小于宽度，
// 是刻意互相压边的，所以用负 margin。整组 1132 宽（753..1885）。
// 宽度和负边距都写成组宽的百分比，缩放时压边量才跟着等比变：
// 36.6608 × 3 - 4.4170 - 5.5654 = 100%，正好填满。
// 设计稿 1132 宽（753..1885），锁死不参与 flex 收缩，椭圆才保得住 415×645。
.custom-adv__list {
  display: flex;
  flex: 0 0 d(1132);
  margin: 0;
  padding: 0;
  list-style: none;
}

.custom-adv__item {
  // 提 z-index 用的定位上下文。没给偏移量，不影响排版。
  position: relative;
  flex: 0 0 auto;
  width: 36.6608%;
  // 入场做一点错开，靠 CSS 补延迟 —— v-reveal 指令本身不读这个变量
  transition-delay: var(--reveal-delay, 0ms);
  // 摆动的第一步朝哪走。CSS 里上为负，所以「先上」是 -1。
  --bob-dir: -1;

  & + & {
    margin-left: -4.417%;
  }

  &:nth-child(3) {
    margin-left: -5.5654%;
  }

  // 中间那个反过来，先往下。
  &:nth-child(2) {
    --bob-dir: 1;
  }
}

// 鼠标移入的上下摆动：第 1、3 个上→下→上→回原位，第 2 个下→上→下→回原位。
// 走 keyframes 而不是 transition —— 一次 hover 要经过四个落点，transition 只能到一个终点。
// 和 v-reveal 不冲突：入场动效挂在外层 ul 上，这里动的是 li 自己的 transform。
//
// 幅度写成自定义属性、靠 --bob-dir 的正负决定方向，两个反向就共用一组关键帧。
// 后两步依次收到 55% 和 28%，摆动自己衰减下去，不需要在收尾处硬停。
// 负数不能过 d()：min(-12px, -4.8vw) 在窄屏取的是更小的那个，幅度会越缩越大，
// 所以只有正的 $bob-lift 过 d()，负号留在 calc 里乘。
$bob-lift: d(22);

@keyframes adv-bob {
  0% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(calc(var(--bob-dir) * #{$bob-lift}));
  }

  50% {
    transform: translateY(calc(var(--bob-dir) * #{$bob-lift} * -0.55));
  }

  75% {
    transform: translateY(calc(var(--bob-dir) * #{$bob-lift} * 0.28));
  }

  100% {
    transform: translateY(0);
  }
}

// 三个椭圆是压边排的，抬起来那一下得盖住邻居，否则会被后一个的图切掉一角。
// 只在 hover 期间提，移出即还原 —— 动画本身不带 fill-mode，停了就在原位。
.custom-adv__item:hover {
  z-index: 2;
  animation: adv-bob 760ms ease-in-out;
}

// 椭圆图。设计稿 415×645，四角 alpha=0，边缘约 30px 羽化。
.custom-adv__figure {
  position: relative;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

// 压在椭圆上的白色大字。设计稿里是位图，这里改成实时文字，
// 字号按切图墨迹高度（42~45）反推 ≈46px。
// 竖向落点 46.5%：墨迹中线 y530，椭圆 230..875，(530-230)/645 = 46.5%。
.custom-adv__label {
  position: absolute;
  top: 46.5%;
  left: 50%;
  width: 86%;
  color: $white;
  font-size: d(46);
  font-weight: 700;
  line-height: 1.15;
  text-align: center;
  transform: translate(-50%, -50%);
}

// 椭圆下面那两行蓝字。设计稿 T863，椭圆盒底是 875，所以往上压 12px；
// 那一段椭圆已经淡到几乎透明，压上去看不出来。
// 给固定高度，英文版只有一行时不会把整组高度顶掉。
.custom-adv__name {
  min-height: d(76);
  margin: d(-12) 0 0;
  color: $custom-blue;
  font-size: d(28.5);
  font-weight: 700;
  line-height: 1;
  text-align: center;

  span {
    display: block;
    margin-bottom: d(12);
  }
}

// ---------- 定制流程 ----------
// 区块 y1094..5204。标题行盒顶 1092.6，上一块（定制优势）底 939，差 152.6。
.custom-flow {
  position: relative;
  z-index: 1;
  padding-top: d(152.6);
  padding-bottom: d(159);
}

.custom-flow__inner {
  @include shell-width($shell-custom, 64px);

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

// 正文槽位至少 200（4 行 × 行距 50）。设计稿最长那两段 ink 高 187 = 3×50+37，
// 即 4 行，所以四排的「芯片顶→图顶」都是 344.5，图落在同一条线上。
//
// min- 而不是写死：第 2 排那两段 59 字在浏览器里会排成 5 行（半宽逗号和引号的
// 字身宽和 PS 不一致，正好卡在换行边界上），写死高度会让文字压到图上。
// 现在是那一排整体高 50，排内三张图仍然齐平 —— 跨排差 50 隔着 800px 看不出来，
// 何况设计稿自己的第 2 排也比别排高 138。
.custom-flow__text {
  grid-row: 2;
  align-self: start;
  min-height: d(200);
  margin: d(59.5) 0 0;
  font-size: d(37.5);
  font-weight: 700;
  line-height: 1.3333;
}

// 图片：前两张 568 宽、最后一张 496 宽，都是 328 高，所以底边齐平。
// 568 比栏宽 539 宽，多出来的部分吃进栏间距里 —— 设计稿就是这么排的。
//
// 对齐规则：宽的那两张贴「流程起点」那一侧，窄的那张贴「流程终点」。
// 正序排终点在右，倒序排终点在左，所以下面 --reverse 里两条对调。
.custom-flow__shot {
  grid-row: 3;
  justify-self: start;
  // _base.scss 里 img 有一条 max-width: 100%，会把图夹回栏宽（1440 下 411 而不是 426），
  // d(568) 就失效了。这里必须解开，溢出栏间距是设计稿本来的排法。
  max-width: none;
  width: d(568);
  height: auto;
  margin-top: d(8.5);
  // 前两段是 _motion.scss 里 .reveal-ready 的原值，一字不差照抄过来，
  // 为的是能在同一条 transition 上追加 scale —— transition 是简写，
  // 只写 scale 会把入场的 opacity/transform 过渡整条替换掉，图会硬跳出来。
  transition: opacity 700ms ease, transform 700ms $ease-rise, scale 420ms ease;
}

.custom-flow__shot--narrow {
  justify-self: end;
  width: d(496);
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

// 英文版这两行另设字号。设计稿只有中文一版，字号是按中文四到六个字定的：
// Customization 这一个词在 104.17px 下就要 700px，超过 684 的标题栏宽，
// 而它中间没有可断处，只能溢出（不是换行）。副题同理，两行各三十来个字符。
// 缩到 76 / 42 后各自按我写的断行落位，标题+副题共 412，和中文版的 438 差不多，
// 短横仍落在原来那条线附近，整块高度不变。
:root:lang(en) .custom-adv__title {
  font-size: d(76);
}

:root:lang(en) .custom-adv__subtitle {
  font-size: d(42);
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
  // 标题块与椭圆组从并排改成上下：并排时标题栏只剩 251px，
  // 而「产品定制优势」在该字号下就要 250px，等于卡死在边界上。
  .custom-adv__inner {
    display: block;
  }

  .custom-adv__title {
    font-size: clamp(30px, 5.42vw, 60px);
  }

  .custom-adv__subtitle {
    margin-top: 1.2vw;
    font-size: clamp(19px, 3.15vw, 36px);
  }

  .custom-adv__dash {
    width: 42%;
    margin-top: 3vw;
  }

  .custom-adv__list {
    width: 100%;
    margin-top: 6vw;
  }

  .custom-adv__label {
    font-size: clamp(15px, 2.4vw, 34px);
  }

  .custom-adv__name {
    min-height: 0;
    margin-top: 1vw;
    font-size: clamp(13px, 1.95vw, 28px);
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
  // 三个椭圆并排到 390 只剩 122px 宽，白字塞不进去，改成纵向一个一个来。
  // 压边的负 margin 也要一起清掉，否则会互相盖住。
  .custom-adv__list {
    display: block;
    margin-top: 8vw;
  }

  .custom-adv__item {
    width: 66%;
    margin-left: auto !important;
    margin-right: auto;

    & + & {
      margin-top: 6vw;
    }
  }

  .custom-adv__label {
    font-size: 19px;
  }

  .custom-adv__name {
    margin-top: 2vw;
    font-size: 15px;
  }

  .custom-adv__title {
    font-size: 30px;
  }

  .custom-adv__subtitle {
    margin-top: 8px;
    font-size: 17px;
  }

  .custom-adv__dash {
    width: 52%;
    margin-top: 16px;
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
