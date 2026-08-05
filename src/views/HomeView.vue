<script setup>
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, MoveRight } from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { categories, products } from '../data/products'
import { useLocale } from '../composables/useLocale'

const { locale, t } = useLocale()
const activeSlide = ref(0)
let timer

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=2200&q=90',
    eyebrow: { en: 'Shelter / Camp / Roam', zh: '居所 / 营地 / 远行' },
    title: { en: 'Go where comfort follows', zh: '舒适随行，自在远方' },
    copy: { en: 'Field-tested shelter and camp systems for nights beyond the road.', zh: '历经实地验证的庇护与营地系统，陪你驶向公路之外。' },
  },
  {
    image: 'https://images.unsplash.com/photo-1517825738774-7de9363ef735?auto=format&fit=crop&w=2200&q=90',
    eyebrow: { en: 'Designed for slow moments', zh: '为松弛时刻而设计' },
    title: { en: 'Make outside feel like home', zh: '把户外，过成生活' },
    copy: { en: 'Thoughtful furniture and sleep gear built for lingering longer.', zh: '从睡眠到休憩，用贴心装备延长每一段户外时光。' },
  },
  {
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=2200&q=90',
    eyebrow: { en: 'WOLFWALKER / Since 2012', zh: 'WOLFWALKER / 始于 2012' },
    title: { en: 'Engineered to wander', zh: '为探索而造' },
    copy: { en: 'Practical outdoor design, durable materials and trusted manufacturing.', zh: '实用设计、耐用材料与值得信赖的专业制造。' },
  },
]

const featured = products.filter((product) => product.featured).slice(0, 8)
const spotlights = [products[0], products.find((item) => item.category === 'sofa')]
const current = computed(() => slides[activeSlide.value])
const goTo = (index) => { activeSlide.value = (index + slides.length) % slides.length }
const startTimer = () => { timer = window.setInterval(() => goTo(activeSlide.value + 1), 6500) }

onMounted(startTimer)
onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <div>
    <section class="relative min-h-[calc(100svh-72px)] overflow-hidden bg-ink text-white lg:min-h-[calc(100svh-80px)]">
      <TransitionGroup name="hero-fade">
        <img v-for="(slide, index) in slides" v-show="activeSlide === index" :key="slide.image" :src="slide.image" :alt="slide.title[locale]" class="absolute inset-0 size-full object-cover" :class="activeSlide === index ? 'animate-drift' : ''" />
      </TransitionGroup>
      <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"></div>
      <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent"></div>

      <div class="site-container relative flex min-h-[calc(100svh-72px)] items-end pb-24 pt-28 lg:min-h-[calc(100svh-80px)] lg:items-center lg:pb-24 lg:pt-24">
        <div :key="activeSlide" class="max-w-3xl animate-rise">
          <p class="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/70">{{ current.eyebrow[locale] }}</p>
          <h1 class="font-display text-4xl font-black uppercase leading-[0.92] text-white sm:text-6xl lg:text-7xl xl:text-[7rem]">{{ current.title[locale] }}</h1>
          <p class="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">{{ current.copy[locale] }}</p>
          <RouterLink to="/product" class="btn-primary mt-8">{{ t.explore }} <ArrowRight :size="18" /></RouterLink>
        </div>
      </div>

      <div class="site-container absolute inset-x-0 bottom-5 flex items-end justify-between">
        <div class="flex gap-2">
          <button v-for="(_, index) in slides" :key="index" type="button" class="h-1 transition-all" :class="activeSlide === index ? 'w-12 bg-signal' : 'w-7 bg-white/40 hover:bg-white'" :aria-label="`Slide ${index + 1}`" @click="goTo(index)"></button>
        </div>
        <div class="hidden gap-2 sm:flex">
          <button class="grid size-11 place-items-center border border-white/35 transition hover:bg-white hover:text-ink" type="button" aria-label="Previous slide" @click="goTo(activeSlide - 1)"><ChevronLeft :size="20" /></button>
          <button class="grid size-11 place-items-center border border-white/35 transition hover:bg-white hover:text-ink" type="button" aria-label="Next slide" @click="goTo(activeSlide + 1)"><ChevronRight :size="20" /></button>
        </div>
      </div>
    </section>

    <section class="border-b border-black/10 bg-white">
      <div class="site-container grid grid-cols-2 md:grid-cols-5">
        <RouterLink v-for="(category, index) in categories" :key="category.key" :to="`/product?category=${category.key}`" class="group flex min-h-28 items-center justify-between border-black/10 px-4 transition hover:bg-mist md:border-r md:px-5" :class="index < 4 ? 'border-b md:border-b-0' : ''">
          <div><span class="text-[10px] text-black/30">0{{ index + 1 }}</span><p class="mt-2 text-sm font-bold">{{ category[locale] }}</p></div>
          <MoveRight class="text-black/30 transition group-hover:translate-x-1 group-hover:text-signal" :size="18" />
        </RouterLink>
      </div>
    </section>

    <section class="site-container py-20 lg:py-28">
      <div v-reveal class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p class="eyebrow">{{ locale === 'zh' ? 'WOLFWALKER 精选' : 'WOLFWALKER SELECTS' }}</p><h2 class="section-title">{{ t.featured }}</h2><p class="mt-4 max-w-xl text-sm leading-7 text-black/55 sm:text-base">{{ t.featuredCopy }}</p></div>
        <RouterLink to="/product" class="btn-outline self-start sm:self-auto">{{ t.viewAll }} <ArrowRight :size="18" /></RouterLink>
      </div>

      <div class="mt-12 grid gap-5 lg:grid-cols-2">
        <article v-for="(product, index) in spotlights" :key="product.sku" v-reveal class="group relative min-h-[480px] overflow-hidden bg-ink lg:min-h-[620px]">
          <img :src="product.image" :alt="product.imageAlt[locale]" class="absolute inset-0 size-full object-cover transition duration-1000 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"></div>
          <div class="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-white/60">0{{ index + 1 }} · {{ categories.find((item) => item.key === product.category)[locale] }}</p>
            <h3 class="mt-3 max-w-md font-display text-3xl font-black uppercase leading-tight sm:text-4xl">{{ product.name[locale] }}</h3>
            <RouterLink :to="`/product/${product.category}/${product.id}`" class="mt-6 inline-flex items-center gap-2 text-sm font-bold">{{ t.viewProduct }} <ArrowRight :size="18" class="transition group-hover:translate-x-1" /></RouterLink>
          </div>
        </article>
      </div>

      <div class="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
        <ProductCard v-for="product in featured" :key="product.sku" v-reveal :product="product" />
      </div>
    </section>

    <section class="bg-pine text-white">
      <div class="grid lg:grid-cols-2">
        <div class="min-h-[420px] overflow-hidden lg:min-h-[720px]">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=90" alt="Huangshan mountain landscape" class="size-full object-cover transition duration-1000 hover:scale-105" loading="lazy" />
        </div>
        <div v-reveal class="flex items-center px-5 py-16 sm:px-10 lg:px-16 lg:py-24 xl:px-24">
          <div class="max-w-xl">
            <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#acc694]">{{ t.since }}</p>
            <h2 class="font-display text-4xl font-black uppercase leading-[0.98] sm:text-5xl xl:text-6xl">{{ t.global }}</h2>
            <p class="mt-7 text-base leading-8 text-white/70">{{ t.brandIntro }}</p>
            <div class="mt-10 flex items-center gap-6 border-t border-white/20 pt-7">
              <div><strong class="block font-display text-3xl">12+</strong><span class="text-xs text-white/50">{{ locale === 'zh' ? '年制造经验' : 'Years of making' }}</span></div>
              <div><strong class="block font-display text-3xl">30+</strong><span class="text-xs text-white/50">{{ locale === 'zh' ? '出口市场' : 'Export markets' }}</span></div>
            </div>
            <RouterLink to="/AboutUs" class="mt-10 inline-flex items-center gap-3 border-b border-white/45 pb-2 text-sm font-bold transition hover:border-signal hover:text-signal">{{ t.learnMore }} <ArrowRight :size="18" /></RouterLink>
          </div>
        </div>
      </div>
    </section>

    <RouterLink to="/contact" class="group block bg-signal text-white">
      <div class="site-container flex min-h-44 items-center justify-between gap-8 py-10">
        <div><p class="text-xs font-bold uppercase tracking-[0.18em] text-white/65">{{ locale === 'zh' ? '批发 / 品牌定制' : 'B2B / OEM / ODM' }}</p><h2 class="mt-3 font-display text-3xl font-black uppercase sm:text-4xl">{{ t.inquiry }}</h2></div>
        <ArrowDown :size="34" class="-rotate-90 transition duration-300 group-hover:translate-x-2" />
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.hero-fade-enter-active, .hero-fade-leave-active { transition: opacity 800ms ease; }
.hero-fade-enter-from, .hero-fade-leave-to { opacity: 0; }
</style>
