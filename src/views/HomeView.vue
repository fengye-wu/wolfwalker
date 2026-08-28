<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useLocale } from '../composables/useLocale';
import {
  categoryImages,
  featureImages,
  heroSlides,
  categoryRoutes,
  carouselConfig,
  copy as homeCopy
} from '../data/home';

const { locale } = useLocale();
const carouselRef = ref(null);
const activeSlide = ref(0);

const copy = computed(() => homeCopy[locale.value]);

const slides = computed(() =>
  heroSlides.map((slide, index) => {
    const text = slide.content
      ? {
          eyebrow: copy.value[`${slide.content}Eyebrow`],
          title: copy.value[`${slide.content}Title`],
          subtitle: copy.value[`${slide.content}Subtitle`],
          cta: copy.value[`${slide.content}Cta`]
        }
      : null;
    return {
      ...slide,
      text,
      alt: copy.value[`${slide.content}ImageAlt`] || copy.value.bannerImageAlt,
      // 首屏图参与 LCP，其余交给浏览器懒加载
      eager: index === 0
    };
  })
);

// 中文分三行，英文只有一行，这里只渲染实际存在的行
const brandBodyLines = computed(() =>
  [copy.value.brandBody, copy.value.brandBody2, copy.value.brandBody3].filter(
    Boolean
  )
);

// categoryImages 已改为数组。分类数量以 categoryRoutes 为准，
// 多出来的图片先忽略，等补齐 categoryNames / categoryEnglish 再启用。
const categories = computed(() =>
  categoryRoutes.map((route, index) => ({
    image: categoryImages[index],
    name: copy.value.categoryNames[index],
    english: copy.value.categoryEnglish[index],
    to: `/product?category=${route}`
  }))
);

// 顶部和商品两个轮播都要手滑切换，判定逻辑相同，抽出来共用。
// 只在 touchend 结算，全程不拦 touchmove —— 一拦就连页面竖向滚动一起吃掉了。
// 横向不足 40px 当误触；横向没超过纵向说明用户其实在滚页面，也不接管。
const SWIPE_MIN_X = 40;

const createSwipe = ({ onLeft, onRight, onStart, onEnd }) => {
  let startX = 0;
  let startY = 0;
  let swiped = false;

  return {
    start(event) {
      const touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      swiped = false;
      onStart?.();
    },
    end(event) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      onEnd?.();
      if (
        Math.abs(deltaX) < SWIPE_MIN_X ||
        Math.abs(deltaX) <= Math.abs(deltaY)
      )
        return;
      swiped = true;
      if (deltaX < 0) onLeft();
      else onRight();
    },
    // 滑动松手后浏览器还会补一个 click。两个轮播里都是 RouterLink，
    // 不拦就会在滑动的同时跳走。捕获阶段先手截住，stopPropagation 让
    // 链接自己的处理器根本收不到这个事件。
    guardClick(event) {
      if (!swiped) return;
      swiped = false;
      event.preventDefault();
      event.stopPropagation();
    }
  };
};

// 商品轮播：固定四格，每秒往左推进一格，循环播放。
// 把开头的 PER_VIEW 张复制到末尾，推进到第 baseCount 格时画面与第 0 格
// 完全一致，此刻去掉过渡瞬间归零，所以看不出重置。
const CATEGORY_PER_VIEW = 4;
// 间隔必须大于 .home-category-track 的过渡时长（现为 1000ms），
// 否则过渡会被下一次推进打断，transitionend 不触发，归零就会失效。
const CATEGORY_INTERVAL = 10000;

const categoryTrack = computed(() => {
  const list = categories.value;
  if (!list.length) return [];
  return [
    ...list.map((item) => ({ ...item, clone: false })),
    ...Array.from({ length: CATEGORY_PER_VIEW }, (_, index) => ({
      ...list[index % list.length],
      clone: true
    }))
  ];
});

const categoryTrackRef = ref(null);
const categoryIndex = ref(0);
const categoryAnimated = ref(true);
let categoryTimer = null;

const activeCategory = computed(() =>
  categories.value.length ? categoryIndex.value % categories.value.length : 0
);

const advanceCategory = () => {
  categoryIndex.value += 1;
};

// 往回退一格。自动播放只会前进，这条只给手滑用。
// index 已经是 0 时没有可退的位置（轨道左端就在这里），直接忽略 ——
// 尾部的克隆只够往前推进 PER_VIEW 格，左端没有对应的镜像可跳。
const retreatCategory = () => {
  if (categoryIndex.value <= 0) return;
  categoryIndex.value -= 1;
};

const handleCategoryTransitionEnd = (event) => {
  // 卡片图片的 hover 动画也会冒泡到这里，必须限定目标和属性
  if (event.target !== categoryTrackRef.value) return;
  if (event.propertyName !== 'transform') return;
  if (categoryIndex.value < categories.value.length) return;
  categoryAnimated.value = false;
  categoryIndex.value -= categories.value.length;
  // 等归零那一帧画出来再打开过渡，否则会看到倒退
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      categoryAnimated.value = true;
    });
  });
};

const stopCategoryAutoplay = () => {
  if (categoryTimer) clearInterval(categoryTimer);
  categoryTimer = null;
};

const startCategoryAutoplay = () => {
  stopCategoryAutoplay();
  if (categories.value.length < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  categoryTimer = setInterval(advanceCategory, CATEGORY_INTERVAL);
};

// 手滑期间停自动播放，松手后重开：不停的话刚滑完可能立刻被定时器再推一格
const categorySwipe = createSwipe({
  onLeft: advanceCategory,
  onRight: retreatCategory,
  onStart: stopCategoryAutoplay,
  onEnd: startCategoryAutoplay
});

// 后台标签页不推进，避免回到前台时积压一堆待归零的位移
const handleCategoryVisibility = () => {
  if (document.hidden) stopCategoryAutoplay();
  else startCategoryAutoplay();
};

onMounted(() => {
  startCategoryAutoplay();
  document.addEventListener('visibilitychange', handleCategoryVisibility);
});

onBeforeUnmount(() => {
  stopCategoryAutoplay();
  document.removeEventListener('visibilitychange', handleCategoryVisibility);
});

const goTo = (index) => carouselRef.value?.setActiveItem(index);
const previous = () => carouselRef.value?.prev();
const next = () => carouselRef.value?.next();
const handleSlideChange = (index) => {
  activeSlide.value = index;
};

// ElCarousel 不会卸载非当前项，所有幻灯片一直挂在 DOM 里。animate.css 的类
// 如果写成静态的，只会在挂载那一刻播一次，之后每轮轮播都是静止的。
// 绑到 activeSlide 上：离开时类被摘掉、回来时重新加上，动画就跟着重播。
const animateOn = (index, ...names) =>
  index === activeSlide.value ? ['animate__animated', ...names] : [];

// ElCarousel 自己不带触摸手势，手机端要滑动切换只能手动接
const heroSwipe = createSwipe({ onLeft: next, onRight: previous });
</script>

<template>
  <div class="home-page">
    <section
      class="home-hero"
      :aria-label="copy.carouselLabel"
      @touchstart.passive="heroSwipe.start"
      @touchend.passive="heroSwipe.end"
      @click.capture="heroSwipe.guardClick"
    >
      <ElCarousel
        ref="carouselRef"
        class="home-hero__carousel"
        height="100%"
        :interval="carouselConfig.interval"
        arrow="never"
        indicator-position="none"
        pause-on-hover
        @change="handleSlideChange"
      >
        <ElCarouselItem v-for="(slide, index) in slides" :key="slide.image">
          <div class="hero-slide">
            <!-- 图和遮罩一起淡入，当成一层处理：只淡图不淡遮罩的话，
                 切换那 400ms 会先看到一片深色再看到画面 -->
            <div
              class="hero-slide__frame"
              :class="animateOn(index, 'animate__fadeIn')"
            >
              <img
                :src="slide.image"
                :alt="slide.alt"
                class="hero-slide__media"
                :class="{ 'is-drifting': index === activeSlide }"
                decoding="async"
                :loading="slide.eager ? 'eager' : 'lazy'"
                :fetchpriority="slide.eager ? 'high' : 'auto'"
              />
              <div v-if="slide.text" class="hero-slide__shade"></div>
            </div>
            <div v-if="slide.text" class="hero-slide__copy">
              <component
                :is="index === 0 ? 'h1' : 'h2'"
                :class="animateOn(index, 'animate__fadeInDown')"
              >
                {{ slide.text.title }}
              </component>
              <!-- 有 Cta 的用按钮跳转，没有的把副标题本身做成链接 -->
              <RouterLink
                v-if="!slide.text.cta"
                :to="slide.to"
                class="hero-slide__subtitle-link"
                :class="animateOn(index, 'animate__fadeInUp')"
              >
                {{ slide.text.subtitle }}
              </RouterLink>
              <span v-else :class="animateOn(index, 'animate__fadeInUp')">
                {{ slide.text.subtitle }}
              </span>
              <RouterLink
                v-if="slide.text.cta"
                :to="slide.to"
                :class="animateOn(index, 'animate__fadeInUp')"
              >
                {{ slide.text.cta }}
              </RouterLink>
            </div>
          </div>
        </ElCarouselItem>
      </ElCarousel>

      <button
        class="hero-arrow hero-arrow--previous"
        type="button"
        :aria-label="copy.previous"
        @click="previous"
      >
        <ChevronLeft :size="38" stroke-width="3" />
      </button>
      <button
        class="hero-arrow hero-arrow--next"
        type="button"
        :aria-label="copy.next"
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
    <img
      class="bg-img"
      src="https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/bg2.png"
      alt=""
    />
    <section class="home-about">
      <div v-reveal="'animate__bounceInLeft'" class="home-about__copy">
        <!-- 纯装饰，三个点靠 CSS 轮流填色形成跑马灯，读屏不用念 -->
        <div class="dot" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
        </div>
        <h2>{{ copy.aboutTitle }}</h2>
        <strong>{{ copy.aboutEnglish }}</strong>
        <span class="line"></span>
        <p>{{ copy.aboutBody }}</p>
        <RouterLink to="/AboutUs">{{ copy.more }} <span>>>></span></RouterLink>
      </div>
      <img
        v-reveal="'animate__bounceInRight'"
        :src="featureImages.aboutCollage"
        :alt="copy.aboutImageAlt"
        class="home-about__collage"
      />
    </section>

    <section class="home-categories">
      <div v-reveal="'animate__bounceInLeft'" class="home-categories__heading">
        <p>{{ copy.categoryLabel }}</p>
        <h2>{{ copy.categoryTitle }}</h2>
      </div>
      <div
        v-reveal
        class="home-category-carousel"
        @mouseenter="stopCategoryAutoplay"
        @mouseleave="startCategoryAutoplay"
        @focusin="stopCategoryAutoplay"
        @focusout="startCategoryAutoplay"
        @touchstart.passive="categorySwipe.start"
        @touchend.passive="categorySwipe.end"
        @click.capture="categorySwipe.guardClick"
      >
        <div
          ref="categoryTrackRef"
          class="home-category-track"
          :class="{ 'is-animated': categoryAnimated }"
          :style="{ '--index': categoryIndex }"
          @transitionend="handleCategoryTransitionEnd"
        >
          <RouterLink
            v-for="(item, index) in categoryTrack"
            :key="index"
            :to="item.to"
            class="home-category-card"
            :aria-label="`${item.name} ${item.english}`"
            :aria-hidden="item.clone ? 'true' : null"
            :tabindex="item.clone ? -1 : null"
          >
            <img
              :src="item.image"
              :alt="item.clone ? '' : `${item.name} ${item.english}`"
              loading="lazy"
              decoding="async"
            />
          </RouterLink>
        </div>
      </div>
      <div class="category-pagination" aria-hidden="true">
        <i
          v-for="(item, index) in categories"
          :key="item.name"
          :class="{ active: activeCategory === index }"
        ></i>
      </div>
    </section>

    <RouterLink
      to="/AboutUs"
      class="home-brand-banner"
      :aria-label="copy.brandAria"
    >
      <img
        :src="featureImages.brandBanner"
        :alt="copy.brandImageAlt"
        class="home-brand-banner__media"
        loading="lazy"
        decoding="async"
      />
      <div class="home-brand-banner__copy">
        <img
          :src="copy.brandEyebrow"
          :alt="copy.brandLogoAlt"
          class="home-brand-banner__logo"
          v-reveal="'animate__fadeInDown'"
          loading="lazy"
          decoding="async"
        />
        <h2 v-reveal="'animate__fadeInDown'">{{ copy.brandTitle }}</h2>
        <span
          v-reveal="'animate__fadeInUp'"
          v-for="line in brandBodyLines"
          :key="line"
          >{{ line }}</span
        >
      </div>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  position: relative;
  // 下发给子元素读取：.home-about__copy h2 和 .home-categories__heading h2
  // 都通过 serif-heading mixin 取 var(--home-rose)
  --home-rose: #{$home-rose};

  min-width: 320px;
  overflow: hidden;
  background: $home-bg;
  color: $home-text;
  font-family: $font-sans;
  // 装饰用的竖条，贴在 hero 底部往上 100px 处。
  // hero 的高度是流式的（见 .home-hero），原来写死 top: 650px 只在某一个
  // 视口宽度下对得上：1920 下 hero 高 1044，650 差了近 400px；窄一点又反过来。
  // 所以把 hero 那条高度表达式提成变量，两处共用，改一处就同步。
  // hero 有 overflow: hidden，这个元素放不进去，只能留在 .home-page 里按
  // 同一个值算偏移。
  --hero-height: #{max(min(54.375vw, 1044px), 557px)};

  @include tablet-down {
    --hero-height: #{max(min(100svh, 820px), 680px)};
  }

  .bg-img {
    position: absolute;
    top: calc(var(--hero-height) - 100px);
    right: 0px;
    width: 214.4px;
    height: 2337.6px;

    // 手机端不显示：宽度 214px 在 390 的屏上要占掉半屏
    @include mobile {
      display: none;
    }
  }
}

.home-hero {
  position: relative;
  width: 100%;
  // 与 .home-page 的 --hero-height 是同一个值。.bg-img 要贴在本区块底部，
  // 但它在 .home-page 里（这里 overflow: hidden，放进来会被裁掉），
  // 只能靠这个变量对齐。改高度时改 .home-page 上那两条声明即可。
  height: var(--hero-height);
  overflow: hidden;
  background: $hero-bg;
  z-index: 9999;

  // 手机端改由宽高比定高。原图是横长方形，配 object-fit: cover 时框越矮、
  // 左右被裁掉的越少：3:4（390×520）只能看到原图约四成宽度，1:1（390×390）
  // 能看到约五成半。文案区约需 200px，390 高下图面仍余 190px，放得下。
  // 必须排在 tablet-down 之后 —— 两者在手机上同时命中，靠先后决胜。
  @include mobile {
    height: auto;
    min-height: 0;
    aspect-ratio: 1 / 1;
    max-height: 68svh;
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
@keyframes hero-drift {
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

    // 只给当前幻灯片开图层，5 张一直挂在 DOM 里，全开等于常驻 5 个合成层
    &.is-drifting {
      animation: hero-drift 6500ms ease-out both;
      will-change: transform;
    }
  }
  &__shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(3, 22, 31, 0.18),
      rgba(3, 22, 31, 0.58)
    );

    // 窄屏文案移到底部，遮罩跟着改成自下而上
    @include mobile {
      background: linear-gradient(
        0deg,
        rgba(3, 22, 31, 0.72),
        rgba(3, 22, 31, 0.12)
      );
    }
  }

  &__copy {
    position: absolute;
    top: 36%;
    right: 11.2%;
    z-index: 2;
    max-width: min(650px, 43vw);
    color: $white;
    text-align: right;
    // 文案统一 800ms，逐级延迟写在各自的规则里，标题→副标题→按钮依次进场。
    // 最迟的一条 560 + 800 = 1360ms，远小于 carouselConfig.interval（7000ms），
    // 不会被下一次切换打断。
    --animate-duration: 800ms;

    // 底部留 42px 给指示点，原来的 90px 在变矮后的框里显得头重脚轻
    @include mobile {
      inset: auto 20px 42px;
      top: auto;
      z-index: 3;
      max-width: none;
      text-align: left;
      text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
    }

    p {
      margin: 0 0 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.18em;

      @include mobile {
        margin-bottom: 14px;
        font-size: 10px;
      }
    }
    // 首屏用 h1，其余幻灯片用 h2，样式一致
    h1,
    h2 {
      margin: 0;
      max-width: 690px;
      font-family: $font-serif;
      font-size: clamp(40px, 3.5vw, 68px);
      line-height: 1.08;
      white-space: pre-line;
      // 200ms 让 el-carousel 那 400ms 的横移先走掉一半，标题不至于跟着平移
      animation-delay: 200ms;
      --animate-duration: 900ms;

      @include mobile {
        font-size: 30px;
        line-height: 1.16;
      }
    }

    span {
      display: block;
      margin-top: 16px;
      font-size: clamp(17px, 1.55vw, 30px);
      animation-delay: 380ms;

      @include mobile {
        margin-top: 10px;
        font-size: 14px;
      }
    }

    a {
      display: inline-flex;
      margin-top: 26px;
      animation-delay: 560ms;
      padding: 10px 30px;
      border-radius: 999px;
      background: $hero-cta;
      color: $white;
      font-size: clamp(17px, 1.3vw, 25px);
      font-weight: 700;
      text-decoration: none;

      @include mobile {
        margin-top: 16px;
        padding: 9px 22px;
        font-size: 14px;
      }
    }

    // 副标题链接要长得跟 span 一样，所以得压掉上面那条按钮样式。
    // 这里写成完整类名而不是 &__subtitle-link：嵌在 &__copy 里的 & 是
    // .hero-slide__copy，拼出来会是错的类名；写全名才能得到
    // `.hero-slide__copy .hero-slide__subtitle-link` 这个更高的权重。
    .hero-slide__subtitle-link {
      display: block;
      margin-top: 16px;
      // 它顶替的是 span 的位置，延迟也跟 span 一致，而不是上面 a 的 560ms
      animation-delay: 380ms;
      padding: 0;
      border-radius: 0;
      background: none;
      font-size: clamp(17px, 1.55vw, 30px);
      font-weight: 400;
      text-decoration: none;
      text-underline-offset: 6px;
      transition: text-decoration-color 250ms ease;

      @include mobile {
        margin-top: 10px;
        padding: 0;
        font-size: 14px;
      }

      &:hover,
      &:focus-visible {
        text-decoration: underline;
      }
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

// 跑马灯圆点：实心占满整个前 1/3 周期，之后瞬间转空心 —— 33.333% 与 33.334%
// 之间只隔 0.02ms，等于硬切，不做过渡。
// 必须硬切：淡出一定会跨过交接点，那段时间「正在淡的」和「刚亮的」同时发黑，
// 就是两个圆圈一起黑；淡出提前结束又会空出几十毫秒，变成三个全白。
// 亮 1/3、错开 1/3，交接点严丝合缝对上，任何时刻恰好一个是黑的。
@keyframes about-dot-run {
  0%,
  33.333% {
    background: $about-dot;
    transform: scale(1.15);
  }
  33.334%,
  100% {
    background: transparent;
    transform: scale(1);
  }
}

.home-about {
  margin-top: 42px;
  width: 100%;
  height: auto;
  padding: 0 7%;
  box-sizing: border-box;
  display: flex;
  align-items: start;
  justify-content: space-between;

  @include tablet-down {
    min-height: 0;
    // 这个区间放不下 715px，让右列按比例收缩，图片仍靠右。
    // 比例现在写在 &__collage 的 flex-basis 上 —— 原先这里是一条
    // grid-template-columns，但本元素是 display: flex，那条规则从来没生效过。
  }

  // 窄屏改成上下堆叠。必须排在 tablet-down 之后，权重相同靠先后决胜。
  // padding 归零：左右留白交给 &__copy 自己的 padding，图片要满宽出血。
  @include mobile {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    padding: 0;
  }

  &__copy {
    // 不设固定高度：原来写死 979px（= 图片原始高度），和 &__collage 的
    // aspect-ratio 是两份重复的魔法数字，图片一收缩就对不齐；窄屏更是撑出
    // 几百像素空白（390 下内容只要 459px）。现在各区间都由内容或拉伸决定。

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    // 只要父级是横排（≥768px）就让高度由右侧图片决定：
    // align-self 压掉父级的 align-items: start。窄屏是纵向堆叠，不需要。
    @include tablet-up {
      align-self: stretch;
    }

    // min-width 让左栏不再独自承担收缩 —— 图片的 min-width: auto 等于它的
    // 固有宽度 715px，不肯让，剩余空间全被左栏吐出来，1024 下只剩 166px、
    // 正文折成 8 行。锁死 340px（= p 的 max-width）后改由图片收缩。
    @include desktop-up {
      min-width: 340px;
    }

    @include tablet-down {
      padding-top: 90px;
      // 这个区间宽度不够锁 340px，放开让它继续收缩，否则会挤出横向溢出
      min-width: 0;
    }

    // 上面 tablet-down 的 90px 在手机端也会命中，压掉
    @include mobile {
      padding-top: 0;
    }

    @include mobile {
      padding: 30px 20px 26px;
    }

    // 三个圆点轮流填色，形成从左到右的跑马灯
    .dot {
      display: flex;
      align-items: center;
      gap: 34px;

      i {
        width: 11px;
        height: 11px;
        border: 1px solid $about-dot;
        border-radius: 50%;
        background: transparent;
        animation: about-dot-run 3000ms linear infinite;

        // 每个点错开 1/3 个周期 = 3000ms / 3。改上面的 duration 时这两个数
        // 必须跟着改，对不上交接点就会留缝（三个全白）或重叠（两个全黑）。
        // 不设 fill-mode，延迟期间维持空心，所以第一轮是干净的
        // 「点1 → 点2 → 点3」而不是三个一起亮。
        &:nth-child(2) {
          animation-delay: 1000ms;
        }

        &:nth-child(3) {
          animation-delay: 2000ms;
        }
      }
    }

    h2 {
      padding-top: 80px;
      @include serif-heading(1.35);

      // 这条 80px 原先没在手机端覆盖，跑马灯和标题之间白掉一大块
      @include mobile {
        padding-top: 22px;
        font-size: 28px;
      }
    }

    strong {
      display: block;
      margin-top: 18px;

      @include mobile {
        margin-top: 12px;
      }
      font-family: $font-georgia;
      font-size: 15px;
      line-height: 1.35;
      white-space: pre-line;
    }
    .line {
      width: 14px;
      height: 3px;
      background-color: #000;
      margin: 24px 0 32px 0;

      @include mobile {
        margin: 16px 0 0;
      }
    }

    p {
      max-width: 340px;
      margin: 30px 0 0;
      color: $home-muted;
      font-size: 13px;
      line-height: 2;

      @include mobile {
        max-width: none;
        margin-top: 18px;
        // 2 倍行距在窄屏上把段落拉得太散，收到 1.85
        line-height: 1.85;
      }
    }

    a {
      align-items: center;
      gap: 18px;
      margin-top: 68px;
      color: $home-rose-link;
      font-size: 12px;
      text-decoration: none;
      padding-bottom: 24px;
      border-bottom: 3px solid #000;

      // 横排区间吸到左栏底部：auto 外边距吃掉正文和它之间的全部剩余空间。
      // 左栏无 padding-bottom，所以这条下边框正好与图片底边齐平。
      // 必须和上面 &__copy 的 align-self: stretch 同区间 —— 只拉高不吸底，
      // 链接会浮在半空（1023 下离底 222px）。
      @include tablet-up {
        margin-top: auto;
      }

      @include mobile {
        margin-top: 22px;
        padding-bottom: 12px;
      }

      span {
        margin-left: 100px;

        // 100px 在 390 宽下把箭头顶到边上，收到 40px
        @include mobile {
          margin-left: 40px;
        }
      }

      &:hover span {
        width: 136px;
      }
    }
  }

  &__collage {
    // 原始尺寸 715×979，宽度够时按原始像素展示（≥1227px）；不够时等比缩小，
    // aspect-ratio 与原始比例一致，缩放时不会变形。
    width: 715px;
    max-width: 100%;
    height: auto;
    aspect-ratio: 715 / 979;
    object-fit: cover;

    // 解掉 flex 项默认的 min-width: auto（对替换元素等于固有宽度 715px）。
    // 不解的话图片一步不让，收缩全压在左栏身上。
    @include desktop-up {
      min-width: 0;
    }

    @include tablet-down {
      // 右列占比。原来这里是 width: 100%，会连左栏的位置一起吃掉，
      // 768 下把左栏压到 121px 并溢出 67px；改成 flex 三值后两栏按比例分。
      // 58% 沿用父级那条早已失效的 grid-template-columns 里的比例。
      flex: 0 1 58%;
      min-width: 0;
    }

    // 满宽 + 高度按原图比例自适应。原来是 115% 宽配 -9% 负边距做出血，
    // 再叠一个 715/979 的 aspect-ratio 把图裁成竖框；现在 auto 高度让
    // 715×979 完整显示，不裁。
    @include mobile {
      flex: none;
      width: 100%;
      max-width: none;
      margin-left: 0;
      height: auto;
      aspect-ratio: auto;
      object-fit: contain;
    }
  }

  // _motion.scss 的全局兜底会把动画掐成 0.01ms，跑马灯就停在「三个空心」。
  // 这里补一个静态终态，保持和设计稿一致：最后一个点是实心的。
  @include reduced-motion {
    .dot i {
      animation: none;

      &:last-child {
        background: $about-dot;
      }
    }
  }
}

.home-categories {
  position: relative;

  @include shell-width($shell-wide);

  margin: 0 auto;
  padding: 60px 0 36px 0;

  @include mobile {
    width: calc(100% - 40px);
    padding: 44px 0 40px;
  }

  &__heading {
    position: relative;
    z-index: 2;

    p {
      margin: 0 0 24px;
      color: $home-label;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.04em;

      @include mobile {
        margin-bottom: 12px;
        font-size: 12px;
      }
    }

    h2 {
      @include serif-heading(1.45);

      @include mobile {
        font-size: 26px;
      }
    }
  }
}

.home-category-carousel {
  // 视窗固定四格宽，超出部分裁掉，轨道在里面整体左移
  position: relative;
  z-index: 2;
  overflow: hidden;
  margin-top: clamp(58px, 5vw, 96px);
  --per-view: 4;
  --gap: clamp(16px, 1.25vw, 24px);

  @include tablet-down {
    --gap: 12px;
  }

  // 手机端一屏两格：四格时每格只有 88px 宽，图里什么都看不清。
  // --per-view 是 --card 计算式的入参，改这一个值整条轨道跟着走。
  @include mobile {
    --per-view: 2;
    --gap: 10px;
    margin-top: 26px;
  }
}

.home-category-track {
  display: flex;
  gap: var(--gap);
  // 每格宽度 = (视窗宽 - 间距总和) / 每屏格数
  --card: calc((100% - (var(--per-view) - 1) * var(--gap)) / var(--per-view));

  transform: translate3d(
    calc(-1 * var(--index) * (var(--card) + var(--gap))),
    0,
    0
  );
  // 常驻合成层：卡片宽度含小数（如 1440 下为 330.5px），
  // 不提层会在位移途中出现亚像素抖动
  will-change: transform;
  backface-visibility: hidden;

  &.is-animated {
    // 首尾速度均为 0 的对称缓动，起步不再突然发力、落位自然收住。
    // 时长须小于 CATEGORY_INTERVAL，留出静止间隙。
    transition: transform 1000ms $ease-symmetric;
  }
}

.home-category-card {
  display: block;
  flex: 0 0 var(--card);
  overflow: hidden;
  aspect-ratio: 397 / 535;
  background: $card-placeholder;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 500ms ease;
  }

  &:hover img {
    transform: scale(1.025);
  }
}

.category-pagination {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 42px;

  @include mobile {
    gap: 12px;
    margin-top: 22px;
  }

  i {
    display: block;
  }
}

.home-brand-banner {
  // 底图原始尺寸 1920×990，高度按此比例随宽度自适应，最高不超过原始高度。
  // 宽度不足时由 object-fit: cover 裁切左右，只保留中间部分；
  // 文案在正常流中，必要时可把容器撑高，不会被 overflow 裁掉。
  position: relative;
  display: grid;
  align-content: start;
  width: 100%;
  aspect-ratio: 1920 / 990;
  max-height: 990px;

  // 手机端高度与「露出多少宽度」是一个死结：图是 1920×990（比例 1.939），
  // cover 时按高度放大，渲染宽 = 高 × 1.939，露出的比例 = 390 / 渲染宽。
  // 所以框越高，左右裁掉的越多 —— 5:4（312px）只能看到原图 64%。
  // 16:10 得到 244px，能看到 82%；隐藏 logo 后文案只要约 140px，装得下，
  // 下面还留 100px 干净画面。要看满 100% 就得压到 201px，那文案会顶满整框。
  @include mobile {
    display: block;
    aspect-ratio: 16 / 10;
    max-height: none;
    background: $brand-banner-edge;
  }

  &__media {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &__copy {
    position: relative;
    z-index: 2;
    width: min(760px, calc(100% - 48px));
    margin: 0 auto;
    padding: 90px 0 70px;
    color: $white;
    text-align: center;

    // 平板区间收窄间距，让高度尽量仍由图片比例决定
    @include tablet-down {
      padding: 76px 0 48px;
    }

    // 贴住顶部、只占内容高度，压在图的上半部分。
    // 文字落在图上，而这一带的明暗不可控，加一层由深到透明的罩子保证可读；
    // 罩子在 82% 处收干净，不会在图中间留出一条硬边。
    @include mobile {
      position: absolute;
      inset: 0 0 auto;
      width: 100%;
      margin: 0;
      padding: 22px 20px 28px;
    }

    h2 {
      margin: 0 0 50px;
      font-family: $font-georgia;
      font-size: clamp(30px, 2.5vw, 48px);
      font-weight: 500;

      @include tablet-down {
        margin-bottom: 34px;
      }

      @include mobile {
        margin-bottom: 10px;
        font-size: 18px;
      }
    }

    span {
      display: block;
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.8;

      @include mobile {
        margin-top: 5px;
        font-size: 10px;
        line-height: 1.6;
      }
    }
  }

  &__logo {
    width: 246px;
    height: auto;
    margin: 0 auto 60px;
    display: block;

    @include tablet-down {
      width: 200px;
      margin-bottom: 34px;
    }

    // 手机端不显示：省下的高度让容器变矮，图的左右就少裁一截。
    // 用 display 而不是 v-if，是因为这纯粹是断点差异，不值得为它引入
    // matchMedia 状态；代价是这张图仍会被下载。
    @include mobile {
      display: none;
    }
  }
}
</style>
