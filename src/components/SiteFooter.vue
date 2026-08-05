<script setup>
import { ArrowRight, Instagram, Linkedin, Mail } from 'lucide-vue-next'
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
  <footer class="bg-ink text-white">
    <div class="site-container grid gap-12 py-14 lg:grid-cols-[1.35fr_.7fr_.7fr_1.2fr] lg:py-20">
      <div>
        <BrandMark light />
        <p class="mt-6 max-w-sm text-sm leading-7 text-white/55">{{ t.footerText }}</p>
        <div class="mt-7 flex gap-2">
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" class="grid size-10 place-items-center border border-white/20 transition hover:border-signal hover:bg-signal" aria-label="Instagram"><Instagram :size="18" /></a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" class="grid size-10 place-items-center border border-white/20 transition hover:border-signal hover:bg-signal" aria-label="LinkedIn"><Linkedin :size="18" /></a>
          <a href="mailto:sales@wolfwalker.com" class="grid size-10 place-items-center border border-white/20 transition hover:border-signal hover:bg-signal" aria-label="Email"><Mail :size="18" /></a>
        </div>
      </div>

      <div>
        <h2 class="text-xs font-bold uppercase tracking-[0.18em] text-white/40">{{ t.navigation }}</h2>
        <div class="mt-5 flex flex-col gap-3 text-sm">
          <RouterLink to="/" class="hover:text-signal">{{ t.home }}</RouterLink>
          <RouterLink to="/product" class="hover:text-signal">{{ t.products }}</RouterLink>
          <RouterLink to="/AboutUs" class="hover:text-signal">{{ t.brand }}</RouterLink>
          <RouterLink to="/contact" class="hover:text-signal">{{ t.contact }}</RouterLink>
        </div>
      </div>

      <div>
        <h2 class="text-xs font-bold uppercase tracking-[0.18em] text-white/40">{{ t.categories }}</h2>
        <div class="mt-5 flex flex-col gap-3 text-sm">
          <RouterLink v-for="category in categories" :key="category.key" :to="`/product?category=${category.key}`" class="hover:text-signal">
            {{ category[locale] }}
          </RouterLink>
        </div>
      </div>

      <div>
        <h2 class="text-xs font-bold uppercase tracking-[0.18em] text-white/40">{{ t.newsletter }}</h2>
        <p class="mt-5 text-sm leading-6 text-white/55">{{ t.newsletterCopy }}</p>
        <form class="mt-5 flex border-b border-white/30" @submit.prevent="subscribe">
          <input v-model="email" type="email" required :placeholder="t.email" class="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/35" />
          <button type="submit" class="grid size-11 place-items-center transition hover:text-signal" :aria-label="t.subscribe"><ArrowRight :size="19" /></button>
        </form>
        <p v-if="subscribed" class="mt-3 text-xs text-[#9ec88b]">{{ locale === 'zh' ? '订阅成功。' : 'You are on the list.' }}</p>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div class="site-container flex flex-col gap-3 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ new Date().getFullYear() }} WOLFWALKER. {{ t.rights }}</p>
        <div class="flex gap-5"><a href="#">{{ t.privacy }}</a><a href="#">{{ t.terms }}</a></div>
      </div>
    </div>
  </footer>
</template>
