<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import UiLinkButton from '../components/UiLinkButton.vue';
import { getCategory, getProduct } from '../data/products';
import {
  detailList,
  leadTimeByCategory,
  moqByCategory,
} from '../data/detail';
import { useLocale } from '../composables/useLocale';

const route = useRoute();
const { locale, t } = useLocale();

const product = computed(() =>
  getProduct(route.params.category, route.params.id)
);
const category = computed(() =>
  product.value ? getCategory(product.value.category) : null
);
const leadValue = computed(
  () => leadTimeByCategory[product.value?.category]?.[locale.value] ?? leadTimeByCategory.tent[locale.value]
);
const moq = computed(() => moqByCategory[product.value?.category] ?? moqByCategory.tent);
// 起订量同时是询价输入的下限和初值，切换品类时跟随
const quantity = ref(0);
watch(moq, (value) => {
  quantity.value = value;
}, { immediate: true });

// 详情展示数据来自 detail.js 的 detailList：条目按产品 id 顺序排列（下标 = id - 1），
// video / common 渲染在顶部，img 列表纵向依次往下排。
const EMPTY_DETAIL = { video: "", common: "", img: [] };
const detailMeta = computed(() => {
  if (!product.value) return EMPTY_DETAIL;
  const list = detailList[product.value.category];
  return list?.[Number(route.params.id) - 1] ?? EMPTY_DETAIL;
});
const detailImages = computed(() => detailMeta.value.img);

</script>

<template>
  <div v-if="product">
    <div class="site-container py-5 text-xs text-black/45">
      <RouterLink to="/" class="hover:text-signal">{{
        t.breadcrumbHome
      }}</RouterLink>
      <span class="px-2">/</span
      ><RouterLink to="/product" class="hover:text-signal">{{
        t.products
      }}</RouterLink>
      <span class="px-2">/</span><span>{{ category[locale] }}</span>
    </div>

    <section
      class="site-container grid gap-10 pb-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-16 lg:pb-24"
    >
      <!-- 左列：视频 → 公共图 → 详情图，纵向依次往下排，随页面滚动。
           图片多且长，右栏（sticky）的粘滞空间由这里自然撑出来。
           @error 兜底（方案 D）：OSS 上缺图/漏传时隐藏破图与黑框，
           counts 配置的小偏差不会以破图形式露出。 -->
      <div class="min-w-0">
        <video
          v-if="detailMeta.video"
          :src="detailMeta.video"
          :poster="product.image"
          controls
          playsinline
          preload="metadata"
          class="w-full bg-black"
          @error="$event.target.style.display = 'none'"
        ></video>
        <img
          v-if="detailMeta.common"
          :src="detailMeta.common"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          class="mt-3 w-full"
          @error="$event.target.style.display = 'none'"
        />
        <img
          v-for="(image, index) in detailImages"
          :key="image"
          :src="image"
          :alt="`${product.name[locale]} 详情图 ${index + 1}`"
          loading="lazy"
          decoding="async"
          class="mt-3 w-full"
          @error="$event.target.style.display = 'none'"
        />
      </div>

      <!-- 右栏粘性。粘滞区间 = 行高 - 右栏高；左列是视频 + 图片长流，
           高度远超右栏，粘滞空间自然充足。粘滞方向取 bottom（底部钉住
           视口底）而不是 top + max-h 内滚 —— 内容完整渲染，不出现
           内部滚动条：初始首屏可见名称/报价，往下滚参数表钉在视口底，
           滚回顶部名称描述自然回归。 -->
      <div
        class="detail-aside min-w-0 lg:sticky lg:bottom-0 lg:self-end"
      >
        <p class="eyebrow">{{ category[locale] }}</p>
        <h1
          class="break-title max-w-full font-display text-4xl font-black uppercase leading-[1.02] text-ink sm:text-5xl"
        >
          {{ product.name[locale] }}
        </h1>
        <p class="mt-6 text-base leading-8 text-black/60">
          {{ product.description[locale] }}
        </p>

        <div
          class="mt-8 grid grid-cols-3 border-y border-black/10 py-4 text-center"
        >
          <div class="border-r border-black/10 px-2">
            <Truck class="mx-auto text-pine" :size="21" /><strong
              class="mt-2 block text-xs"
              >{{ t.leadTime }}</strong
            ><span class="mt-1 block text-[11px] text-black/45">{{
              leadValue
            }}</span>
          </div>
          <div class="border-r border-black/10 px-2">
            <ShieldCheck class="mx-auto text-pine" :size="21" /><strong
              class="mt-2 block text-xs"
              >{{ t.tierPrice }}</strong
            >
            <!-- 档位价格三行展示（数据来自 products.js names 的 num/price），
                 取代原先单一的起购量；无档位数据时回落到 moq 兜底 -->
            <span
              v-if="product.tiers"
              class="flex flex-col mt-1 block text-[11px] leading-4 text-black/45"
            >
              <span
                v-for="tier in product.tiers"
                :key="tier.num"
                class="flex w-full items-baseline justify-between gap-2 px-6"
              >
                <span>≥{{ tier.num }} {{ locale === 'zh' ? '件' : 'pcs' }}</span>
                <span>${{ tier.price.toFixed(2) }}</span>
              </span>
            </span>
            <span v-else class="mt-1 block text-[11px] text-black/45">{{
              moq }} {{ locale === 'zh' ? '件' : 'pieces' }}</span>
          </div>
          <div class="px-2">
            <Wrench class="mx-auto text-pine" :size="21" /><strong
              class="mt-2 block text-xs"
              >{{ t.customization }}</strong
            ><span class="mt-1 block text-[11px] text-black/45">{{
              locale === 'zh' ? '品牌定制' : 'OEM / ODM'
            }}</span>
          </div>
        </div>

        <div class="mt-9">
            <p class="-mt-1 text-[11px] leading-5 text-black/45">{{ t.tierNotice }}</p>
          <div class="flex gap-3">
            <ElInputNumber v-model="quantity" :min="moq" :step="10" class="quantity-input" />
            <UiLinkButton
              :to="{
                path: '/contact',
                query: { product: product.sku, quantity }
              }"
              class="flex-1"
              >{{ t.requestQuote }} <ArrowRight :size="18"
            /></UiLinkButton>
          </div>
        </div>

        <div class="mt-9">
          <h2
            class="text-xs font-bold uppercase tracking-[0.16em] text-black/45"
          >
            {{ t.specs }}
          </h2>
          <dl class="mt-4 border-t border-black/10">
            <!-- 头两行固定为商品标识：货号取 sku，类型取品类名；后面跟 specs 数据 -->
            <div class="grid grid-cols-2 border-b border-black/10 py-3 text-sm">
              <dt class="text-black/45">{{
                locale === 'zh' ? '产品货号' : 'SKU'
              }}</dt>
              <dd class="font-medium text-ink">{{ product.sku }}</dd>
            </div>
            <div class="grid grid-cols-2 border-b border-black/10 py-3 text-sm">
              <dt class="text-black/45">{{
                locale === 'zh' ? '产品类型' : 'Category'
              }}</dt>
              <dd class="font-medium text-ink">{{ category[locale] }}</dd>
            </div>
            <div
              v-for="spec in product.specs[locale]"
              :key="spec[0]"
              class="grid grid-cols-2 border-b border-black/10 py-3 text-sm"
            >
              <dt class="text-black/45">{{ spec[0] }}</dt>
              <dd class="font-medium text-ink">{{ spec[1] }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  </div>

  <section
    v-else
    class="site-container grid min-h-[60vh] place-items-center py-24 text-center"
  >
    <div>
      <p class="font-display text-7xl font-black text-black/10">404</p>
      <h1 class="mt-4 text-2xl font-bold">{{ t.noProducts }}</h1>
      <UiLinkButton to="/product" variant="dark" class="mt-7"
        ><ArrowLeft :size="18" /> {{ t.backProducts }}</UiLinkButton
      >
    </div>
  </section>
</template>

<style scoped lang="scss">
// 详情图纵向长图流，无切换动效；间距统一交给模板里的 mt-3。

// 右栏粘滞方向按视口高度切换：
//   默认（矮视口，内容放不下）—— 底部粘滞（bottom-0 / self-end），
//   参数表等关键信息钉在视口底，顶部内容靠页面滚动查看，无内部滚动条；
//   屏幕足够高（≥800px：内容约 640px + 吸顶头部 112px 能完整放下）——
//   改为顶部对齐（top: 112px），与左侧视频顶部取平，消除首屏顶部空白。
// 内容高度随语言/字号有小幅波动，800 的阈值留了余量。
.detail-aside {
  @media (min-width: 1024px) and (min-height: 800px) {
    top: 112px;
    bottom: auto;
    align-self: start;
  }
}
</style>
