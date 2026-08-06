<script setup>
import { ArrowRight, Check, Instagram, Linkedin, Mail } from 'lucide-vue-next'
import { ref } from 'vue'
import BrandMark from './BrandMark.vue'
import { categories } from '../data/products'
import { useLocale } from '../composables/useLocale'

const { locale, t } = useLocale()
const email = ref('')
const subscribed = ref(false)
const subscribe = () => {
  if (!email.value) return
  subscribed.value = true
  email.value = ''
}
</script>

<template>
  <footer id="site-footer" class="border-t-4 border-signal bg-ink text-white">
    <div class="site-container">
      <div class="grid gap-10 border-b border-white/10 py-11 sm:py-14 lg:grid-cols-[1fr_.9fr] lg:items-end lg:gap-20 lg:py-16">
        <div>
          <BrandMark light />
          <p class="mt-5 max-w-md text-sm leading-7 text-white/60">{{ t.footerText }}</p>
          <div class="mt-6 flex gap-2">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" class="grid size-11 place-items-center border border-white/15 text-white/75 transition hover:border-signal hover:bg-signal hover:text-white focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2 focus:ring-offset-ink" aria-label="Instagram"><Instagram :size="18" /></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" class="grid size-11 place-items-center border border-white/15 text-white/75 transition hover:border-signal hover:bg-signal hover:text-white focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2 focus:ring-offset-ink" aria-label="LinkedIn"><Linkedin :size="18" /></a>
            <a href="mailto:sales@wolfwalker.com" class="grid size-11 place-items-center border border-white/15 text-white/75 transition hover:border-signal hover:bg-signal hover:text-white focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2 focus:ring-offset-ink" aria-label="Email"><Mail :size="18" /></a>
          </div>
        </div>

        <div class="lg:max-w-xl lg:justify-self-end">
          <h2 class="text-xs font-bold uppercase tracking-[0.18em] text-[#9eb2a5]">{{ t.newsletter }}</h2>
          <p class="mt-3 text-sm leading-6 text-white/60">{{ t.newsletterCopy }}</p>
          <form class="newsletter-form mt-5 flex min-h-12" @submit.prevent="subscribe">
            <ElInput v-model="email" type="email" required :placeholder="t.email" :aria-label="t.email" />
            <ElButton type="primary" native-type="submit" class="newsletter-submit" :aria-label="t.subscribe"><ArrowRight :size="19" /></ElButton>
          </form>
          <p v-if="subscribed" class="mt-3 flex items-center gap-2 text-xs text-[#b5d3a6]" aria-live="polite"><Check :size="15" />{{ locale === 'zh' ? '订阅成功。' : 'You are on the list.' }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-x-7 py-9 sm:gap-x-12 lg:grid-cols-[.6fr_1.4fr] lg:gap-x-20 lg:py-12">
        <nav aria-label="Footer navigation">
          <h2 class="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">{{ t.navigation }}</h2>
          <div class="mt-4 flex flex-col text-sm">
            <RouterLink to="/" class="flex min-h-10 items-center border-b border-white/[0.07] transition hover:text-signal">{{ t.home }}</RouterLink>
            <RouterLink to="/product" class="flex min-h-10 items-center border-b border-white/[0.07] transition hover:text-signal">{{ t.products }}</RouterLink>
            <RouterLink to="/AboutUs" class="flex min-h-10 items-center border-b border-white/[0.07] transition hover:text-signal">{{ t.brand }}</RouterLink>
            <RouterLink to="/contact" class="flex min-h-10 items-center transition hover:text-signal">{{ t.contact }}</RouterLink>
          </div>
        </nav>

        <nav aria-label="Product categories">
          <h2 class="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">{{ t.categories }}</h2>
          <div class="mt-4 flex flex-col text-sm lg:grid lg:grid-cols-2 lg:gap-x-12">
            <RouterLink v-for="category in categories" :key="category.key" :to="`/product?category=${category.key}`" class="flex min-h-10 items-center border-b border-white/[0.07] transition last:border-b-0 hover:text-signal">
              {{ category[locale] }}
            </RouterLink>
          </div>
        </nav>
      </div>
    </div>

    <div class="border-t border-white/10 bg-black/10">
      <div class="site-container flex flex-col gap-4 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ new Date().getFullYear() }} WOLFWALKER. {{ t.rights }}</p>
        <div class="flex gap-6"><a href="#" class="transition hover:text-white">{{ t.privacy }}</a><a href="#" class="transition hover:text-white">{{ t.terms }}</a></div>
      </div>
    </div>
  </footer>
</template>
