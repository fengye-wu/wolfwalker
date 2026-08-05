<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import { getCategory } from '../data/products'

defineProps({ product: { type: Object, required: true }, priority: { type: Boolean, default: false } })
const { locale, t } = useLocale()
</script>

<template>
  <article class="group min-w-0">
    <RouterLink :to="`/product/${product.category}/${product.id}`" class="relative block aspect-[4/3] overflow-hidden bg-[#e7e9e3]">
      <img :src="product.image" :alt="product.imageAlt[locale]" :loading="priority ? 'eager' : 'lazy'" class="size-full object-cover transition duration-700 group-hover:scale-105" />
      <span class="absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink backdrop-blur">{{ getCategory(product.category)[locale] }}</span>
      <span class="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center bg-signal text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight :size="18" /></span>
    </RouterLink>
    <div class="flex items-start justify-between gap-3 pt-4">
      <div class="min-w-0">
        <h3 class="text-base font-bold leading-6 text-ink sm:text-lg">{{ product.name[locale] }}</h3>
        <p class="mt-1 text-xs uppercase tracking-[0.12em] text-black/45">WOLFWALKER · {{ product.sku.toUpperCase() }}</p>
      </div>
      <RouterLink :to="`/product/${product.category}/${product.id}`" class="mt-0.5 shrink-0 text-black/40 transition hover:text-signal" :aria-label="`${t.viewProduct}: ${product.name[locale]}`"><ArrowUpRight :size="20" /></RouterLink>
    </div>
  </article>
</template>
