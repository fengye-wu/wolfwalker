<script setup>
import { ArrowRight, Package, Palette, PenTool, Stamp } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import UiLinkButton from '../components/UiLinkButton.vue'

const { locale, t } = useLocale()

const options = [
  { icon: Palette, zh: '颜色定制', en: 'Colour', zhText: '按潘通色号打样，面料与配件同步对色。', enText: 'Matched to Pantone references across fabric and hardware.' },
  { icon: Stamp, zh: 'Logo 工艺', en: 'Logo', zhText: '丝印、刺绣、热转印与织唛四种工艺可选。', enText: 'Screen print, embroidery, heat transfer or woven label.' },
  { icon: PenTool, zh: '结构调整', en: 'Structure', zhText: '尺寸、门窗位置与内部收纳可按需改版。', enText: 'Dimensions, door and window placement, internal storage.' },
  { icon: Package, zh: '包装方案', en: 'Packaging', zhText: '彩盒、收纳袋与吊牌全套设计与印制。', enText: 'Colour boxes, stuff sacks, hang tags — designed and printed.' },
]

const flow = [
  { zh: '需求沟通', en: 'Brief', zhText: '确认用途、目标市场与预算区间。', enText: 'Use case, target market and budget range.' },
  { zh: '方案报价', en: 'Quotation', zhText: '两个工作日内给出结构方案与阶梯报价。', enText: 'Structure proposal and tiered pricing within two working days.' },
  { zh: '打样确认', en: 'Sampling', zhText: '7–10 天出样，确认后封样留档。', enText: 'Samples in 7–10 days, sealed for reference once approved.' },
  { zh: '批量生产', en: 'Production', zhText: '排产后按节点反馈进度，出货前全检。', enText: 'Scheduled with milestone updates and a full pre-shipment check.' },
]
</script>

<template>
  <div>
    <section class="bg-ink py-20 text-white lg:py-28">
      <div class="site-container grid gap-10 lg:grid-cols-[1fr_.65fr] lg:items-end">
        <div class="animate-rise">
          <p class="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a8c48d]">
            {{ locale === 'zh' ? '定制专区 / WOLFWALKER' : 'CUSTOM / WOLFWALKER' }}
          </p>
          <h1 class="font-display text-5xl font-black uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
            {{ locale === 'zh' ? '你的品牌，我们的产线' : 'Your brand, our line' }}
          </h1>
        </div>
        <p class="animate-rise delay-1 max-w-xl text-base leading-8 text-white/65 lg:pb-1">
          {{ locale === 'zh'
            ? '从改一个颜色到重做一套结构，OEM 与 ODM 都能接。自有工厂意味着改版不用等外协排期。'
            : 'From a single colour change to a full structural rework — OEM and ODM both welcome. Owning the factory means revisions never wait on a subcontractor.' }}
        </p>
      </div>
    </section>

    <section class="site-container py-16 lg:py-24">
      <div v-reveal class="mb-12 max-w-2xl">
        <p class="eyebrow">{{ locale === 'zh' ? '可定制范围' : 'WHAT YOU CAN CHANGE' }}</p>
        <h2 class="section-title">{{ locale === 'zh' ? '四类常规定制项' : 'Four standard options' }}</h2>
      </div>
      <div class="grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="item in options" :key="item.zh" v-reveal class="bg-white p-8">
          <component :is="item.icon" :size="24" class="text-signal" />
          <h3 class="mt-6 font-display text-xl font-black uppercase text-ink">
            {{ locale === 'zh' ? item.zh : item.en }}
          </h3>
          <p class="mt-3 text-sm leading-7 text-black/55">
            {{ locale === 'zh' ? item.zhText : item.enText }}
          </p>
        </article>
      </div>
    </section>

    <section class="bg-white py-20 lg:py-28">
      <div class="site-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div v-reveal>
          <p class="eyebrow">{{ locale === 'zh' ? '合作条件' : 'TERMS' }}</p>
          <h2 class="section-title">{{ locale === 'zh' ? '起订量与周期' : 'MOQ & lead time' }}</h2>
          <div class="mt-8 space-y-6 border-t border-black/10 pt-7">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.14em] text-black/35">{{ t.quantity }}</p>
              <p class="mt-2 font-display text-3xl font-black text-pine">{{ t.moqValue }}</p>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.14em] text-black/35">{{ t.leadTime }}</p>
              <p class="mt-2 font-display text-3xl font-black text-pine">{{ t.leadValue }}</p>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.14em] text-black/35">{{ t.customization }}</p>
              <p class="mt-2 text-sm leading-7 text-ink">{{ t.customValue }}</p>
            </div>
          </div>
        </div>

        <div v-reveal class="grid gap-px bg-black/10 sm:grid-cols-2">
          <article v-for="(step, index) in flow" :key="step.zh" class="bg-mist p-8">
            <span class="text-xs font-bold tracking-[0.18em] text-signal">0{{ index + 1 }}</span>
            <h3 class="mt-6 font-display text-2xl font-black uppercase text-ink">
              {{ locale === 'zh' ? step.zh : step.en }}
            </h3>
            <p class="mt-4 leading-7 text-black/60">
              {{ locale === 'zh' ? step.zhText : step.enText }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="relative min-h-[420px] overflow-hidden text-white">
      <img
        src="https://images.unsplash.com/photo-1487730116645-74489c95b41b?auto=format&fit=crop&w=2200&q=90"
        alt="Camp at dusk"
        class="absolute inset-0 size-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-black/60"></div>
      <div v-reveal class="site-container relative flex min-h-[420px] flex-col items-start justify-center">
        <h2 class="max-w-3xl font-display text-3xl font-black uppercase leading-tight sm:text-4xl">
          {{ locale === 'zh' ? '把需求发给我们，报价随后就到' : 'Send us the brief, the quote follows' }}
        </h2>
        <p class="mt-5 max-w-xl leading-8 text-white/65">{{ t.contactLead }}</p>
        <UiLinkButton to="/contact" class="mt-8">
          {{ t.inquiry }} <ArrowRight :size="18" />
        </UiLinkButton>
      </div>
    </section>
  </div>
</template>
