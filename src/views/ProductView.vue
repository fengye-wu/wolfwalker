<script setup>
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import UiLinkButton from '../components/UiLinkButton.vue'
import { categories, products } from '../data/products'
import { useLocale } from '../composables/useLocale'

const { locale, t } = useLocale()
const route = useRoute()
const router = useRouter()
const activeCategory = ref(route.query.category || 'all')
const search = ref('')
const mobileFilters = ref(false)
const productList = ref(null)

watch(() => route.query.category, (value) => {
  activeCategory.value = categories.some((item) => item.key === value) ? value : 'all'
}, { immediate: true })

const filteredProducts = computed(() => products.filter((product) => {
  const categoryMatch = activeCategory.value === 'all' || product.category === activeCategory.value
  const term = search.value.trim().toLowerCase()
  const searchMatch = !term || product.name.en.toLowerCase().includes(term) || product.name.zh.includes(term) || product.id.includes(term) || product.sku.toLowerCase().includes(term)
  return categoryMatch && searchMatch
}))

const chooseCategory = async (key) => {
  activeCategory.value = key
  mobileFilters.value = false
  await router.replace({ query: key === 'all' ? {} : { category: key } })
  await nextTick()
  productList.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div>
    <section class="relative min-h-[430px] overflow-hidden bg-ink text-white lg:min-h-[520px]">
      <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=90" alt="Outdoor equipment collection" class="absolute inset-0 size-full object-cover opacity-70" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10"></div>
      <div class="site-container relative flex min-h-[430px] items-end pb-14 pt-24 lg:min-h-[520px] lg:pb-20">
        <div class="max-w-3xl animate-rise">
          <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/65">{{ locale === 'zh' ? 'WOLFWALKER / 2026 产品系列' : 'WOLFWALKER / 2026 COLLECTION' }}</p>
          <h1 class="font-display text-5xl font-black uppercase leading-[0.95] sm:text-6xl lg:text-7xl">{{ t.catalogTitle }}</h1>
          <p class="mt-5 max-w-xl text-base leading-7 text-white/70">{{ t.catalogCopy }}</p>
        </div>
      </div>
    </section>

    <section class="site-container py-14 lg:py-20">
      <div class="flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="eyebrow">{{ t.categories }}</p>
          <h2 class="section-title">{{ t.allProducts }}</h2>
        </div>
        <div class="flex items-center gap-3">
          <ElInput v-model="search" clearable class="product-search flex-1 lg:w-72 lg:flex-none" type="search" :placeholder="locale === 'zh' ? '搜索商品' : 'Search products'">
            <template #prefix><Search :size="18" /></template>
          </ElInput>
          <ElButton class="brand-icon-button lg:!hidden" :aria-label="t.categories" @click="mobileFilters = !mobileFilters"><X v-if="mobileFilters" :size="19" /><SlidersHorizontal v-else :size="19" /></ElButton>
        </div>
      </div>

      <div class="mt-8 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-12">
        <aside :class="mobileFilters ? 'block' : 'hidden lg:block'">
          <div class="sticky top-28 space-y-1 bg-white p-3 lg:bg-transparent lg:p-0">
            <ElButton text class="category-filter" :class="activeCategory === 'all' ? 'is-active' : ''" @click="chooseCategory('all')">
              <span>{{ t.filterAll }}</span><span>{{ products.length }}</span>
            </ElButton>
            <ElButton v-for="category in categories" :key="category.key" text class="category-filter" :class="activeCategory === category.key ? 'is-active' : ''" @click="chooseCategory(category.key)">
              <span>{{ category[locale] }}</span><span>{{ products.filter((item) => item.category === category.key).length }}</span>
            </ElButton>
          </div>
        </aside>

        <div id="product-list" ref="productList" class="scroll-mt-24 lg:scroll-mt-28">
          <div class="mb-7 flex items-center justify-between">
            <p class="text-sm text-black/50"><strong class="text-ink">{{ filteredProducts.length }}</strong> {{ t.productCount }}</p>
            <p class="hidden text-xs uppercase tracking-[0.12em] text-black/35 sm:block">{{ locale === 'zh' ? 'WOLFWALKER 户外装备系统' : 'WOLFWALKER FIELD SYSTEMS' }}</p>
          </div>
          <div v-if="filteredProducts.length" class="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-y-14">
            <ProductCard v-for="(product, index) in filteredProducts" :key="product.sku" v-reveal :product="product" :priority="index < 6" />
          </div>
          <div v-else class="grid min-h-72 place-items-center border border-dashed border-black/20 text-sm text-black/50">{{ t.noProducts }}</div>
        </div>
      </div>
    </section>

    <section class="bg-pine py-14 text-white">
      <div class="site-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div><p class="text-xs font-bold uppercase tracking-[0.18em] text-white/50">{{ locale === 'zh' ? '品牌定制' : 'OEM / ODM' }}</p><h2 class="mt-2 font-display text-3xl font-black uppercase">{{ locale === 'zh' ? '寻找专属定制方案？' : 'Need a custom solution?' }}</h2></div>
        <UiLinkButton to="/contact" class="self-start sm:self-auto">{{ t.inquiry }} <ArrowRight :size="18" /></UiLinkButton>
      </div>
    </section>
  </div>
</template>
