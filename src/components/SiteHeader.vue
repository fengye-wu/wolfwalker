<script setup>
import { computed, ref, watch } from 'vue'
import { Languages, Menu, X } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import BrandMark from './BrandMark.vue'
import { useLocale } from '../composables/useLocale'

const { t, toggleLocale } = useLocale()
const route = useRoute()
const open = ref(false)
const links = computed(() => [
  { to: '/', label: t.value.home },
  { to: '/product', label: t.value.products },
  { to: '/AboutUs', label: t.value.brand },
  { to: '/contact', label: t.value.contact },
])

watch(() => route.fullPath, () => { open.value = false })
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-black/10 bg-white/95 backdrop-blur-lg lg:h-20">
    <div class="site-container flex h-full min-w-0 items-center justify-between gap-3">
      <BrandMark />

      <nav class="hidden h-full items-center gap-8 lg:flex" aria-label="Main navigation">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="relative flex h-full items-center text-sm font-bold text-ink/70 transition hover:text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-1 after:origin-left after:scale-x-0 after:bg-signal after:transition-transform"
          active-class="!text-ink after:scale-x-100"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="flex shrink-0 items-center gap-2">
        <ElButton class="brand-control" @click="toggleLocale">
          <Languages class="hidden sm:block" :size="17" aria-hidden="true" />
          {{ t.language }}
        </ElButton>
        <ElButton class="brand-icon-button lg:!hidden" :aria-label="t.menu" :aria-expanded="open" @click="open = !open">
          <Menu :size="21" />
        </ElButton>
      </div>
    </div>

    <ElDrawer v-model="open" append-to-body direction="rtl" size="min(88vw, 380px)" :show-close="false" :with-header="false" class="mobile-nav-drawer lg:hidden">
      <div class="relative h-full p-5">
        <div class="mb-3 flex justify-end">
          <ElButton class="brand-icon-button" :aria-label="t.close" @click="open = false"><X :size="21" /></ElButton>
        </div>
        <nav class="flex flex-col" aria-label="Mobile navigation">
          <RouterLink
            v-for="(link, index) in links"
            :key="link.to"
            :to="link.to"
            class="flex items-center justify-between border-b border-black/10 py-5 font-display text-2xl font-black uppercase text-ink"
          >
            <span>{{ link.label }}</span><span class="text-xs font-sans font-medium text-black/35">0{{ index + 1 }}</span>
          </RouterLink>
        </nav>
        <div class="absolute bottom-8 left-5 right-5 bg-mist p-5 text-sm leading-6 text-ink/65">{{ t.footerText }}</div>
      </div>
    </ElDrawer>
  </header>
</template>
