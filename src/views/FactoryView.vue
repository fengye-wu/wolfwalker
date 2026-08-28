<script setup>
import { ArrowRight, Boxes, Factory, Ruler, ShieldCheck } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import UiLinkButton from '../components/UiLinkButton.vue'

const { locale } = useLocale()

const stats = [
  { value: '11', zh: '年制造经验', en: 'Years of manufacturing' },
  { value: '18000㎡', zh: '厂房面积', en: 'Factory floor area' },
  { value: '260+', zh: '产线工人', en: 'Production staff' },
  { value: '30+', zh: '出口国家', en: 'Export markets' },
]

const steps = [
  { icon: Ruler, zh: '开版打样', en: 'Pattern & sampling', zhText: '结构工程师出版型，三天内完成首样并进入内部评审。', enText: 'Engineers cut the first pattern and deliver a reviewed sample within three days.' },
  { icon: Boxes, zh: '面料裁切', en: 'Cutting', zhText: '自动裁床按排料图下料，同批次色差与克重逐卷复核。', enText: 'Automated cutting follows the nesting plan; every roll is checked for shade and weight.' },
  { icon: Factory, zh: '车缝复合', en: 'Sewing & bonding', zhText: '帐篷与气垫分线生产，高频热合与车缝工位独立排布。', enText: 'Tents and air mattresses run on separate lines with dedicated welding and sewing stations.' },
  { icon: ShieldCheck, zh: '成品检验', en: 'Final inspection', zhText: '充气保压、淋雨与拉力测试全部通过后才允许入库。', enText: 'Pressure-hold, rain and tensile tests must all pass before goods enter the warehouse.' },
]
</script>

<template>
  <div>
    <section class="relative min-h-[560px] overflow-hidden text-white">
      <img
        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2200&q=90"
        alt="Wolfwalker production line"
        class="absolute inset-0 size-full object-cover"
      />
      <div class="absolute inset-0 bg-ink/70"></div>
      <div class="site-container relative flex min-h-[560px] flex-col justify-center py-20">
        <div class="animate-rise max-w-3xl">
          <p class="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a8c48d]">
            {{ locale === 'zh' ? '工厂介绍 / WOLFWALKER' : 'FACTORY / WOLFWALKER' }}
          </p>
          <h1 class="font-display text-5xl font-black uppercase leading-[0.94] sm:text-6xl xl:text-7xl">
            {{ locale === 'zh' ? '专业工厂，品质从优' : 'A factory built on precision' }}
          </h1>
          <p class="mt-7 max-w-xl text-lg leading-8 text-white/70">
            {{ locale === 'zh'
              ? '深耕帐篷与气垫行业十一年，从面料到成品全部在自有厂房完成，交期与品质由我们自己把控。'
              : 'Eleven years focused on tents and air mattresses. Everything from fabric to finished goods happens in our own plant, so we own both quality and lead time.' }}
          </p>
          <div class="mt-10 h-1 w-16 bg-signal"></div>
        </div>
      </div>
    </section>

    <section class="site-container py-16 lg:py-24">
      <div v-reveal class="grid gap-px bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in stats" :key="item.value" class="bg-white p-8">
          <strong class="font-display text-4xl font-black text-pine">{{ item.value }}</strong>
          <p class="mt-2 text-xs uppercase tracking-[0.14em] text-black/45">
            {{ locale === 'zh' ? item.zh : item.en }}
          </p>
        </div>
      </div>
    </section>

    <section class="bg-white py-20 lg:py-28">
      <div class="site-container">
        <div v-reveal class="mb-12 max-w-2xl">
          <p class="eyebrow">{{ locale === 'zh' ? '生产流程' : 'PRODUCTION FLOW' }}</p>
          <h2 class="section-title">{{ locale === 'zh' ? '四道工序，环环留痕' : 'Four stages, fully traceable' }}</h2>
        </div>
        <div class="grid gap-px bg-black/10 lg:grid-cols-2">
          <article
            v-for="(step, index) in steps"
            :key="step.zh"
            v-reveal
            class="bg-mist p-8 sm:p-10"
          >
            <div class="flex items-center gap-4">
              <component :is="step.icon" :size="24" class="shrink-0 text-signal" />
              <span class="text-xs font-bold tracking-[0.18em] text-black/35">0{{ index + 1 }}</span>
            </div>
            <h3 class="mt-6 font-display text-2xl font-black uppercase text-ink">
              {{ locale === 'zh' ? step.zh : step.en }}
            </h3>
            <p class="mt-4 max-w-lg leading-8 text-black/60">
              {{ locale === 'zh' ? step.zhText : step.enText }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="site-container py-20 lg:py-28">
      <div class="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div v-reveal class="grid grid-cols-[1.15fr_.85fr] gap-3">
          <img
            src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1000&q=85"
            alt="Sewing workshop"
            class="h-full min-h-[420px] w-full object-cover"
            loading="lazy"
          />
          <div class="grid gap-3">
            <img
              src="https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=700&q=85"
              alt="Material warehouse"
              class="h-full min-h-0 w-full object-cover"
              loading="lazy"
            />
            <div class="flex min-h-40 flex-col justify-end bg-pine p-6 text-white">
              <strong class="font-display text-4xl">100%</strong>
              <span class="mt-1 text-xs uppercase tracking-[0.14em]">
                {{ locale === 'zh' ? '出货前全检' : 'Pre-shipment checks' }}
              </span>
            </div>
          </div>
        </div>
        <div v-reveal class="flex items-center">
          <div>
            <p class="eyebrow">{{ locale === 'zh' ? '质量控制' : 'QUALITY CONTROL' }}</p>
            <h2 class="section-title">{{ locale === 'zh' ? '把问题留在产线内' : 'Problems stop at the line' }}</h2>
            <p class="mt-7 text-base leading-8 text-black/60">
              {{ locale === 'zh'
                ? '每条产线配独立质检位，气垫需通过 24 小时保压测试，帐篷面料按批次抽检防水等级与撕裂强度。出现异常即停线返修，不流入下一道工序。'
                : 'Every line has its own inspection station. Air mattresses hold pressure for 24 hours; tent fabrics are batch-tested for waterproof rating and tear strength. Anything out of spec stops the line instead of moving downstream.' }}
            </p>
            <UiLinkButton to="/custom" class="mt-10">
              {{ locale === 'zh' ? '查看定制专区' : 'Customisation' }} <ArrowRight :size="18" />
            </UiLinkButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
