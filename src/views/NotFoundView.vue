<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import UiLinkButton from '../components/UiLinkButton.vue'
const { t } = useLocale()
</script>

<template>
  <section class="site-container grid min-h-[65vh] place-items-center py-24 text-center">
    <div>
      <p class="font-display text-8xl font-black text-black/10">404</p>
      <h1 class="mt-4 text-3xl font-bold">{{ t.pageNotFoundTitle }}</h1>
      <p class="mt-3 text-sm text-black/50">{{ t.pageNotFoundBody }}</p>
      <UiLinkButton to="/" variant="dark" class="mt-8">
        <ArrowLeft :size="18" /> {{ t.backHome }}
      </UiLinkButton>
    </div>
  </section>
</template>
