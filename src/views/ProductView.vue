<script setup>
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-vue-next';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import ProductHero from '../components/ProductHero.vue';
import UiLinkButton from '../components/UiLinkButton.vue';
import { categories, products } from '../data/products';
import { useLocale } from '../composables/useLocale';

const { locale, t } = useLocale();
const route = useRoute();
const router = useRouter();
const activeCategory = ref(route.query.category || 'all');
const search = ref('');
const mobileFilters = ref(false);
const productList = ref(null);

watch(
  () => route.query.category,
  (value) => {
    activeCategory.value = categories.some((item) => item.key === value)
      ? value
      : 'all';
  },
  { immediate: true }
);

const filteredProducts = computed(() =>
  products.filter((product) => {
    const categoryMatch =
      activeCategory.value === 'all' ||
      product.category === activeCategory.value;
    const term = search.value.trim().toLowerCase();
    const searchMatch =
      !term ||
      product.name.en.toLowerCase().includes(term) ||
      product.name.zh.includes(term) ||
      product.id.includes(term) ||
      product.sku.toLowerCase().includes(term);
    return categoryMatch && searchMatch;
  })
);

const chooseCategory = async (key) => {
  activeCategory.value = key;
  mobileFilters.value = false;
  await router.replace({ query: key === 'all' ? {} : { category: key } });
  await nextTick();
  productList.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// 跨页跳转带 #product-list 时在这里补滚。App.vue 的路由转场是 out-in：
// 旧页离场 240ms 后本组件才插入 DOM，而 vue-router 的 scrollBehavior 在
// DOM 更新后就执行，那一刻锚点还不存在，findTargetEl 找不到会静默放弃，
// 页面就停在上一页离开时的滚动位置（实测停在首页点击处附近）。
// 挂载后延一帧再滚，保证晚于 scrollBehavior 的 nextTick 执行；
// scrollIntoView 尊重锚点的 scroll-mt-24（96px），标题区最终落在吸顶头
// 下沿约 24px 处。平滑滚动来自 html 上的全局 scroll-behavior: smooth。
onMounted(() => {
  if (route.hash !== '#product-list') return;
  nextTick(() => {
    requestAnimationFrame(() => {
      document.getElementById('product-list')?.scrollIntoView({ block: 'start' });
    });
  });
});
</script>

<template>
  <div>
    <!-- 首屏换成七张一组的轮播（与首页顶部同一套骨架，见 ProductHero）。
         按钮不自己跳路由，emit 出来走 chooseCategory：那边除了改 query
         还会把商品列表滚进视口，否则点完人还停在首屏。 -->
    <ProductHero @select="chooseCategory" />

    <!-- 跳转锚点 #product-list 挂在标题区顶上，不挂 section 也不挂商品网格：
         挂 section 会把 py-14/lg:py-20 的顶部留白也滚进视野，标题和吸顶头
         之间隔一大段空；挂商品网格则标题区整个滚出视口上方。挂在标题区，
         滚动终点正好是「轮播图被滚过、商品分类/全部商品紧贴吸顶头下沿」。 -->
    <section class="site-container py-14 lg:py-20">
      <!-- productList ref 也挂在标题区：ProductHero 的 CTA 按钮走 chooseCategory
           滚到这里，与跨页 #product-list 跳转的落点完全一致（原先挂在商品网格，
           点完按钮标题区会被滚出视口上方）。 -->
      <div
        id="product-list"
        ref="productList"
        class="scroll-mt-24 flex flex-col gap-6 border-b border-black/10 pb-8 lg:scroll-mt-28 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p class="eyebrow">{{ t.categories }}</p>
          <h2 class="section-title">{{ t.allProducts }}</h2>
        </div>
        <div class="flex items-center gap-3">
          <ElInput
            v-model="search"
            clearable
            class="product-search flex-1 lg:w-72 lg:flex-none"
            type="search"
            :placeholder="locale === 'zh' ? '搜索商品' : 'Search products'"
          >
            <template #prefix><Search :size="18" /></template>
          </ElInput>
          <ElButton
            class="brand-icon-button lg:!hidden"
            :aria-label="t.categories"
            @click="mobileFilters = !mobileFilters"
            ><X v-if="mobileFilters" :size="19" /><SlidersHorizontal
              v-else
              :size="19"
          /></ElButton>
        </div>
      </div>

      <div class="mt-8 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-12">
        <aside :class="mobileFilters ? 'block' : 'hidden lg:block'">
          <div
            class="sticky top-28 space-y-1 bg-white p-3 lg:bg-transparent lg:p-0"
          >
            <ElButton
              text
              class="category-filter"
              :class="activeCategory === 'all' ? 'is-active' : ''"
              @click="chooseCategory('all')"
            >
              <span>{{ t.filterAll }}</span
              ><span>{{ products.length }}</span>
            </ElButton>
            <ElButton
              v-for="category in categories"
              :key="category.key"
              text
              class="category-filter"
              :class="activeCategory === category.key ? 'is-active' : ''"
              @click="chooseCategory(category.key)"
            >
              <span>{{ category[locale] }}</span
              ><span>{{
                products.filter((item) => item.category === category.key).length
              }}</span>
            </ElButton>
          </div>
        </aside>

        <div>
          <div class="mb-7 flex items-center justify-between">
            <p class="text-sm text-black/50">
              <strong class="text-ink">{{ filteredProducts.length }}</strong>
              {{ t.productCount }}
            </p>
            <p
              class="hidden text-xs uppercase tracking-[0.12em] text-black/35 sm:block"
            >
              {{
                locale === 'zh'
                  ? 'WOLFWALKER 户外装备系统'
                  : 'WOLFWALKER FIELD SYSTEMS'
              }}
            </p>
          </div>
          <div
            v-if="filteredProducts.length"
            class="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-y-14"
          >
            <ProductCard
              v-for="(product, index) in filteredProducts"
              :key="product.sku"
              v-reveal
              :product="product"
              :priority="index < 6"
            />
          </div>
          <div
            v-else
            class="grid min-h-72 place-items-center border border-dashed border-black/20 text-sm text-black/50"
          >
            {{ t.noProducts }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
