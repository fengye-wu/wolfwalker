<script setup>
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  Truck,
  Wrench
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import UiLinkButton from '../components/UiLinkButton.vue';
import { getCategory, getProduct, products } from '../data/products';
import { useLocale } from '../composables/useLocale';

const route = useRoute();
const { locale, t } = useLocale();
const quantity = ref(50);
const product = computed(() =>
  getProduct(route.params.category, route.params.id)
);
const category = computed(() =>
  product.value ? getCategory(product.value.category) : null
);
const related = computed(() =>
  product.value
    ? products
        .filter(
          (item) =>
            item.category === product.value.category &&
            item.id !== product.value.id
        )
        .slice(0, 4)
    : []
);
// 真图还没到：主图用当前商品图，另外两张从同类循环补齐，保证详情页始终有 3 张。
const detailImages = computed(() => {
  if (!product.value) return [];
  const pool = [
    product.value.image,
    ...products
      .filter((item) => item.category === product.value.category)
      .map((item) => item.image)
      .filter((image) => image !== product.value.image),
  ];
  const unique = [...new Set(pool)];
  return Array.from({ length: 3 }, (_, index) => unique[index % unique.length]);
});
const selectedImage = ref(0);

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
      <div class="min-w-0">
        <div class="aspect-[5/4] overflow-hidden bg-[#e9ebe5]">
          <Transition name="image-swap" mode="out-in">
            <img
              :key="detailImages[selectedImage]"
              :src="detailImages[selectedImage]"
              :alt="product.imageAlt[locale]"
              class="size-full object-cover"
            />
          </Transition>
        </div>
        <div class="mt-3 grid grid-cols-3 gap-3">
          <ElButton
            v-for="(image, index) in detailImages"
            :key="`${image}-${index}`"
            class="thumbnail-button aspect-[4/3] overflow-hidden border-2 bg-[#e9ebe5] transition"
            :class="
              selectedImage === index
                ? 'border-signal'
                : 'border-transparent opacity-70 hover:opacity-100'
            "
            @click="selectedImage = index"
          >
            <img :src="image" alt="" class="size-full object-cover" />
          </ElButton>
        </div>
      </div>

      <div class="min-w-0 lg:sticky lg:top-28 lg:self-start">
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
          class="mt-8 grid grid-cols-3 border-y border-black/10 py-6 text-center"
        >
          <div class="border-r border-black/10 px-2">
            <Truck class="mx-auto text-pine" :size="21" /><strong
              class="mt-2 block text-xs"
              >{{ t.leadTime }}</strong
            ><span class="mt-1 block text-[11px] text-black/45">{{
              t.leadValue
            }}</span>
          </div>
          <div class="border-r border-black/10 px-2">
            <ShieldCheck class="mx-auto text-pine" :size="21" /><strong
              class="mt-2 block text-xs"
              >{{ t.quantity }}</strong
            ><span class="mt-1 block text-[11px] text-black/45">{{
              t.moqValue
            }}</span>
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

        <div class="mt-8">
          <label
            class="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-black/45"
            >{{ t.quantity }}</label
          >
          <div class="flex gap-3">
            <ElInputNumber v-model="quantity" :min="50" :step="10" class="quantity-input" />
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

    <section class="bg-white py-16 lg:py-24">
      <div
        class="site-container grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20"
      >
        <div v-reveal>
          <p class="eyebrow">
            {{ locale === 'zh' ? 'WOLFWALKER 品质标准' : 'WOLFWALKER QUALITY' }}
          </p>
          <h2 class="section-title">{{ t.overview }}</h2>
        </div>
        <div v-reveal class="space-y-6 text-base leading-8 text-black/60">
          <p>{{ product.description[locale] }}</p>
          <div class="grid gap-4 sm:grid-cols-2">
            <p
              v-for="text in locale === 'zh'
                ? [
                    '精选耐用材料，适应高频户外使用。',
                    '结构经过反复测试，搭建收纳简单直观。',
                    '支持品牌、颜色与包装定制。',
                    '标准化品控流程，稳定服务全球订单。'
                  ]
                : [
                    'Durable materials selected for frequent outdoor use.',
                    'Repeatedly tested structures with intuitive setup.',
                    'Brand, color and packaging customization available.',
                    'Standardized quality control for dependable global orders.'
                  ]"
              :key="text"
              class="flex gap-3 border-t border-black/10 pt-4"
            >
              <Check :size="18" class="mt-1 shrink-0 text-signal" />{{ text }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="site-container py-16 lg:py-24">
      <div class="flex items-end justify-between">
        <div>
          <p class="eyebrow">
            {{ locale === 'zh' ? '更多探索' : 'MORE TO EXPLORE' }}
          </p>
          <h2 class="section-title">{{ t.related }}</h2>
        </div>
        <RouterLink
          to="/product"
          class="hidden items-center gap-2 text-sm font-bold sm:flex"
          >{{ t.backProducts }} <ArrowRight :size="18"
        /></RouterLink>
      </div>
      <div
        class="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-6"
      >
        <ProductCard
          v-for="item in related"
          :key="item.sku"
          v-reveal
          :product="item"
        />
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
.image-swap-enter-active,
.image-swap-leave-active {
  transition: opacity 220ms ease;
}
.image-swap-enter-from,
.image-swap-leave-to {
  opacity: 0;
}
</style>
