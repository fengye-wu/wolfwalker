<script setup>
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import { createSwipe } from '../composables/useSwipe'
import { getCategory, productHeroEyebrow, productHeroSlides } from '../data/products'

// 按钮点击不自己跳路由，交给 ProductView 走它那套 chooseCategory ——
// 那边除了改 query 还会把列表滚进视口。同一个页面里改筛选条件，
// 直接 RouterLink 过去只会换 URL，人还停在首屏，看不出发生了什么。
const emit = defineEmits(['select'])

const { locale, t } = useLocale()
const carouselRef = ref(null)
const activeSlide = ref(0)

// 每 7 秒一张，与首页顶部 banner 同一个节奏
const INTERVAL = 7000

const slides = computed(() =>
  productHeroSlides.map((slide, index) => {
    const category = getCategory(slide.category)
    const zh = locale.value === 'zh'
    const cta = category ? category[locale.value] : ''
    return {
      image: slide.image,
      key: slide.category,
      title: zh ? slide.titleZh : slide.titleEn,
      subtitle: zh ? slide.subtitleZh : slide.subtitleEn,
      cta,
      // 图拍的就是这个品类的使用场景，alt 用「品类名 + 页面标题」，
      // 七张各不相同，读屏不会连着念七遍一样的话。
      alt: zh ? `${cta}｜${t.value.catalogTitle}` : `${cta} — ${t.value.catalogTitle}`,
      // 首屏图参与 LCP，其余交给浏览器懒加载
      eager: index === 0,
    }
  }),
)

const eyebrow = computed(() => productHeroEyebrow[locale.value])

const previous = () => carouselRef.value?.prev()
const next = () => carouselRef.value?.next()
const handleSlideChange = (index) => {
  activeSlide.value = index
}

// ElCarousel 不会卸载非当前项，所有幻灯片一直挂在 DOM 里。animate.css 的类
// 如果写成静态的，只会在挂载那一刻播一次，之后每轮轮播都是静止的。
// 绑到 activeSlide 上：离开时类被摘掉、回来时重新加上，动画就跟着重播。
const animateOn = (index, ...names) =>
  index === activeSlide.value ? ['animate__animated', ...names] : []

// ElCarousel 自己不带触摸手势，手机端要滑动切换只能手动接
const heroSwipe = createSwipe({ onLeft: next, onRight: previous })
</script>

<template>
  <section
    class="product-hero"
    :aria-label="locale === 'zh' ? '产品系列轮播' : 'Product collection carousel'"
    @touchstart.passive="heroSwipe.start"
    @touchend.passive="heroSwipe.end"
    @click.capture="heroSwipe.guardClick"
  >
    <ElCarousel
      ref="carouselRef"
      class="product-hero__carousel"
      height="100%"
      :interval="INTERVAL"
      arrow="never"
      indicator-position="none"
      pause-on-hover
      @change="handleSlideChange"
    >
      <ElCarouselItem v-for="(slide, index) in slides" :key="slide.image">
        <div class="hero-slide">
          <!-- 图和遮罩一起淡入，当成一层处理：只淡图不淡遮罩的话，
               切换那 400ms 会先看到一片深色再看到画面 -->
          <div class="hero-slide__frame" :class="animateOn(index, 'animate__fadeIn')">
            <img
              :src="slide.image"
              :alt="slide.alt"
              class="hero-slide__media"
              :class="{ 'is-drifting': index === activeSlide }"
              decoding="async"
              :loading="slide.eager ? 'eager' : 'lazy'"
              :fetchpriority="slide.eager ? 'high' : 'auto'"
            />
            <div class="hero-slide__shade"></div>
          </div>
          <div class="hero-slide__copy">
            <p :class="animateOn(index, 'animate__fadeInDown')">{{ eyebrow }}</p>
            <!-- 首屏那张用 h1：这一段替掉了原来的静态首屏，页面的 h1 得留在这里 -->
            <component
              :is="index === 0 ? 'h1' : 'h2'"
              :class="animateOn(index, 'animate__fadeInDown')"
            >
              {{ slide.title }}
            </component>
            <span :class="animateOn(index, 'animate__fadeInUp')">{{ slide.subtitle }}</span>
            <button
              type="button"
              class="hero-slide__cta"
              :class="animateOn(index, 'animate__fadeInUp')"
              @click="emit('select', slide.key)"
            >
              {{ slide.cta }}
            </button>
          </div>
        </div>
      </ElCarouselItem>
    </ElCarousel>

    <button
      class="hero-arrow hero-arrow--previous"
      type="button"
      :aria-label="locale === 'zh' ? '上一张' : 'Previous slide'"
      @click="previous"
    >
      <ChevronLeft :size="38" stroke-width="3" />
    </button>
    <button
      class="hero-arrow hero-arrow--next"
      type="button"
      :aria-label="locale === 'zh' ? '下一张' : 'Next slide'"
      @click="next"
    >
      <ChevronRight :size="38" stroke-width="3" />
    </button>

    <!-- 手机端箭头隐藏、改成滑动，补一排指示点让人知道能滑、滑到第几张。
         纯提示，交互仍是滑动，所以不做成按钮、读屏跳过 -->
    <div class="hero-dots" aria-hidden="true">
      <i
        v-for="(slide, index) in slides"
        :key="slide.image"
        :class="{ 'is-active': index === activeSlide }"
      ></i>
    </div>
  </section>
</template>

<style scoped lang="scss">
// 这一段的骨架与首页顶部 banner 同源（HomeView 的 .home-hero / .hero-slide），
// 高度表达式、Ken Burns、手机端比例、reduced-motion 兜底都照搬，差别只有三处：
// 文案左对齐、多一行 eyebrow、按钮是描边而不是实心。
// 没有把两边合成一个组件：首页那套断点值是逐个视口调出来的（右对齐 + nowrap +
// 英文单独收字号），参数化过来要重新验一遍所有断点，收益不抵风险。
// 改这里的高度/比例时，顺手看一眼 HomeView 是否也该跟着改。
.product-hero {
  position: relative;
  width: 100%;
  // 与首页 .home-hero 同一个值
  height: max(min(54.375vw, 1044px), 557px);
  overflow: hidden;
  background: $hero-bg;
  font-family: $font-sans;

  // 手机端改由宽高比定高。原图是横长方形，配 object-fit: cover 时框越矮、
  // 左右被裁掉的越少，4/5 在 390 屏得 488px，文案区宽裕；
  // max-height 收在 78svh，还留 1/5 屏给下一屏露头，提示可以往下滚。
  // 必须排在 tablet-down 之后 —— 这里没有 tablet-down，但顺序仍照全站规矩。
  @include mobile {
    height: auto;
    aspect-ratio: 4 / 5;
    max-height: 78svh;
  }

  // ElCarousel 会给容器和每一项写死行内高度，只能用 !important 压
  &__carousel,
  &__carousel :deep(.el-carousel__container),
  &__carousel :deep(.el-carousel__item) {
    height: 100% !important;
  }
}

// 背景图的缓慢推进（Ken Burns）。终点略微放大并偏移，超出的部分由
// &__frame 的 overflow: hidden 裁掉。起点是 none，所以非当前幻灯片
// 停在原位，正好等于 object-fit: cover 的构图。
@keyframes product-hero-drift {
  from {
    transform: none;
  }
  to {
    transform: scale(1.08) translate3d(-1.2%, 0, 0);
  }
}
.hero-slide {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;

  // 图和遮罩的容器。存在的理由有两个：一是让 animate.css 的淡入作用在
  // 「图 + 遮罩」整体上，二是 overflow 把推进动画放大溢出的边裁掉 ——
  // el-carousel__item 之间靠 translateX 错开，不裁会蹭到相邻那张。
  &__frame {
    position: absolute;
    inset: 0;
    overflow: hidden;
    --animate-duration: 900ms;
  }

  &__media {
    width: 100%;
    height: 100%;
    object-fit: cover;

    @include mobile {
      object-position: center;
    }

    // 只给当前幻灯片开图层，七张一直挂在 DOM 里，全开等于常驻七个合成层
    &.is-drifting {
      animation: product-hero-drift 6500ms ease-out both;
      will-change: transform;
    }
  }

  // 文案在左，所以罩子从左往右由深到浅 —— 和首页那条正好反向。
  &__shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(3, 22, 31, 0.62), rgba(3, 22, 31, 0.14));

    // 窄屏文案移到底部，遮罩跟着改成自下而上
    @include mobile {
      background: linear-gradient(0deg, rgba(3, 22, 31, 0.72), rgba(3, 22, 31, 0.12));
    }
  }

  &__copy {
    position: absolute;
    // 参考图里文案块的上边缘约在图高的 42%，左边缘距屏幕约一成
    top: 42%;
    left: 10%;
    z-index: 2;
    // 标题是 nowrap，框要能被文字撑开；上限收在 80%，超长文案不顶到右沿。
    // 副标题会折行，所以这里不是「永远一行」—— max-content 只保证不主动断词，
    // 装不下时仍由 max-width 触发折行。
    width: max-content;
    max-width: 80%;
    color: $white;
    text-align: left;
    // 文案统一 800ms，逐级延迟写在各自的规则里，eyebrow→标题→副标题→按钮依次进场。
    // 最迟的一条 620 + 800 = 1420ms，远小于 INTERVAL（7000ms），不会被切换打断。
    --animate-duration: 800ms;

    // 底部留 42px 给指示点
    // inset 一条把 top/left/right/bottom 全设了（top: auto，左右各 20px，
    // 底 42px），所以不能再补 left: auto —— 那会把左边界解掉，配上
    // width: auto 框就缩成内容宽并靠右贴住，文案整块跑到右下角。
    // top 也不用再写一遍，inset 里的 auto 已经覆盖了上面那条 42%。
    @include mobile {
      inset: auto 20px 42px;
      z-index: 3;
      // 必须把上面那条 width: max-content 放掉，副标题才可能换行 ——
      // max-content 的框按「所有子元素都不折行」算宽度，子元素自然永远换不了行。
      width: auto;
      max-width: none;
      text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
    }

    p {
      margin: 0 0 18px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.14em;
      animation-delay: 120ms;

      @include mobile {
        margin-bottom: 12px;
        font-size: 10px;
      }
    }

    // 首屏那张是 h1，其余是 h2，样式一致
    h1,
    h2 {
      margin: 0;
      font-family: $font-serif;
      font-size: clamp(38px, 3.5vw, 66px);
      line-height: 1.08;
      // 强制一行。中文八字标题在任何断点都装得下；英文最长那句
      // "Follow the wind, rest wherever it takes you" 见下面单独收字号那条。
      white-space: nowrap;
      // 260ms 让 el-carousel 那 400ms 的横移先走掉一多半，标题不至于跟着平移
      animation-delay: 260ms;
      --animate-duration: 900ms;

      @include mobile {
        font-size: 28px;
        line-height: 1.16;
      }
    }

    // 英文标题比中文长得多，得单独收字号 —— 中文标题都是「四字，四字」共九个字符，
    // 英文最长那句 35 个字符，同字号下要宽出两倍多。
    // pc 端 2.6vw：最窄的一档是 768（clamp 下限 30px），最长那句实测约 520px，
    // 框宽上限 80% 在这一档是 614px，留 90px 余量。
    // 手机端 4.7vw：360 屏可用宽 320px（左右各 20px），4.7vw 得 16.9px，
    // 最长那句约 293px，留 27px。再大就会顶到右沿 —— 上面那条 nowrap 不会折行，
    // 只会溢出去被 .product-hero 的 overflow: hidden 切掉。
    // 只降英文：中文在原字号下本来就放得下。
    // lang 由 useLocale 的 watch 同步到 documentElement，切语言即时生效。
    :root:lang(en) & h1,
    :root:lang(en) & h2 {
      font-size: clamp(30px, 2.6vw, 52px);

      @include mobile {
        font-size: clamp(16px, 4.7vw, 24px);
      }
    }

    span {
      display: block;
      margin-top: 14px;
      font-size: clamp(13px, 1.15vw, 22px);
      line-height: 1.6;
      animation-delay: 440ms;

      @include mobile {
        margin-top: 8px;
        font-size: 13px;
        line-height: 1.5;
      }
    }
  }

  // 描边按钮：参考图里是白色细边 + 白字 + 小圆角，不是首页那颗实心金色。
  // 用 button 而不是链接：点它只是在本页换筛选条件并把列表滚进视口，
  // 不是导航（ProductView 的 chooseCategory 会用 router.replace 同步 URL）。
  &__cta {
    display: inline-flex;
    align-items: center;
    margin-top: 26px;
    animation-delay: 620ms;
    padding: 10px 26px;
    border: 1px solid rgba($white, 0.85);
    border-radius: 4px;
    background: transparent;
    color: $white;
    font-family: inherit;
    font-size: clamp(15px, 1.1vw, 21px);
    font-weight: 700;
    line-height: 1.2;
    cursor: pointer;
    transition:
      background-color 260ms ease,
      color 260ms ease,
      border-color 260ms ease;

    @include mobile {
      margin-top: 16px;
      padding: 9px 20px;
      font-size: 13px;
    }

    &:hover,
    &:focus-visible {
      border-color: $white;
      background: $white;
      color: $ink;
    }
  }

  // _motion.scss 里的全局兜底把 animation-duration 压到 0.01ms，但没管
  // animation-delay。animate.css 是 fill-mode: both，延迟期间元素停在
  // opacity: 0 —— 不清掉延迟，按钮会先空白半秒多才突然出现。
  @include reduced-motion {
    &__media.is-drifting {
      animation: none;
    }

    &__copy * {
      animation-delay: 0ms !important;
    }
  }
}

.hero-arrow {
  position: absolute;
  top: 49%;
  z-index: 10;
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 0;
  background: transparent;
  color: $white;
  cursor: pointer;

  // 手机端不要箭头，改用滑动手势
  @include mobile {
    display: none;
  }

  &--previous {
    left: 3.8%;
  }

  &--next {
    right: 3.8%;
  }
}

// 桌面端有箭头，指示点只在手机端出现
.hero-dots {
  display: none;

  @include mobile {
    position: absolute;
    inset: auto 0 18px;
    z-index: 4;
    display: flex;
    justify-content: center;
    gap: 7px;
  }

  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba($white, 0.42);
    transition:
      width 220ms ease,
      background-color 220ms ease;

    &.is-active {
      width: 18px;
      border-radius: 3px;
      background: $white;
    }
  }
}
</style>
