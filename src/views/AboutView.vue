<script setup>
import { ArrowRight, Pause, Play, Quote } from 'lucide-vue-next'
import { ref } from 'vue'
import { useLocale } from '../composables/useLocale'
import UiLinkButton from '../components/UiLinkButton.vue'

const { locale, t } = useLocale()
const video = ref(null)
const playing = ref(false)

const toggleVideo = async () => {
  if (!video.value) return
  if (video.value.paused) await video.value.play()
  else video.value.pause()
}
</script>

<template>
  <div>
    <section class="grid min-h-[680px] bg-ink text-white lg:grid-cols-[.82fr_1.18fr]">
      <div class="site-container flex items-end py-16 lg:ml-auto lg:max-w-[620px] lg:items-center lg:px-12">
        <div class="animate-rise">
          <p class="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a8c48d]">{{ t.aboutEyebrow }}</p>
          <h1 class="font-display text-5xl font-black uppercase leading-[0.94] sm:text-6xl xl:text-7xl">{{ t.aboutTitle }}</h1>
          <p class="mt-7 max-w-lg text-lg leading-8 text-white/65">{{ t.aboutLead }}</p>
          <div class="mt-10 h-1 w-16 bg-signal"></div>
        </div>
      </div>
      <div class="relative min-h-[420px] overflow-hidden lg:min-h-[680px]">
        <img src="https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1800&q=90" alt="Wolfwalker outdoor journey" class="size-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"></div>
        <p class="absolute bottom-8 right-8 text-xs font-bold uppercase tracking-[0.18em] text-white/70">{{ locale === 'zh' ? '黄山 · 安徽 · 中国' : 'HUANGSHAN · ANHUI · CHINA' }}</p>
      </div>
    </section>

    <section class="site-container py-20 lg:py-28">
      <div v-reveal class="mb-10 flex items-end justify-between gap-8">
        <div><p class="eyebrow">{{ locale === 'zh' ? 'WOLFWALKER 品牌影像' : 'WOLFWALKER FILM' }}</p><h2 class="section-title">{{ locale === 'zh' ? '走进我们的户外世界' : 'Step into our world' }}</h2></div>
        <p class="hidden max-w-sm text-right text-sm leading-6 text-black/50 md:block">{{ locale === 'zh' ? '山野是我们的灵感来源，也是每件装备最终的检验场。' : 'The mountains are both our inspiration and the final proving ground for every piece of gear.' }}</p>
      </div>
      <div v-reveal class="group relative aspect-video overflow-hidden bg-black">
        <video ref="video" class="size-full object-cover" poster="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=90" preload="metadata" playsinline @play="playing = true" @pause="playing = false" @ended="playing = false">
          <source src="https://videos.pexels.com/video-files/3130284/3130284-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div class="pointer-events-none absolute inset-0 bg-black/20 transition group-hover:bg-black/10"></div>
        <ElButton class="video-control absolute left-1/2 top-1/2 !size-20 -translate-x-1/2 -translate-y-1/2 shadow-lift sm:!size-24" :aria-label="playing ? t.pauseFilm : t.playFilm" @click="toggleVideo">
          <Pause v-if="playing" :size="28" fill="currentColor" /><Play v-else :size="30" fill="currentColor" />
        </ElButton>
        <p class="absolute bottom-5 left-5 text-xs font-bold uppercase tracking-[0.16em] text-white sm:bottom-8 sm:left-8">{{ playing ? t.pauseFilm : t.playFilm }}</p>
      </div>
    </section>

    <section class="bg-white py-20 lg:py-28">
      <div class="site-container grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div v-reveal class="grid grid-cols-[1.15fr_.85fr] gap-3">
          <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1000&q=85" alt="Tent field testing" class="h-full min-h-[480px] w-full object-cover" loading="lazy" />
          <div class="grid gap-3">
            <img src="https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=700&q=85" alt="Outdoor materials" class="h-full min-h-0 w-full object-cover" loading="lazy" />
            <div class="flex min-h-44 flex-col justify-end bg-signal p-6 text-white"><strong class="font-display text-4xl">2012</strong><span class="mt-1 text-xs uppercase tracking-[0.14em]">{{ locale === 'zh' ? '品牌启程' : 'Our journey began' }}</span></div>
          </div>
        </div>
        <div v-reveal class="flex items-center">
          <div><p class="eyebrow">{{ locale === 'zh' ? '设计 / 测试 / 制造' : 'DESIGN / TEST / MAKE' }}</p><h2 class="section-title">{{ t.craftTitle }}</h2><p class="mt-7 text-base leading-8 text-black/60">{{ t.craftText }}</p>
            <div class="mt-10 grid grid-cols-3 gap-4 border-t border-black/10 pt-7">
              <div><strong class="font-display text-3xl text-pine">8</strong><p class="mt-1 text-xs text-black/45">{{ locale === 'zh' ? '产品系列' : 'Product lines' }}</p></div>
              <div><strong class="font-display text-3xl text-pine">30+</strong><p class="mt-1 text-xs text-black/45">{{ locale === 'zh' ? '全球市场' : 'Global markets' }}</p></div>
              <div><strong class="font-display text-3xl text-pine">100%</strong><p class="mt-1 text-xs text-black/45">{{ locale === 'zh' ? '出货检验' : 'Shipment checks' }}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="site-container py-20 lg:py-28">
      <div class="grid gap-px bg-black/10 lg:grid-cols-2">
        <article v-reveal class="bg-mist p-8 sm:p-12 lg:p-16"><span class="text-xs font-bold tracking-[0.18em] text-signal">01</span><h2 class="mt-8 font-display text-3xl font-black uppercase">{{ t.cultureTitle }}</h2><p class="mt-6 max-w-lg leading-8 text-black/60">{{ t.cultureText }}</p></article>
        <article v-reveal class="bg-pine p-8 text-white sm:p-12 lg:p-16"><span class="text-xs font-bold tracking-[0.18em] text-[#a8c48d]">02</span><h2 class="mt-8 font-display text-3xl font-black uppercase">{{ t.visionTitle }}</h2><p class="mt-6 max-w-lg leading-8 text-white/65">{{ t.visionText }}</p></article>
      </div>
      <div v-reveal class="mt-px grid gap-px bg-black/10 sm:grid-cols-3">
        <div v-for="(value, index) in t.values" :key="value" class="flex min-h-36 items-end justify-between bg-white p-7"><p class="font-bold">{{ value }}</p><span class="text-xs text-black/30">0{{ index + 1 }}</span></div>
      </div>
    </section>

    <section class="relative min-h-[440px] overflow-hidden text-white">
      <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=2200&q=90" alt="Outdoor camp at dusk" class="absolute inset-0 size-full object-cover" loading="lazy" />
      <div class="absolute inset-0 bg-black/60"></div>
      <div v-reveal class="site-container relative flex min-h-[440px] flex-col items-start justify-center">
        <Quote :size="32" class="text-signal" />
        <blockquote class="mt-5 max-w-3xl font-display text-3xl font-black uppercase leading-tight sm:text-4xl">{{ locale === 'zh' ? '好的户外装备，不该打扰风景，只需默默让旅程更舒适。' : 'Great outdoor gear should never distract from the view. It should simply make the journey feel better.' }}</blockquote>
        <UiLinkButton to="/contact" class="mt-8">{{ t.contact }} <ArrowRight :size="18" /></UiLinkButton>
      </div>
    </section>
  </div>
</template>
