<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useLocale } from '../composables/useLocale';
import { createSwipe } from '../composables/useSwipe';
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
const categories = computed(() =>
  categoryRoutes.map((route, index) => {
    const name = copy.value.categoryNames[index];
    const english = copy.value.categoryEnglish[index];
    return {
      image: categoryImages[index],
      name,
      english,
      // name 和 english 只进 aria-label 和 alt，卡面上并不显示文字。
      // 英文版两者本来就是同一句，拼起来读屏会念两遍「Tent & Awning
      // Tent & Awning」，相同就只留一份。
      label: name === english ? name : `${name} ${english}`,
      to: `/product?category=${route}`
    };
  })
);

// 商品轮播：pc 端一屏四格左对齐，手机端一屏「上一张的 1/5 + 当前整张 +
// 下一张的 1/5」、当前那张居中。每 3 秒往左推进一格，循环播放。
// 把开头的 PER_VIEW 张复制到末尾，推进到第 baseCount 格时画面与第 0 格
// 完全一致，此刻去掉过渡瞬间归零，所以看不出重置。
const CATEGORY_PER_VIEW = 4;
// 间隔必须大于 .home-category-track 的过渡时长（pc 1000ms / 手机 420ms），
// 否则过渡会被下一次推进打断，transitionend 不触发，归零就会失效。
const CATEGORY_INTERVAL = 3000;

// 手机端当前那张居中，它左边那格要露出 1/5，所以轨道头部也得挂一张克隆
// （末尾那张），否则第 0 格左侧是空的，居中后左边就是一块白。
// pc 端左对齐用不到这一张，但轨道数组两端共用，靠 CSS 的 --lead 把它移出视窗。
const categoryTrack = computed(() => {
  const list = categories.value;
  if (!list.length) return [];
  return [
    { ...list[list.length - 1], clone: true },
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
// 手指按住时的实时横向偏移（px）。轨道位移是「整格位移 + 这个值」，
// 图跟着手走，松手才吸附到最近的格。
const categoryDrag = ref(0);
const categoryDragging = ref(false);
let categoryTimer = null;

const activeCategory = computed(() =>
  categories.value.length ? categoryIndex.value % categories.value.length : 0
);

const advanceCategory = () => {
  categoryIndex.value += 1;
};

// 往回退一格。自动播放只会前进，这条只给手滑用。
//
// index 为 0 时原来直接 return，第一张就右滑不动 —— 这是那个 bug。
// 轨道左端没有可退的格，但可以借尾部那份：推进到第 baseCount 格时画面与
// 第 0 格完全一致（handleCategoryTransitionEnd 就是靠这个等价性归零的），
// 反过来用同一个等价性 —— 先无过渡地跳到 baseCount，那一帧看起来和现在
// 没有区别，再正常退一格，于是从左边滑进来的是最后一张。
//
// 改成跟手后这个分支基本不会走：beginCategoryDrag 在按下那一刻（drag 还是
// 0、画面没动）就已经归位过了。留着是给非跟手的调用兜底。
const retreatCategory = () => {
  const baseCount = categories.value.length;
  if (!baseCount) return;

  if (categoryIndex.value <= 0) {
    // 跳过去的这一步必须关掉过渡，否则会看到整条轨道往右飞一遍
    categoryAnimated.value = false;
    categoryIndex.value = baseCount;
    // 等跳位那一帧真的画出来再开过渡并后退，两件事挤在同一帧里
    // 浏览器会合并成一次布局，结果还是能看到那一飞。
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        categoryAnimated.value = true;
        categoryIndex.value -= 1;
      });
    });
    return;
  }

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

// 实测一格宽度。阈值取卡片的 22%（390 屏约 58px），跟着卡片大小走，
// 不写死 px —— 卡片在各断点差一倍多，固定值在小屏偏钝、大屏偏灵。
const categoryCardWidth = () => {
  const first = categoryTrackRef.value?.firstElementChild;
  return first?.getBoundingClientRect().width ?? 240;
};

// 跟手期间不让轨道跑出克隆能覆盖的范围。两端各有克隆兜着，
// 拖过一格多就已经没有内容可露，夹住免得拖出空白。
const CATEGORY_DRAG_LIMIT = 1.2;

// touchstart：只停自动播放。此时方向还没定，不能动轨道状态 ——
// 竖着滚页面的手势也会经过这里。
const beginCategoryDrag = () => {
  stopCategoryAutoplay();
};

// 方向锁定为横向后才真正进入跟手态。
const lockCategoryDrag = () => {
  // index 为 0 时左端没有可退的格。retreatCategory 用「先无过渡跳到
  // baseCount」来借尾部的等价画面，但跟手模式不能等到松手才跳 ——
  // 那一下会在已经拖出 80px 的画面上瞬移。所以在这里先归位：
  // 此刻 drag 还是 0（轴锁阈值 8px 内不动轨道），跳过去画面没有变化。
  const baseCount = categories.value.length;
  if (baseCount && categoryIndex.value <= 0) {
    categoryAnimated.value = false;
    categoryIndex.value = baseCount;
  }

  categoryDragging.value = true;
  categoryAnimated.value = false;
};

const moveCategoryDrag = (deltaX) => {
  const limit = categoryCardWidth() * CATEGORY_DRAG_LIMIT;
  categoryDrag.value = Math.max(-limit, Math.min(limit, deltaX));
};

// 松手：偏移归零 + 翻页在同一次更新里做完，过渡才是从当前手指位置
// 平滑接到目标格。分两帧做会先弹回原位再走一格，看着是两段。
const settleCategoryDrag = (step) => {
  categoryDragging.value = false;
  categoryDrag.value = 0;
  categoryAnimated.value = true;
  if (step === 1) advanceCategory();
  else if (step === -1) retreatCategory();
  startCategoryAutoplay();
};

// 手滑期间停自动播放，松手后重开：不停的话刚滑完可能立刻被定时器再推一格
const categorySwipe = createSwipe({
  onStart: beginCategoryDrag,
  onLock: lockCategoryDrag,
  onMove: moveCategoryDrag,
  onSettle: settleCategoryDrag,
  threshold: () => categoryCardWidth() * 0.22
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
        @touchmove.passive="categorySwipe.move"
        @touchend.passive="categorySwipe.end"
        @click.capture="categorySwipe.guardClick"
      >
        <div
          ref="categoryTrackRef"
          class="home-category-track"
          :class="{
            'is-animated': categoryAnimated,
            'is-dragging': categoryDragging
          }"
          :style="{ '--index': categoryIndex, '--drag': categoryDrag + 'px' }"
          @transitionend="handleCategoryTransitionEnd"
        >
          <RouterLink
            v-for="(item, index) in categoryTrack"
            :key="index"
            :to="item.to"
            class="home-category-card"
            :aria-label="item.label"
            :aria-hidden="item.clone ? 'true' : null"
            :tabindex="item.clone ? -1 : null"
          >
            <img
              :src="item.image"
              :alt="item.clone ? '' : item.label"
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
  //
  // 从 1/1 调到 4/5：390 屏由 390px 增到 488px，文案下方空间更宽裕，
  // 首屏也更有气势。代价是 cover 下左右裁得更多（能看到的原图宽度由约
  // 五成半降到约四成半）—— 加高和少裁这两件事在 cover 下是对立的。
  // max-height 同步放到 78svh：还留 1/5 屏给下一屏露头，提示可以往下滚。
  @include mobile {
    height: auto;
    min-height: 0;
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
    // 标题改成 nowrap 后，这个框要能被文字撑开：原来是 max-width: min(650px, 43vw)，
    // 英文标题需要 1108px（1920 下），框只给 650px，多出来的部分朝右溢出，
    // 被 .home-hero 的 overflow: hidden 切掉一截。
    // max-content 让框贴合最长那行，right: 11.2% 仍钉住右边缘，文字向左生长。
    // 上限收在距左边 88.8% 之内（= 100% - 11.2%），避免超长文案顶到屏幕左沿。
    width: max-content;
    max-width: 88.8%;
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
      // 必须把上面那条 width: max-content 放掉，副标题才可能换行 ——
      // max-content 的框按「所有子元素都不折行」算宽度，子元素自然永远换不了行。
      // 改成 auto 后 left/right 同时生效，框宽 = 视口 - 40px，副标题超出即折行。
      // 标题是 nowrap，这里不再需要收缩包裹的框（它另有 vw 字号保证一行装得下）。
      width: auto;
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
      font-family: $font-serif;
      // 各断点均比原值小 2px（原为 clamp(40px, 3.5vw, 68px)）
      font-size: clamp(38px, 3.5vw, 66px);
      line-height: 1.08;
      // 强制一行：标题本身不带 \n，原先靠 max-width: 690px 自然折行，
      // 英文那几句（最长 "Partnership starts with one conversation."）会折成两行。
      // nowrap 之后宽度限制必须一起去掉，否则 690px 处照样断开；
      // 父级 &__copy 的 max-width 也要放开，见上面那条注释。
      white-space: nowrap;
      // 200ms 让 el-carousel 那 400ms 的横移先走掉一半，标题不至于跟着平移
      animation-delay: 200ms;
      --animate-duration: 900ms;

      @include mobile {
        // 中文最长「让合作，从一次沟通开始」在 360 屏上 28px 只要 308px，装得下
        font-size: 28px;
        line-height: 1.16;
      }
    }

    // 手机端英文单独收字号：可用宽只有 viewport - 40px（360 屏上 320px），
    // 而最长那句 "Partnership starts with one conversation." 在 28px 下要 502px，
    // 一行放不进去，会被 .home-hero 的 overflow: hidden 截断。
    // 实测各屏所需上限几乎正比于视口宽（360→17.8px、390→19.5px、414→20.8px、
    // 430→21.7px），取 4.9vw 贴着这条线的下方，再用 clamp 兜住极窄和极宽两端。
    // 用 4.9 而不是 5：5vw 在 360 屏上得 18px，最长那句要 322px、只差 2px 装不下。
    // 只降英文：中文在 28px 下本来就放得下，没必要一起变小。
    // lang 由 useLocale 的 watch 同步到 documentElement，切语言即时生效。
    :root:lang(en) & h1,
    :root:lang(en) & h2 {
      @include mobile {
        font-size: clamp(16px, 4.9vw, 24px);
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
        // 允许折行后补一个行距：默认继承 body 的行距，两行副标题会挤在一起。
        // 1.5 与站内其他小字一致。
        line-height: 1.5;
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
      // 这条原来是固定 90px，是左右两栏高度对不齐的唯一原因：
      // align-self: stretch 只会把矮的一栏拉到和高的一样，不会把高的压下去。
      // 图片高度随宽度走（flex-basis 58% + aspect-ratio），768 下只有 479px，
      // 而 90px 死死加在正文上，让左栏净高 529px —— 左栏反过来成了撑高的那个，
      // 图片底边就比链接下边框高出 50px。
      // 换成跟着视口宽度走：768 下 34px、832 下 37px，左栏始终矮于图片，
      // 高度重新由图片决定，stretch 才有东西可对齐。上限仍收在 90px。
      padding-top: clamp(30px, 4.5vw, 90px);
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
      padding-top: 5cqw;
      @include serif-heading(1.35);

      // 5cqw 在 768 下是 38px，加上 &__copy 自己的上留白，标题上方一共 73px，
      // 而这个区间图片才 479px 高，装不下。收到 3.2cqw（≈25px）。
      // 注意 cqw 在没有 container-type 的祖先时退化成 svw，所以这里等价于按视口宽算。
      @include tablet-down {
        padding-top: 3.2cqw;
      }

      // 这条 80px 原先没在手机端覆盖，跑马灯和标题之间白掉一大块
      @include mobile {
        padding-top: 22px;
        font-size: 28px;
      }
    }

    strong {
      display: block;
      margin-top: 18px;

      // 窄端最后 6px：与手机端取同一个值，横排窄端和窄屏本来就该更紧凑。
      @include tablet-down {
        margin-top: 12px;
      }

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
      margin: 20px 0 32px 0;

      // 横排的窄端（768-800）左栏净高本来就顶到图片高度，英文文案比中文多一行，
      // 32px 的下留白正好把它顶过去。收到 22px。
      @include tablet-down {
        margin-bottom: 22px;
      }

      @include mobile {
        margin: 16px 0 0;
      }
    }

    p {
      max-width: 340px;
      margin: 20px 0 0;
      color: $home-muted;
      font-size: 13px;
      line-height: 2;

      // 同上：这个区间左栏宽度只剩 308px，英文正文折到 7 行（中文 6 行），
      // 2 倍行距下多出的那 26px 就是左右两栏高度差的来源。1.85 与手机端一致。
      @include tablet-down {
        line-height: 1.85;
      }

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

      // 这条下边框要和图片底边齐平，所以它的 padding 也算在左栏净高里。
      // 窄端把 24px 收到 18px，替左栏再腾出 6px。
      @include tablet-down {
        padding-bottom: 18px;
      }

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
    // 原始尺寸 715×979，是宽高的上限；不够时等比缩小，
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

      // 再加一道按视口高度的上限。原来只卡宽度，979px 的原始高度在
      // 1920×1080 上超过可视区（去掉头部约剩 1000px），图的下半截要滚动
      // 才看得到，两栏也跟着被拉长。
      // 换算：aspect-ratio 已经锁住比例，所以只需给宽度设上限 ——
      // 高度预算取 82vh，对应宽度 = 82vh × (715 / 979) ≈ 59.9vh。
      // 两者取小：1080 高下得 647px（原尺寸的 90%），900 高下得 539px，
      // 视口高到 1255px 以上才用满 715px。
      width: min(715px, 59.9vh);
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

  // 左右各留 7%，和 .home-about 的 padding: 0 7% 对齐，两个栏目左边缘同一条竖线。
  // 这里不能写成「宽度 calc(100% - 64px) + margin: 0 7%」—— 那是两套各留边距的
  // 算法叠在一起，宽度只扣 64px，margin 又要吃掉 14%，加起来超出父级：
  // 1440 下 1376 + 201×2 = 1778px，右侧 338px 被 .home-page 的 overflow: hidden
  // 裁掉，轨道最后一格和分页点都跑出去了。
  // 所以留白只由一处负责：宽度取 86%（= 100% - 7%×2），margin: 0 auto 居中，
  // 两侧自然各得 7%。$shell-wide 的上限保留 —— 视口宽过 1930px 后 86% 会超过
  // 1660px，卡片会被拉到 400px 以上。到那时改由居中维持左右对称。
  width: min($shell-wide, 86%);
  margin: 0 auto;
  padding: 60px 0 36px 0;

  // 手机端 7% 只有 27px，太窄，仍用固定 20px；margin 必须跟着改回 auto，
  // 否则继承上面那条 0 auto 之外的值时会再次溢出。
  @include mobile {
    width: calc(100% - 40px);
    margin: 0 auto;
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

  // 每格宽度 = (视窗宽 - 间距总和) / 每屏格数，一屏 P 格时中间有 P-1 道间距。
  // --card 和下面的 --lead 必须声明在同一个元素上：自定义属性在声明它的元素
  // 上就地解析，--lead 写在这里而 --card 写在轨道上的话，这里的 var(--card)
  // 取不到值，整条 --lead 变成无效。
  // 百分比在 flex-basis 里按弹性容器（轨道）宽算，在 transform 里按被变换元素
  // （也是轨道）宽算 —— 轨道与本元素同宽，所以两处结果一致。
  --card: calc((100% - (var(--per-view) - 1) * var(--gap)) / var(--per-view));
  // pc 端左对齐：轨道头部那张克隆要移出视窗左侧，所以起手就退一格。
  --lead: calc(-1 * (var(--card) + var(--gap)));
  // 只有手机端跟手，pc 端恒为 0
  --drag: 0px;

  @include tablet-down {
    --gap: 12px;
  }

  // 手机端：当前那张居中，左右各露出相邻那张的 1/5。
  //
  // 满幅铺开 —— 父级 .home-categories 手机端留了左右各 20px，轮播用负 margin
  // 顶回视口边缘。图能宽 40px，而两侧露出的 1/5 本身就是视觉留白，
  // 不需要再额外留边。标题仍在父级的 20px 内缩里，左边缘照旧对齐。
  //
  // 一屏装的是 0.2 + 1 + 0.2 = 1.4 格外加两道间距，所以 --card 不能走
  // 通用式（那条按 per-view - 1 道间距算），这里直接给：
  //   card = (视窗宽 - 2 × gap) / 1.4
  // 390 屏：(390 - 20) / 1.4 = 264px，比原来的 230px 大 15%（面积 +32%）。
  @include mobile {
    --gap: 10px;
    margin: 26px -20px 0;

    // 一屏是 0.2 + 1 + 0.2 格，两侧各切了一刀，所以有 2 道完整间距，
    // 上面那条通用式按 per-view - 1 道算，套不上，单独给。
    --card: calc((100% - 2 * var(--gap)) / 1.4);

    // 当前格要居中：它左边只该露出一个 peek（= card / 5），所以整条轨道
    // 在左对齐的基础上再右移 peek + 一道间距。
    // 化简后是 -0.8 × card；390 屏 card = 264，lead = -211.2px。
    --lead: calc(var(--card) / 5 + var(--gap) - (var(--card) + var(--gap)));
  }
}

.home-category-track {
  display: flex;
  gap: var(--gap);
  // --lead 把「第 0 格该停在哪」一次算清（见 .home-category-carousel），
  // 这里只负责按 index 整格推进，再叠上跟手的实时偏移。
  transform: translate3d(
    calc(
      var(--lead) - var(--index) * (var(--card) + var(--gap)) + var(--drag)
    ),
    0,
    0
  );
  // 常驻合成层：卡片宽度含小数（如 1440 下为 330.5px），
  // 不提层会在位移途中出现亚像素抖动
  will-change: transform;
  backface-visibility: hidden;
  // 竖向照旧交给页面滚动，横向手势归轨道。不写这条的话跟手时浏览器
  // 会一边滚页面一边拖轨道，两个方向打架。
  touch-action: pan-y;

  &.is-animated {
    // 首尾速度均为 0 的对称缓动，起步不再突然发力、落位自然收住。
    // 时长须小于 CATEGORY_INTERVAL，留出静止间隙。
    transition: transform 1000ms $ease-symmetric;

    // 手机端 1000ms 是「不够丝滑」的主因：手指已经松开半秒图还在慢慢挪。
    // 触屏上的翻页手感落在 300-450ms，取 420ms —— 仍远小于
    // CATEGORY_INTERVAL(3000ms)，自动播放的静止间隙不受影响。
    // 缓动换成末端更长的收势，落位干脆但不生硬。
    @include mobile {
      transition: transform 420ms cubic-bezier(0.22, 0.61, 0.24, 1);
    }
  }

  // 跟手期间必须无过渡：有过渡的话每次 touchmove 都要重新起一段动画，
  // 图会滞后于手指，正好是「不丝滑」的另一半原因。
  &.is-dragging {
    transition: none;
  }
}

.home-category-card {
  display: block;
  // 遮罩用 ::after 定位，需要一个定位祖先
  position: relative;
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

  // 常态压一层 30% 黑罩，鼠标移入褪去、移出复原 —— 让指针所在那张比邻居亮，
  // 配合已有的 1.025 放大，指向性更明确。
  // 只在 pc 端：手机没有 hover，罩子会永久压在图上，四张卡全程发暗。
  // 用 ::after 而不是加一层 div：卡片里只有一张图，没有别的内容要盖，
  // 而且 DOM 里那 11 个节点（含 4 个克隆）都要跟着多一层。
  // 跟 img 同为 500ms ease，两个效果同步收尾。
  @include tablet-up {
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      transition: opacity 500ms ease;
      // 卡片本身是链接，罩子别拦点击
      pointer-events: none;
    }

    &:hover::after {
      opacity: 0;
    }
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
  // 16:10 得到 244px，能看到 82%；要看满 100% 就得压到 201px。
  //
  // 现在按需求把高度翻一倍：16/10 在 390 屏是 244px，4/5 得 488px，正好两倍。
  // 代价就是上面那条死结的另一头 —— 露出的原图宽度从 82% 降到约 41%，
  // 构图只剩中间一条。换来的是文案区宽松得多，logo 也放得回来（见 &__logo）。
  @include mobile {
    display: block;
    aspect-ratio: 4 / 5;
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
    // 原为 760px。中文正文加了 2px 字距后最长那行要 768px，差 8px 就得折行，
    // 放到 800px 留一点余量。h2 是 pre-line、按文案里的换行断，不受这 40px 影响。
    width: min(800px, calc(100% - 48px));
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
      // 原为 500。scoped 的特异性压过 _base.scss 那条全局 h1-h6，得单独改
      font-weight: 700;

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

      // pc 端加 2px 字距，正文更舒展。手机端保持原样：10px 的字再撑字距，
      // 一行能放的字数明显变少，折行位置会乱。
      @include tablet-up {
        letter-spacing: 2px;
      }

      @include mobile {
        margin-top: 5px;
        font-size: 10px;
        line-height: 1.6;
      }
    }

    // 中文正文不折行。放在 desktop-up 而不是 tablet-up：加了字距后中文最长那行
    // 要 768px，而 768-847px 这段框宽是 calc(100% - 48px)（720-799px），装不下；
    // 真按 nowrap 会顶到屏幕两侧甚至溢出，所以那一段仍让它折行。
    //
    // 只给中文：英文同一行要 1528px —— 是框宽的两倍，1920 视口才勉强放得下，
    // 1440 及以下连视口都装不进（1440 下差 88px）。字号收到能装下得压到 7px 上下，
    // 没法读。英文这三行本来就是长句，折行是正常排版，这里只保留 2px 字距。
    // :lang(zh) 前缀匹配 documentElement 上的 zh-CN，由 useLocale 的 watch 同步。
    :root:lang(zh) & span {
      @include desktop-up {
        white-space: nowrap;
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

    // 原来手机端 display: none —— 那是为了省高度、让图少裁一截。
    // 现在容器已经翻倍到 488px，这个理由不成立了，放回来。
    // 宽度收到 150px：上面 tablet-down 那条 200px 在 390 屏上占了文案区
    // （350px）的 57%，压着下面三行正文显得头重；150px 约四成三，配 20px
    // 下留白，和正文之间还有呼吸。
    @include mobile {
      display: block;
      width: 150px;
      margin-bottom: 20px;
    }
  }
}
</style>
