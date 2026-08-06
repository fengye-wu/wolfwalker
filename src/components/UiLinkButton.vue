<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  to: { type: [String, Object], required: true },
  variant: { type: String, default: 'primary' },
})
</script>

<template>
  <RouterLink :to="to" custom v-slot="{ href, navigate }">
    <ElButton
      v-bind="$attrs"
      tag="a"
      :href="href"
      :class="['ui-link-button', `ui-link-button--${variant}`]"
      @click="navigate"
    >
      <slot />
    </ElButton>
  </RouterLink>
</template>
