<script setup>
import { useLocale } from '../composables/useLocale';

const props = defineProps({
  product: { type: Object, required: true },
  priority: { type: Boolean, default: false }
});
const { locale, t } = useLocale();
</script>

<template>
  <article class="group min-w-0">
    <RouterLink
      :to="`/product/${props.product.category}/${props.product.id}`"
      class="relative block aspect-[4/3] overflow-hidden bg-[#e7e9e3]"
    >
      <img
        :src="props.product.image"
        :alt="props.product.imageAlt[locale]"
        :loading="priority ? 'eager' : 'lazy'"
        class="size-full object-cover transition duration-700 group-hover:scale-105"
      />
      
    </RouterLink>
    <div class="pt-4">
      <div class="flex items-center justify-between gap-2">
        <h3 class="min-w-0 truncate text-base font-bold leading-6 sm:text-lg">
          {{ props.product.name[locale] }}
        </h3>
        <RouterLink
          :to="`/product/${props.product.category}/${props.product.id}`"
          class="group/arrow shrink-0"
          :aria-label="`${t.viewProduct}: ${props.product.name[locale]}`"
        >
          <img
            src="https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/product/jt.jpg"
            alt=""
            width="42"
            height="16"
            loading="lazy"
            class="h-4 w-[42px] max-w-none object-contain transition-transform duration-300 ease-out group-hover/arrow:translate-x-1"
          />
        </RouterLink>
      </div>
    </div>
  </article>
</template>
