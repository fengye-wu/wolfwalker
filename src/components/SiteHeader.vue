<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
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
watch(open, (value) => document.body.classList.toggle('menu-open', value))
onBeforeUnmount(() => document.body.classList.remove('menu-open'))
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
        <button class="inline-flex h-10 min-w-10 items-center justify-center gap-2 border border-black/15 px-2 text-xs font-bold transition hover:border-pine hover:text-pine sm:px-3" type="button" @click="toggleLocale">
          <Languages class="hidden sm:block" :size="17" aria-hidden="true" />
          {{ t.language }}
        </button>
        <button class="icon-button lg:hidden" type="button" :aria-label="open ? t.close : t.menu" :aria-expanded="open" @click="open = !open">
          <X v-if="open" :size="21" />
          <Menu v-else :size="21" />
        </button>
      </div>
    </div>

    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-3" leave-active-class="transition duration-200" leave-to-class="opacity-0 -translate-y-3">
      <div v-if="open" class="fixed inset-x-0 top-[72px] h-[calc(100vh-72px)] border-t border-black/10 bg-white p-5 lg:hidden">
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
    </Transition>
  </header>
</template>
