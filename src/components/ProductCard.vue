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
      <!-- right-3 而不是只给 left-3：分类名跟公共底部对齐后变长了（Portable Tables
           & Chairs 这类），窄屏上角标会顶到卡片右沿，留出和左边同样的 12px。 -->
      <span
        class="absolute left-3 right-3 top-3 w-fit bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-ink backdrop-blur"
        >{{ getCategory(props.product.category)[locale] }}</span
      >
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
          class="shrink-0"
          :aria-label="`${t.viewProduct}: ${productName.zh}`"
        >
          <img
            src="https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/product/jt.png"
            alt=""
            width="42"
            height="16"
            loading="lazy"
            class="h-4 w-[42px] max-w-none object-contain"
          />
        </RouterLink>
      </div>
    </div>
  </article>
</template>
