<script setup>
// 帐篷工厂介绍页（/factoryTent）。工厂介绍页第一张卡「查看」的落地页。
// 设计稿为 1920 宽英文版，除「产品轮播」和「视频」外全部为整幅切图
// （src/images/factoryTent/pc，编号 1-6 按设计稿自上而下的顺序）。
// 切图都是 1920 宽的内容层，直接 w-full 等比缩放即可，不写死高度。
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLocale } from '../composables/useLocale';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard.vue';

// 切图已上传阿里云 OSS，与本地留档同名（编号 1-6 对应设计稿自上而下）。
const OSS_FT = 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/factoryTent/pc';
const heroPhoto = `${OSS_FT}/1.jpg`;
const heroText = `${OSS_FT}/2.png`;
const flowImage = `${OSS_FT}/3.png`;
const gridImage = `${OSS_FT}/4.jpg`;
const qcLeft = `${OSS_FT}/5.png`;
const qcRight = `${OSS_FT}/6.png`;

const TENT_VIDEO =
  'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/detail/video/tent.mp4';

const copy = {
  zh: {
    seriesTitle: '帐篷产品系列',
    seriesNote: 'WOLFWALKER 帐篷全系列',
    videoAlt: '帐篷工厂视频',
  },
  en: {
    seriesTitle: 'TENT PRODUCT SERIES',
    seriesNote: 'WOLFWALKER full tent range',
    videoAlt: 'Tent factory video',
  },
};

const { locale } = useLocale();
const t = computed(() => copy[locale.value] ?? copy.zh);

// 轮播数据：帐篷分类下的全部产品，卡片样式与产品分类页共用 ProductCard。
const tentProducts = products.filter((item) => item.category === 'tent');

// 轮播翻页：按一张卡的宽度滚，snap 负责对齐。
const track = ref(null);
const slide = (dir) => {
  const el = track.value;
  if (!el) return;
  const card = el.querySelector('article');
  if (!card) return;
  const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 24);
  el.scrollBy({ left: dir * step, behavior: 'smooth' });
};

// 每 3 秒自动往后翻一张；滚到末尾回到开头。悬停/触摸时暂停，松手继续，
// 组件卸载清定时器。document.hidden 时不滚，避免后台标签页堆积滚动动画。
const paused = ref(false);
let timer = null;
onMounted(() => {
  timer = setInterval(() => {
    const el = track.value;
    if (!el || paused.value || document.hidden) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      slide(1);
    }
  }, 3000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="factory-tent bg-[#f4f6f9]">
    <!-- 1. 首屏：厂房外观图 + 英文标语文字层（两张同尺寸叠放，即设计稿首屏） -->
    <section class="relative aspect-[1920/1080] w-full overflow-hidden">
      <img
        :src="heroPhoto"
        alt="Wolfwalker tent factory exterior"
        class="absolute inset-0 size-full object-cover"
        fetchpriority="high"
      />
      <img
        :src="heroText"
        alt=""
        aria-hidden="true"
        v-reveal="'animate__fadeInUp'"
        class="absolute inset-0 size-full object-cover"
      />
    </section>

    <!-- 2. 帐篷产品轮播：全部帐篷产品，卡片样式与产品分类页一致 -->
    <section class="py-12 lg:py-16">
      <h2
        class="mb-8 px-6 text-2xl font-black uppercase tracking-wide text-[#1d5ebc] lg:px-16 lg:text-4xl"
        v-reveal
      >
        {{ t.seriesTitle }}
      </h2>
      <div class="relative px-6 lg:px-16">
        <div
          ref="track"
          class="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          @mouseenter="paused = true"
          @mouseleave="paused = false"
          @touchstart.passive="paused = true"
          @touchend.passive="paused = false"
        >
          <ProductCard
            v-for="(product, index) in tentProducts"
            :key="product.sku"
            v-reveal
            :product="product"
            :priority="index < 5"
            class="w-[68%] shrink-0 snap-start sm:w-[44%] md:w-[31%] lg:w-[calc((100%-6rem)/5)]"
          />
        </div>
        <!-- 左右翻页 -->
        <button
          type="button"
          aria-label="上一页"
          class="absolute left-2 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-[#1d5ebc] shadow-md transition hover:bg-white md:flex"
          @click="slide(-1)"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="下一页"
          class="absolute right-2 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl leading-none text-[#1d5ebc] shadow-md transition hover:bg-white md:flex"
          @click="slide(1)"
        >
          ›
        </button>
      </div>
    </section>

    <!-- 3. 帐篷厂视频：点击播放、循环（站点统一交互：不自动播 + loop） -->
    <section class="w-full">
      <h2 class="sr-only">{{ t.videoAlt }}</h2>
      <video
        :src="TENT_VIDEO"
        :aria-label="t.videoAlt"
        controls
        loop
        playsinline
        preload="metadata"
        class="block aspect-video w-full bg-black object-cover"
      ></video>
    </section>

    <!-- 4. 生产流程图（设计稿切图，整幅） -->
    <img
     v-reveal="'animate__fadeInUp'"
      :src="flowImage"
      alt="Production process"
      loading="lazy"
      class="block w-full"
    />

    <!-- 5. 车间图墙（设计稿切图，整幅） -->
    <img
     v-reveal="'animate__fadeInUp'"
      :src="gridImage"
      alt="Factory workshop photos"
      loading="lazy"
      class="block w-full"
    />

    <!-- 6. 品质保障区：左右两块内容层同画布叠放（切图 5 左 / 6 右，已验证无碰撞） -->
    <section class="relative aspect-[1920/1218] w-full">
      <img
       v-reveal="'animate__fadeInLeft'"
        :src="qcLeft"
        alt="Factory and sewing workshop"
        loading="lazy"
        class="absolute inset-0 size-full object-cover"
      />
      <img
       v-reveal="'animate__fadeInRight'"
        :src="qcRight"
        alt="Source factory, quality assured"
        loading="lazy"
        class="absolute inset-0 size-full object-cover"
      />
    </section>
  </div>
</template>
