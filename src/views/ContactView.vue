<script setup>
import { ArrowRight } from "lucide-vue-next";
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useLocale } from "../composables/useLocale";
import {
  contactCopy,
  contactFields,
  contactImages,
  contactSocial,
  fieldClass,
  formEndpoint,
  labelClass,
  mailSubject,
} from "../data/contact";

const { locale } = useLocale();
const route = useRoute();
const copy = computed(() => contactCopy[locale.value] ?? contactCopy.zh);
const images = contactImages;

// 询盘预填：从详情页「获取报价」带 product / quantity 过来
const inquiryMessage = (language) =>
  route.query.product
    ? contactCopy[language].inquiry(
        route.query.product,
        route.query.quantity || 50
      )
    : "";

const form = reactive(
  Object.fromEntries(
    contactFields.map((field) => [
      field.name,
      field.name === "message" ? inquiryMessage(locale.value) : "",
    ])
  )
);

// 必填字段由 contactFields 推出来，加减字段不用再同步改这里
const requiredFields = contactFields
  .filter((field) => field.required)
  .map((field) => field.name);
// 只存错误类型的 key，不存译文 —— 切语言时已显示的提示会跟着翻，不用重跑校验
const errors = reactive(
  Object.fromEntries(requiredFields.map((name) => [name, ""]))
);
const messageFor = (field) =>
  errors[field] === "email"
    ? copy.value.invalid.email
    : errors[field] && copy.value.invalid.required[field];

const validate = () => {
  for (const name of requiredFields)
    errors[name] = form[name].trim() ? "" : "required";
  const email = form.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "email";
  return requiredFields.every((name) => !errors[name]);
};
// 已经报错的字段边打边校验，让提示随输入消失；没报错的不打扰
const revalidate = (field) => {
  if (errors[field]) validate();
};

// idle / sending / sent / error
const formRef = ref();
const status = ref("idle");
const subject = computed(() =>
  route.query.product
    ? mailSubject.withProduct(route.query.product)
    : mailSubject.fallback
);

const submit = async () => {
  if (status.value === "sending" || !validate()) return;
  status.value = "sending";
  try {
    const response = await fetch(formEndpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(formRef.value),
    });
    if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
    status.value = "sent";
    for (const field of contactFields) form[field.name] = "";
  } catch {
    status.value = "error";
  }
};

watch(locale, (value, previous) => {
  if (route.query.product && form.message === inquiryMessage(previous))
    form.message = inquiryMessage(value);
});
</script>

<template>
  <div>
    <!-- 1. Hero：全宽大图，左下白字两行（设计稿「深耕户外装备」） -->
    <!-- hover 缓慢放大（同 ProductCard 模式）：容器 group + overflow-hidden -->
    <section class="group relative overflow-hidden">
      <img
        :src="images.banner"
        alt="Wolfwalker 联系我们"
        fetchpriority="high"
        class="block h-auto w-full transition duration-700 group-hover:scale-105"
      />
      <div
        class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/40 via-transparent to-transparent"
      >
        <div class="site-container pb-[12.5vw]"  v-reveal="'animate__fadeInUp'">
          <h1
            class="font-display text-[clamp(34px,4.6vw,88px)] font-black leading-tight text-white"
          >
            {{ copy.heroTitle }}
          </h1>
          <p
            class="mt-2 text-[clamp(13px,1.25vw,24px)] font-medium text-white/90"
          >
            {{ copy.heroSub }}
          </p>
        </div>
      </div>
    </section>

    <!-- 2. 2x2 网格：行1 = 标题段落 | 客服图；行2 = 社交卡 | 表单。
         容器左右大留白（设计稿约 14%），行间距拉大 —— 不是左右两列各管各的 -->
    <section
      class="mx-auto grid gap-y-10 px-[6%] py-12 lg:grid-cols-[0.44fr_0.56fr] lg:gap-x-12 lg:gap-y-[5.5vw] lg:px-[13%]"
    >
      <div v-reveal="'animate__fadeInUp'">
        <h2
          class="whitespace-pre-line font-display text-[clamp(44px,5vw,96px)] font-black leading-[1.08] text-ink"
        >
          {{ copy.introTitle }}
        </h2>
        <p class="mt-8 whitespace-pre-line text-sm leading-7 text-black/55">
          {{ copy.introBody }}
        </p>
      </div>

      <div class="group overflow-hidden">
        <img
          v-reveal="'animate__fadeInUp'"
          :src="images.photo"
          alt="Wolfwalker 客服团队"
          loading="lazy"
          class="aspect-[1.6] w-full object-cover"
        />
      </div>

      <!-- 社交卡：图标 + 名称 + 账号 -->
      <div v-reveal class="flex flex-col gap-4">
        <a
          v-reveal="'animate__fadeInUp'"
          v-for="social in contactSocial"
          :key="social.key"
          :href="social.href"
          target="_blank"
          rel="noopener"
          class="group flex items-center gap-5 border border-black/10 bg-white px-6 py-6 transition duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-lift"
        >
          <img
            :src="social.icon"
            alt=""
            aria-hidden="true"
            class="h-7 w-7 shrink-0 object-contain transition-transform duration-300 group-hover:scale-125"
          />
          <span class="min-w-0">
            <span class="block text-sm font-bold text-ink transition-colors group-hover:text-signal">{{
              social.name
            }}</span>
            <span class="mt-0.5 block truncate text-xs text-black/40">{{
              social.account
            }}</span>
          </span>
        </a>
      </div>

      <!-- 原生表单直提 Formspree。action / method 留着做无 JS 兜底，
             正常路径由 submit.prevent 走 fetch，提交后停在本页显示结果。
             novalidate：浏览器自带的校验气泡跟随浏览器语言，会和站点的中英文
             不一致，所以关掉气泡，改用下面的 errors 出中英文提示；required
             保留，屏幕阅读器仍能读到「必填」。 -->
      <form
        v-reveal="'animate__fadeInUp'"
        ref="formRef"
        :action="formEndpoint"
        method="POST"
        novalidate
        class="mt-0"
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

        <!-- 三个字段：姓名/邮箱并排，需求描述整行在下（设计稿同构） -->
        <div class="grid gap-6 sm:grid-cols-2">
          <div
            v-for="field in contactFields"
            :key="field.name"
            :class="field.multiline ? 'sm:col-span-2' : ''"
          >
            <label :for="`contact-${field.name}`" :class="labelClass">
              {{ copy[field.labelKey] }}
              <span v-if="field.required" class="text-signal" aria-hidden="true"
                >*</span
              >
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
              :aria-describedby="
                errors[field.name] ? `contact-${field.name}-error` : undefined
              "
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
              :aria-invalid="
                field.required ? Boolean(errors[field.name]) : undefined
              "
              :aria-describedby="
                errors[field.name] ? `contact-${field.name}-error` : undefined
              "
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

        <!-- 底部一行：提示语居左、按钮居右（设计稿同构） -->
        <div
          class="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="max-w-xs text-xs leading-5 text-black/40">
            {{ copy.notice }}
          </p>
          <div class="flex flex-col items-start gap-3 sm:items-end">
            <p
              v-if="status === 'sent' || status === 'error'"
              role="status"
              aria-live="polite"
              :class="[
                'text-xs leading-5',
                status === 'sent' ? 'text-pine' : 'text-signal',
              ]"
            >
              {{ status === "sent" ? copy.success : copy.error }}
            </p>
            <button
              type="submit"
              class="inline-flex shrink-0 items-center gap-2 border border-black/20 bg-white px-7 py-3 text-sm font-bold text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="status === 'sending'"
            >
              {{ status === "sending" ? copy.sending : copy.send }}
              <ArrowRight :size="16" />
            </button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>
