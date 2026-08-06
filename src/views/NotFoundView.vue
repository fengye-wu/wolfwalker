<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import UiLinkButton from '../components/UiLinkButton.vue'
const { locale } = useLocale()
</script>

<template>
  <section class="site-container grid min-h-[65vh] place-items-center py-24 text-center">
    <div><p class="font-display text-8xl font-black text-black/10">404</p><h1 class="mt-4 text-3xl font-bold">{{ locale === 'zh' ? '页面未找到' : 'Page not found' }}</h1><p class="mt-3 text-sm text-black/50">{{ locale === 'zh' ? '你访问的页面可能已移动。' : 'The page you requested may have moved.' }}</p><UiLinkButton to="/" variant="dark" class="mt-8"><ArrowLeft :size="18" /> {{ locale === 'zh' ? '返回首页' : 'Back home' }}</UiLinkButton></div>
  </section>
</template>
