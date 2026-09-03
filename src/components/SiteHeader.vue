<script setup>
import { computed, ref, watch } from 'vue';
import { Globe2, Menu, X } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { useLocale } from '../composables/useLocale';
import { useHeaderScroll } from '../composables/useHeaderScroll';
import { headerImages, navigation, copy as headerCopy } from '../data/header';

const route = useRoute();
const open = ref(false);
const { locale, toggleLocale } = useLocale();
const { stuck } = useHeaderScroll();

// 桌面端两态：
//   顶部态 —— 92px、无背景，透出这一页第一屏的内容，跟着页面滚；
//   吸顶态 —— 滚过 20px 后固定在顶，72px、白色半透明 + 磨砂。
// 全站一套，首页不再特殊。
//
// 透明态压在文档流内容上会盖住它，所以只有 meta.headerOverlay 的页面透明；
// 其余页面（product-detail / not-found）保持白底吸顶态的样子。
const overlay = computed(() => route.meta.headerOverlay === true);
// 透明态的字色。深色字只给顶端是白底的那两页；它们本来就不 overlay，
// 所以这个类实际只影响手机端之外的边界情况，留着是为了两个 meta 自洽。
const darkText = computed(() => route.meta.headerDark === true);

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
  <header
    class="site-header"
    :class="{
      'site-header--overlay': overlay,
      'site-header--dark': darkText,
      'site-header--stuck': stuck,
    }"
  >
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
// 手机端保持原样：一直是 72px 白底固定条，不参与两态。
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 999999;
  height: 72px;
  color: $header-text;
  background: rgba($white, 0.96);
  backdrop-filter: blur(14px);
  // 背景/字色渐变过渡，两态之间不硬切。
  // 不写 height 和 position：这两个在阈值处是瞬变的，让它们过渡反而会看见抽动。
  transition: background-color 260ms ease, backdrop-filter 260ms ease,
    color 260ms ease, box-shadow 260ms ease;
}

// ---------- 桌面端两态 ----------
@include desktop-up {
  // 顶部态：92px、无背景、跟着页面滚。position: absolute 是相对文档原点，
  // 头部没有定位祖先，所以就是页面顶端。
  .site-header--overlay {
    position: absolute;
    height: $header-height-top;
    color: $white;
    background-color: transparent;
    backdrop-filter: none;
    text-shadow: 0 1px 3px rgba(6, 18, 26, 0.55);

    // 不是背景色，是一层自上而下收干的压深：底下的照片照样透上来，
    // 只是被压暗一点，白字才有对比度。
    //
    // 为什么必须有：透明态的白字压在各页第一屏上，而那些底色不受控。
    // 实测文字带（brand / nav / tools 三块的实际盒子）底色亮度 ——
    //   products 14.7/85.3/115.4   contact 51.6   factory 73.8/75.3/91.1
    //   home 129.8/72.2/50.5       about 29.7/113.0/158.4
    //   custom 173.8/121.9/105.5   ← 定制页左上是均匀浅色照片
    // custom 的 173.8 和 about 的 tools 158.4，白字在这种浅底上没有对比度，
    // text-shadow 只描边、填不了字面内部，救不回来。
    //
    // 停靠点这么排是照着文字的实际位置：文字在头部下面 72px 里（上面 20px
    // 是滚掉的空条），所以强度要在 20%-80% 这段撑住，不能一路线性收干 ——
    // 先前 0.34→0.16@78% 的写法在 brand 盒子（y=39..72）只乘到 0.82，
    // custom 仅从 173.8 降到 142.1，还是偏亮。
    // 现在这组在文字带上平均乘 0.70：custom brand 落到 120 上下，
    // 本来就暗的页面（products 14.7）压完仍是 10 上下，看不出变化。
    // 末端必须收到全透明，否则头部下沿会在照片上留一道硬边。
    background-image: linear-gradient(
      to bottom,
      rgba(6, 18, 26, 0.44),
      rgba(6, 18, 26, 0.34) 55%,
      rgba(6, 18, 26, 0.2) 80%,
      rgba(6, 18, 26, 0)
    );
  }

  // 顶端是白底的页面（product-detail / not-found）改用深色字。
  // 它们不 overlay，这条只在两个 meta 同时给了的情况下生效，属于兜底。
  .site-header--overlay.site-header--dark {
    color: $header-text;
    text-shadow: none;
    // 深色字用在白底顶端，压深会变成一道脏影，去掉
    background-image: none;
  }

  // 吸顶态：滚过 20px 换成 fixed 72px。
  // 92 - 20 = 72，切换那一刻顶部态正好只剩 72px 露在视口里，下沿位置连续。
  // 白色带一点透明 + 磨砂，下面的内容透上来一点。
  .site-header--overlay.site-header--stuck {
    position: fixed;
    height: $header-height-stuck;
    color: $header-text;
    background: rgba($white, 0.72);
    backdrop-filter: blur(18px) saturate(1.6);
    box-shadow: 0 1px 14px rgba(21, 28, 31, 0.08);
    text-shadow: none;
  }

  // 不 overlay 的页面只有一态，高度跟吸顶态一致，背景照旧不透。
  .site-header:not(.site-header--overlay) {
    height: $header-height-stuck;
  }
}

.site-header__inner {
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
  transition: border-bottom-color 260ms ease;

  @include tablet-down {
    width: calc(100% - 36px);
    grid-template-columns: 1fr auto;
    gap: 16px;
  }
}

// 顶部态里 inner 只占下面 72px（贴着头部下沿），不吃满 92px。
// 这样 92 → 72 时 logo / 菜单 / 工具的中线不动 —— 否则中线会从 46 跳到 36，
// 整排字在阈值处抖一下。上面空出的 20px 正好是滚掉的那一段。
@include desktop-up {
  .site-header--overlay .site-header__inner {
    height: $header-height-stuck;
    margin-top: $header-height-top - $header-height-stuck;
    border-bottom-color: rgba($white, 0.72);
  }

  .site-header--overlay.site-header--dark .site-header__inner {
    border-bottom-color: rgba(39, 38, 45, 0.13);
  }

  // 吸顶态回到吃满整个头部高度
  .site-header--overlay.site-header--stuck .site-header__inner {
    margin-top: 0;
    border-bottom-color: rgba(39, 38, 45, 0.13);
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

    // 只有不透明的头部才有下划线动效 —— 透明态压在照片上，加条线太脏。
    // 现在全站都有透明态，所以判据从「非首页」改成「非透明态」：
    // 吸顶后有白底，线就回来。
    .site-header:not(.site-header--overlay) &,
    .site-header--stuck & {
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

    // 原先首页在手机端也是深色头部，这里跟着有一套深色面板。
    // 现在两态只做桌面端、手机端一律白底，那套深色覆盖已无处触发，删掉。
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
    }

    // 移动端同样跟随激活态，保持两套导航一致
    a.is-active {
      color: $nav-active;
      font-size: 19px;
    }
  }
}
</style>
