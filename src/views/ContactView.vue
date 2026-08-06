<script setup>
import { ArrowRight, Building2, Clock3, Mail, MapPin, Phone } from 'lucide-vue-next'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'

const { locale, t } = useLocale()
const route = useRoute()
const inquiryMessage = (language) => route.query.product
  ? (language === 'zh'
      ? `商品：${route.query.product}\n数量：${route.query.quantity || 50}`
      : `Product: ${route.query.product}\nQuantity: ${route.query.quantity || 50}`)
  : ''
const form = reactive({
  name: '', company: '', email: '', phone: '',
  message: inquiryMessage(locale.value),
})
const formRef = ref()
const sent = ref(false)
const rules = computed(() => ({
  name: [{ required: true, message: locale.value === 'zh' ? '请输入姓名' : 'Please enter your name', trigger: 'blur' }],
  email: [
    { required: true, message: locale.value === 'zh' ? '请输入邮箱' : 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: locale.value === 'zh' ? '请输入有效邮箱' : 'Please enter a valid email', trigger: ['blur', 'change'] },
  ],
  message: [{ required: true, message: locale.value === 'zh' ? '请输入留言' : 'Please enter a message', trigger: 'blur' }],
}))
const submit = async () => {
  if (!formRef.value || !await formRef.value.validate().catch(() => false)) return
  sent.value = true
}
watch(locale, (value, previous) => {
  if (route.query.product && form.message === inquiryMessage(previous)) form.message = inquiryMessage(value)
})
</script>

<template>
  <div>
    <section class="bg-pine py-20 text-white lg:py-28">
      <div class="site-container grid gap-10 lg:grid-cols-[1fr_.65fr] lg:items-end">
        <div class="animate-rise"><p class="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#b3ca9d]">{{ locale === 'zh' ? '联系 / WOLFWALKER' : 'CONTACT / WOLFWALKER' }}</p><h1 class="font-display text-5xl font-black uppercase leading-[0.95] sm:text-6xl lg:text-7xl">{{ t.contactTitle }}</h1></div>
        <p class="animate-rise delay-1 max-w-xl text-base leading-8 text-white/65 lg:pb-1">{{ t.contactLead }}</p>
      </div>
    </section>

    <section class="site-container grid gap-12 py-16 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:py-24">
      <div v-reveal>
        <p class="eyebrow">{{ locale === 'zh' ? 'WOLFWALKER 总部' : 'WOLFWALKER HQ' }}</p><h2 class="section-title">{{ t.office }}</h2>
        <div class="mt-8 space-y-7">
          <div class="flex gap-4"><MapPin class="mt-1 shrink-0 text-signal" :size="21" /><div><p class="text-xs font-bold uppercase tracking-[0.14em] text-black/35">{{ t.office }}</p><p class="mt-2 max-w-sm text-sm leading-7 text-ink">{{ t.address }}</p></div></div>
          <div class="flex gap-4"><Mail class="mt-1 shrink-0 text-signal" :size="21" /><div><p class="text-xs font-bold uppercase tracking-[0.14em] text-black/35">{{ t.sales }}</p><a class="mt-2 block text-sm font-medium hover:text-signal" href="mailto:sales@wolfwalker.com">sales@wolfwalker.com</a></div></div>
          <div class="flex gap-4"><Phone class="mt-1 shrink-0 text-signal" :size="21" /><div><p class="text-xs font-bold uppercase tracking-[0.14em] text-black/35">{{ t.phone }}</p><a class="mt-2 block text-sm font-medium hover:text-signal" href="tel:+865592552012">+86 559 255 2012</a></div></div>
          <div class="flex gap-4"><Clock3 class="mt-1 shrink-0 text-signal" :size="21" /><div><p class="text-xs font-bold uppercase tracking-[0.14em] text-black/35">{{ locale === 'zh' ? '工作时间' : 'Business hours' }}</p><p class="mt-2 text-sm">{{ t.hours }}</p></div></div>
        </div>
      </div>

      <ElForm ref="formRef" v-reveal :model="form" :rules="rules" label-position="top" class="contact-form bg-white p-6 shadow-lift sm:p-10" @submit.prevent="submit">
        <div class="grid gap-6 sm:grid-cols-2">
          <ElFormItem :label="t.name" prop="name"><ElInput v-model="form.name" /></ElFormItem>
          <ElFormItem :label="t.company" prop="company"><ElInput v-model="form.company" /></ElFormItem>
          <ElFormItem :label="t.email" prop="email"><ElInput v-model="form.email" type="email" /></ElFormItem>
          <ElFormItem :label="t.phone" prop="phone"><ElInput v-model="form.phone" type="tel" /></ElFormItem>
        </div>
        <ElFormItem :label="t.message" prop="message" class="mt-1"><ElInput v-model="form.message" type="textarea" :rows="5" resize="none" /></ElFormItem>
        <div class="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><ElButton type="primary" native-type="submit" size="large">{{ t.send }} <ArrowRight :size="18" /></ElButton><p v-if="sent" class="text-sm text-pine">{{ t.formSuccess }}</p></div>
      </ElForm>
    </section>

    <section class="relative h-[520px] overflow-hidden bg-[#dfe4dc]">
      <iframe title="Wolfwalker location map" class="size-full border-0 grayscale-[.25]" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=%E5%AE%89%E5%BE%BD%E7%9C%81%E9%BB%84%E5%B1%B1%E5%B8%82%E7%BB%8F%E6%B5%8E%E5%BC%80%E5%8F%91%E5%8C%BA%E8%8A%99%E8%93%89%E8%B7%AF13%E5%8F%B7%E4%B8%80%E6%9C%9F2%E5%8F%B7%E5%8E%82%E6%88%BF&output=embed"></iframe>
      <div class="pointer-events-none absolute bottom-5 left-5 max-w-sm bg-ink p-6 text-white shadow-lift sm:bottom-8 sm:left-8">
        <Building2 :size="21" class="text-signal" /><p class="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-white/40">{{ locale === 'zh' ? 'WOLFWALKER 总部' : 'WOLFWALKER HQ' }}</p><p class="mt-2 text-sm leading-6 text-white/75">{{ t.address }}</p>
        <a class="pointer-events-auto mt-4 inline-flex items-center gap-2 text-xs font-bold text-white hover:text-signal" href="https://www.google.com/maps/search/?api=1&query=%E5%AE%89%E5%BE%BD%E7%9C%81%E9%BB%84%E5%B1%B1%E5%B8%82%E7%BB%8F%E6%B5%8E%E5%BC%80%E5%8F%91%E5%8C%BA%E8%8A%99%E8%93%89%E8%B7%AF13%E5%8F%B7%E4%B8%80%E6%9C%9F2%E5%8F%B7%E5%8E%82%E6%88%BF" target="_blank" rel="noreferrer">{{ t.locate }} <ArrowRight :size="15" /></a>
      </div>
    </section>
  </div>
</template>
