<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

const route = useRoute()

// 桌面端头部初始是透明的、压在第一屏上，所以能压的页面不留顶部空白 ——
// 判据是路由的 meta.headerOverlay（见 router/index.js）。
// 手机端不参与：那边头部一直是 72px 白底固定条，照旧留 72px。
const mainPad = computed(() =>
  route.meta.headerOverlay ? 'pt-[72px] lg:pt-0' : 'pt-[72px]'
)
</script>

<template>
  <div class="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
    <SiteHeader />
    <main class="flex-1" :class="mainPad">
      <RouterView v-slot="{ Component }">
        <Transition name="route" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />
  </div>
</template>
