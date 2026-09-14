<script setup>
import { ArrowRight, Building2, Clock3, Mail, MapPin, Phone } from 'lucide-vue-next'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'
import {
  contactChannels,
  contactCopy,
  contactFields,
  contactMap,
  fieldClass,
  formEndpoint,
  labelClass,
  mailSubject,
} from '../data/contact'

const { locale } = useLocale()
const route = useRoute()
const copy = computed(() => contactCopy[locale.value] ?? contactCopy.zh)

// 渠道行的 icon 在数据里是组件名，这里映射成真正的组件
const channelIcons = { MapPin, Mail, Phone, Clock3 }

// 询盘预填：从详情页「获取报价」带 product / quantity 过来
const inquiryMessage = (language) => (route.query.product
  ? contactCopy[language].inquiry(route.query.product, route.query.quantity || 50)
  : '')

const form = reactive(Object.fromEntries(
  contactFields.map((field) => [field.name, field.name === 'message' ? inquiryMessage(locale.value) : '']),
))

// 必填字段由 contactFields 推出来，加减字段不用再同步改这里
const requiredFields = contactFields.filter((field) => field.required).map((field) => field.name)
// 只存错误类型的 key，不存译文 —— 切语言时已显示的提示会跟着翻，不用重跑校验
const errors = reactive(Object.fromEntries(requiredFields.map((name) => [name, ''])))
const messageFor = (field) => (errors[field] === 'email'
  ? copy.value.invalid.email
  : errors[field] && copy.value.invalid.required[field])

const validate = () => {
  for (const name of requiredFields) errors[name] = form[name].trim() ? '' : 'required'
  const email = form.email.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'email'
  return requiredFields.every((name) => !errors[name])
}
// 已经报错的字段边打边校验，让提示随输入消失；没报错的不打扰
const revalidate = (field) => {
  if (errors[field]) validate()
}

// idle / sending / sent / error
const formRef = ref()
const status = ref('idle')
const subject = computed(() => (route.query.product
  ? mailSubject.withProduct(route.query.product)
  : mailSubject.fallback))

const submit = async () => {
  if (status.value === 'sending' || !validate()) return
  status.value = 'sending'
  try {
    const response = await fetch(formEndpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(formRef.value),
    })
    if (!response.ok) throw new Error(`Formspree responded ${response.status}`)
    status.value = 'sent'
    for (const field of contactFields) form[field.name] = ''
  } catch {
    status.value = 'error'
  }
}

watch(locale, (value, previous) => {
  if (route.query.product && form.message === inquiryMessage(previous)) form.message = inquiryMessage(value)
})
</script>

<template>
  <div>
    <section class="bg-pine py-20 text-white lg:py-28">
      <div class="site-container grid gap-10 lg:grid-cols-[1fr_.65fr] lg:items-end">
        <div class="animate-rise">
          <p class="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#b3ca9d]">{{ copy.eyebrow }}</p>
          <h1 class="font-display text-5xl font-black uppercase leading-[0.95] sm:text-6xl lg:text-7xl">{{ copy.title }}</h1>
        </div>
        <p class="animate-rise delay-1 max-w-xl text-base leading-8 text-white/65 lg:pb-1">{{ copy.lead }}</p>
      </div>
    </section>

    <section class="site-container grid gap-12 py-16 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:py-24">
      <div v-reveal>
        <p class="eyebrow">{{ copy.hqEyebrow }}</p>
        <h2 class="section-title">{{ copy.office }}</h2>
        <div class="mt-8 space-y-7">
          <div v-for="channel in contactChannels" :key="channel.key" class="flex gap-4">
            <component :is="channelIcons[channel.icon]" class="mt-1 shrink-0 text-signal" :size="21" />
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.14em] text-black/35">
                {{ copy[channel.labelKey] }}
              </p>
              <a
                v-if="channel.href"
                class="mt-2 block text-sm font-medium hover:text-signal"
                :href="channel.href"
                >{{ channel.text }}</a
              >
              <!-- wide 只给地址那行：它是唯一会折行的，限宽避免长英文地址拉满整栏 -->
              <p v-else :class="['mt-2 text-sm', channel.wide ? 'max-w-sm leading-7 text-ink' : '']">
                {{ channel.textKey ? copy[channel.textKey] : channel.text }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 原生表单直提 Formspree。action / method 留着做无 JS 兜底，
           正常路径由 submit.prevent 走 fetch，提交后停在本页显示结果。
           novalidate：浏览器自带的校验气泡跟随浏览器语言，会和站点的中英文
           不一致，所以关掉气泡，改用下面的 errors 出中英文提示；required
           保留，屏幕阅读器仍能读到「必填」。 -->
      <form
        ref="formRef"
        v-reveal
        :action="formEndpoint"
        method="POST"
        novalidate
        class="bg-white p-6 shadow-lift sm:p-10"
        @submit.prevent="submit"
      >
        <input type="hidden" name="_subject" :value="subject" />
        <!-- Formspree 蜜罐：真人看不见也 tab 不到，机器人填了就整条丢弃 -->
        <input
          type="text"
          name="_gotcha"
          tabindex="-1"
          autocomplete="off"
          aria-hidden="true"
          class="pointer-events-none absolute size-0 opacity-0"
        />

        <!-- 五个字段都由 contactFields 下发。留言是 textarea，占满两列排在
             四个输入框下面 —— gap-6 与原来的 mt-6 同为 24px，视觉不变。 -->
        <div class="grid gap-6 sm:grid-cols-2">
          <div
            v-for="field in contactFields"
            :key="field.name"
            :class="field.multiline ? 'sm:col-span-2' : ''"
          >
            <label :for="`contact-${field.name}`" :class="labelClass">
              {{ copy[field.labelKey] }}
              <span v-if="field.required" class="text-signal" aria-hidden="true">*</span>
            </label>
            <textarea
              v-if="field.multiline"
              :id="`contact-${field.name}`"
              v-model="form[field.name]"
              :name="field.name"
              :rows="field.rows"
              :required="field.required"
              :class="`${fieldClass} resize-none`"
              :aria-invalid="Boolean(errors[field.name])"
              :aria-describedby="errors[field.name] ? `contact-${field.name}-error` : undefined"
              @input="revalidate(field.name)"
            ></textarea>
            <input
              v-else
              :id="`contact-${field.name}`"
              v-model="form[field.name]"
              :name="field.name"
              :type="field.type"
              :required="field.required"
              :autocomplete="field.autocomplete"
              :class="fieldClass"
              :aria-invalid="field.required ? Boolean(errors[field.name]) : undefined"
              :aria-describedby="errors[field.name] ? `contact-${field.name}-error` : undefined"
              @input="field.required && revalidate(field.name)"
            />
            <p
              v-if="errors[field.name]"
              :id="`contact-${field.name}-error`"
              class="pt-1.5 text-xs leading-5 text-signal"
            >
              {{ messageFor(field.name) }}
            </p>
          </div>
        </div>

        <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <!-- shrink-0 + whitespace-nowrap：按钮是 flex item，默认可被压缩。
               右侧提交失败那句话较长，不锁住的话按钮会被挤窄、文案折成两行
               （中文 1024px 实测 108x64）。 -->
          <button
            type="submit"
            class="btn-primary w-full shrink-0 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            :disabled="status === 'sending'"
          >
            {{ status === 'sending' ? copy.sending : copy.send }}
            <ArrowRight :size="18" />
          </button>
          <p
            v-if="status === 'sent' || status === 'error'"
            role="status"
            aria-live="polite"
            :class="['text-sm leading-6', status === 'sent' ? 'text-pine' : 'text-signal']"
          >
            {{ status === 'sent' ? copy.success : copy.error }}
          </p>
        </div>
      </form>
    </section>

    <section class="relative h-[520px] overflow-hidden bg-[#dfe4dc]">
      <iframe
        :title="copy.mapTitle"
        :src="contactMap.embed"
        class="size-full border-0 grayscale-[.25]"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <div class="pointer-events-none absolute bottom-5 left-5 max-w-sm bg-ink p-6 text-white shadow-lift sm:bottom-8 sm:left-8">
        <Building2 :size="21" class="text-signal" />
        <p class="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-white/40">{{ copy.hqEyebrow }}</p>
        <p class="mt-2 text-sm leading-6 text-white/75">{{ copy.address }}</p>
        <a
          class="pointer-events-auto mt-4 inline-flex items-center gap-2 text-xs font-bold text-white hover:text-signal"
          :href="contactMap.link"
          target="_blank"
          rel="noreferrer"
          >{{ copy.locate }} <ArrowRight :size="15" /></a
        >
      </div>
    </section>
  </div>
</template>
