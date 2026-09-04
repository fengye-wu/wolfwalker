<script setup>
import { useLocale } from '../composables/useLocale';
import { getCategory } from '../data/products';

const props = defineProps({
  product: { type: Object, required: true },
  priority: { type: Boolean, default: false }
});
const { locale, t } = useLocale();

// 商品名的主语言固定为中文，次语言固定为英文；站点切换只影响分类角标、图片 alt
// 和可访问标签。这套层级是产品目录的展示规则，不随 UI 语言翻转。
const productName = props.product.name;
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
      <h3 class="text-base font-bold leading-6 text-ink sm:text-lg">
        {{ productName.zh }}
      </h3>
      <div
        class="mt-1 flex items-center justify-between gap-2 text-sm font-bold leading-5 text-black/50"
      >
        <p class="min-w-0 truncate text-sm font-bold leading-5 text-black/50">
          {{ productName.en }}
        </p>
        <RouterLink
          :to="`/product/${props.product.category}/${props.product.id}`"
          class="group/arrow shrink-0"
          :aria-label="`${t.viewProduct}: ${productName.zh}`"
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
