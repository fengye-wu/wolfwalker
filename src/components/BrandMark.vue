<script setup>
defineProps({ light: { type: Boolean, default: false } })
</script>

<template>
  <RouterLink to="/" class="inline-flex items-center gap-3" aria-label="Wolfwalker home">
    <span class="grid size-9 place-items-center bg-signal font-display text-lg font-black text-white">W</span>
    <span :class="light ? 'text-white' : 'text-ink'" class="font-display text-[15px] font-black tracking-[0.02em] sm:text-xl sm:tracking-[0.04em]">WOLFWALKER</span>
  </RouterLink>
</template>
