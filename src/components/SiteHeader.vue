<script setup>
import { computed, ref, watch } from 'vue';
import { Globe2, Menu, Search, X } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { useLocale } from '../composables/useLocale';
import { headerImages, navigation, copy as headerCopy } from '../data/header';

const route = useRoute();
const open = ref(false);
const { locale, toggleLocale } = useLocale();
const isHome = computed(() => route.name === 'home');

const links = computed(() => navigation[locale.value]);
const copy = computed(() => headerCopy[locale.value]);

// 按路由 name 判定激活，不用 router-link-active：
// 一是「/」是所有路径的前缀，那个类在任意页面都会挂到首页链接上；
// 二是商品详情是独立路由记录，靠类名点不亮「产品分类」。
const isActive = (link) => link.match.includes(route.name);

watch(
  () => route.fullPath,
  () => {
    open.value = false;
  }
);
</script>

<template>
  <header class="site-header" :class="{ 'site-header--home': isHome }">
    <div class="site-header__inner">
      <RouterLink to="/" class="site-brand" :aria-label="copy.brandHome">
        <img :src="headerImages.logoMark" alt="" />
        <strong>{{ copy.brandName }}</strong>
      </RouterLink>

      <nav class="site-nav" :aria-label="copy.mainNav">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="{ 'is-active': isActive(link) }"
          :aria-current="isActive(link) ? 'page' : undefined"
          >{{ link.label }}</RouterLink
        >
      </nav>

      <div class="site-tools">
        <button
          type="button"
          class="home-tool"
          :aria-label="copy.switchLanguage"
          @click="toggleLocale"
        >
          <Globe2 :size="17" />
          <span>{{ copy.currentLanguage }}</span>
        </button>
        <button
          type="button"
          class="site-menu-button"
          :aria-expanded="open"
          :aria-label="open ? copy.closeMenu : copy.openMenu"
          @click="open = !open"
        >
          <X v-if="open" :size="24" />
          <Menu v-else :size="24" />
        </button>
      </div>
    </div>

    <nav v-if="open" class="site-mobile-nav" :aria-label="copy.mobileNav">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :class="{ 'is-active': isActive(link) }"
        :aria-current="isActive(link) ? 'page' : undefined"
        >{{ link.label }}</RouterLink
      >
      <button type="button" @click="toggleLocale">
        {{ copy.currentLanguage }}
      </button>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 999999;
  height: 72px;
  color: $header-text;
  background: rgba($white, 0.96);
  backdrop-filter: blur(14px);

  @include desktop-up {
    height: 80px;
  }

  // 首页头部浮在 hero 上，做成透明渐变。
  // 必须排在上面的 desktop-up 之后：两者权重相同，靠先后决胜，
  // 写反了 ≥1024 时这里的 clamp 高度会被 80px 压掉。
  &--home {
    position: absolute;
    height: clamp(78px, 6.15vw, 118px);
    color: $white;
    background: linear-gradient(180deg, rgba(5, 31, 43, 0.26), transparent);
    backdrop-filter: none;

    @include tablet-down {
      height: 72px;
      background: linear-gradient(180deg, rgba(4, 24, 34, 0.72), transparent);
    }
  }

  &__inner {
    @include shell-width($shell-header, 48px);

    height: 100%;
    margin: 0 auto;
    display: grid;
    // 两侧列 1fr 等分，nav 自然落在正中。
    // 下限原为 210px，但 1024-1040 这段装不下：英文六个菜单的 nav 要 536px
    // （中文只要 478px），加上 210×2 和两道 gap 共需 1017px，而这里的壳只有
    // 976px —— 溢出 41px，页面出现 17px 横向滚动，nav 还被顶得偏右 20px，
    // 正好和这条下限想维持的居中相反。
    // 收到 150px：brand 实测最宽 220px（1920 下）、tools 190-412px，都由内容
    // 撑开，用不到下限；下限只在内容异常窄时兜个底，所以降它不影响任何断点的
    // 居中（实测 1024-2560 偏移全为 0）。
    grid-template-columns: minmax(150px, 1fr) auto minmax(150px, 1fr);
    align-items: center;
    gap: clamp(20px, 3vw, 60px);
    border-bottom: 1px solid rgba(39, 38, 45, 0.13);

    @include tablet-down {
      width: calc(100% - 36px);
      grid-template-columns: 1fr auto;
      gap: 16px;
    }
  }

  &--home &__inner {
    border-bottom-color: rgba($white, 0.72);
  }
}

.site-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-self: start;
  color: inherit;
  text-decoration: none;

  img {
    width: 44px;
    height: 24px;
    object-fit: contain;
  }

  strong {
    font-size: clamp(15px, 1.15vw, 22px);
    font-style: italic;
    font-weight: 800;
    letter-spacing: 0;
  }
}

.site-nav {
  display: flex;
  align-items: center;
  gap: clamp(26px, 3.25vw, 62px);
  height: 100%;

  @include tablet-down {
    display: none;
  }

  a {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    color: inherit;
    font-family: $font-serif;
    font-size: clamp(14px, 1.12vw, 21px);
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;

    // 激活态：变红并放大 2px。用 calc 包住整条 clamp，各断点都是「原值 + 2px」，
    // 不用把三个尺寸各写一遍。同时只有一项会激活，宽度变化不至于挤动其它菜单。
    &.is-active {
      color: $nav-active;
      font-size: calc(clamp(14px, 1.12vw, 21px) + 2px);
    }

    // 非首页才有下划线动效，首页头部是透明的、加线太脏
    .site-header:not(.site-header--home) & {
      &::after {
        content: '';
        position: absolute;
        inset: auto 0 0;
        height: 2px;
        background: $home-rose;
        transform: scaleX(0);
        transition: transform 180ms ease;
      }

      &.is-active::after {
        transform: scaleX(1);
      }
    }
  }
}

.site-tools {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
}

// 语言/搜索工具与移动端菜单按钮共用的裸按钮外观。
// 保留逗号分组而不是抽成 mixin，免得产物里同样的声明出现两遍。
.home-tool,
.site-menu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 0;
  min-height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: clamp(12px, 0.82vw, 15px);
  text-decoration: none;
  cursor: pointer;
}

.home-tool {
  @include tablet-down {
    display: none;
  }
}

// 窄屏才出现，与 .site-nav 正好互换
.site-menu-button {
  display: none;
  width: 44px;

  @include tablet-down {
    display: inline-flex;
  }
}

.site-mobile-nav {
  display: none;

  @include tablet-down {
    position: absolute;
    top: 72px;
    inset-inline: 0;
    display: flex;
    flex-direction: column;
    padding: 14px 22px 24px;
    background: rgba($white, 0.98);
    box-shadow: 0 18px 35px rgba(21, 28, 31, 0.12);

    .site-header--home & {
      background: rgba(9, 31, 40, 0.97);
    }

    a,
    button {
      padding: 15px 0;
      border: 0;
      border-bottom: 1px solid rgba(39, 38, 45, 0.11);
      background: transparent;
      color: $header-text;
      font-size: 17px;
      text-align: left;
      text-decoration: none;

      .site-header--home & {
        border-bottom-color: rgba($white, 0.12);
        color: $white;
      }
    }

    // 移动端同样跟随激活态，保持两套导航一致
    a.is-active {
      color: $nav-active;
      font-size: 19px;

      .site-header--home & {
        color: $nav-active;
      }
    }
  }
}
</style>
