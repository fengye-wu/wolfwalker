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
      'site-header--stuck': stuck
    }"
  >
    <div class="site-header__inner">
      <RouterLink to="/" class="site-brand" :aria-label="copy.brandHome">
        <img :src="headerImages.logoMark" alt="" />
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
  // 头部整体用思源宋体。$font-serif 目前在 _variables.scss 里被指到黑体
  // （本机字体历史原因），且被首页大标题、产品页 hero 共用，不能全局改回，
  // 所以头部单独用真宋体栈：思源宋体各渠道族名 + 系统宋体兜底。
  font-family: 'SourceHanSerifCN', 'Source Han Serif CN', 'Source Han Serif SC',
    'Noto Serif SC', 'Songti SC', 'SimSun', serif;
  background: rgba($white, 0.96);
  backdrop-filter: blur(14px);
  // 背景/字色渐变过渡，两态之间不硬切。
  // 不写 height 和 position：这两个在阈值处是瞬变的，让它们过渡反而会看见抽动。
  transition:
    background-color 260ms ease,
    backdrop-filter 260ms ease,
    color 260ms ease,
    box-shadow 260ms ease;

  // 手机端（≤1023，固定条形态）白底深字。logo 图本身是深红棕字标
  // （实测不透明像素 RGB 均值 92/35/41），白底上清晰；文字/图标同步翻成
  // 深色，否则白底白字全隐形。
  @include tablet-down {
    color: $ink;
    background: #fff;
  }
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

  // 顶部态（透明、未吸顶）的文字整体加大 2px —— 92px 的大头部配大一号的字；
  // 吸顶后恢复原字号（需求：固定态字体现在这样就行）。
  // 只作用于 overlay 页面的顶部态：手机端头部一直是固定白底条、白底页
  // （product-detail 等）没有大号顶部态，两处的字都保持原值。
  // :not(--stuck) 保证滚过 20px 后立即回到原字号。
  // is-active 的加号套路照旧（原值 +2px），顶部态即 +4px。
  .site-header--overlay:not(.site-header--stuck) {
    .site-brand strong {
      font-size: calc(clamp(15px, 1.15vw, 22px) + 2px);
    }

    .site-nav a {
      font-size: calc(clamp(14px, 1.12vw, 21px) + 2px);

      &.is-active {
        font-size: calc(clamp(14px, 1.12vw, 21px) + 4px);
      }
    }

    .home-tool {
      font-size: calc(clamp(12px, 0.82vw, 15px) + 2px);
    }
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
  // 底部对齐：logo 放大到 246x41 后，导航、工具与 logo 底边取平，
  // 观感上是一排「坐」在同一条基线上。padding-bottom 让文字不贴死
  // border-bottom。92 → 72 两态切换时 inner 高度不变，底线依旧不动。
  align-items: end;
  padding-bottom: 12px;
  gap: clamp(20px, 3vw, 60px);
  border-bottom: 1px solid rgba(39, 38, 45, 0.13);
  transition: border-bottom-color 260ms ease;

  @include tablet-down {
    width: calc(100% - 36px);
    grid-template-columns: 1fr auto;
    gap: 16px;
    // 手机端头部是固定条形态，没有底对齐的大 logo 语境，
    // 恢复垂直居中，不被桌面端的新规则带偏；
    // 白底上用与桌面端一致的深灰分隔线。
    align-items: center;
    padding-bottom: 0;
    border-bottom-color: rgba(39, 38, 45, 0.13);
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
    // logo 原图就是 246x41，这里只做上限约束、按自然尺寸等比呈现，
    // 不再压成 44x24 的小图标（设计稿的整标就是这个尺寸）。
    max-width: 246px;
    max-height: 41px;
    width: auto;
    height: auto;
    object-fit: contain;

    // 手机端窄屏调小一档
    @include mobile {
      max-width: 180px;
      max-height: 30px;
    }
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
  // 链接沉到 nav 底部：文字底线与 logo 底线平齐（inner 已改 end 对齐，
  // nav 自身仍占满行高，这里不让链接垂直居中，否则字悬在半空对不上 logo）。
  align-items: flex-end;
  gap: clamp(26px, 3.25vw, 62px);
  height: 100%;

  @include tablet-down {
    display: none;
  }

  a {
    position: relative;
    display: flex;
    align-items: center;
    // 原为 height: 100%：链接撑满行高、文字悬在行中央，与底对齐的 logo 错位。
    // 改随内容高，底边与 logo 底边取平。
    // line-height: 1 消掉行盒的 descender 空隙 —— 不收的话文字视觉底边
    // 比元素底边高出约 5px，logo 底线对齐后导航仍像悬在半空。
    line-height: 1;
    color: inherit;
    // font-family 跟随 .site-header 的思源宋体（原 $font-serif 现指向黑体）
    font-size: clamp(14px, 1.12vw, 21px);
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    // 字色随 hover/激活平滑过渡，与头部的 260ms 节奏一致
    transition: color 180ms ease;

    // hover 变红：与激活态同一个红，给非激活菜单一个明确的可点反馈
    &:hover {
      color: $nav-active;
    }

    // 激活态：变红并放大 2px。用 calc 包住整条 clamp，各断点都是「原值 + 2px」，
    // 不用把三个尺寸各写一遍。同时只有一项会激活，宽度变化不至于挤动其它菜单。
    &.is-active {
      color: $nav-active;
      font-size: calc(clamp(14px, 1.12vw, 21px) + 2px);
    }

    // 激活下划线已整体移除：头部吸顶是常态，需求是「固定时激活 tab
    // 不显示横线」，白底页（product-detail 等）头部同样是固定的，一并去掉。
    // 激活态只剩颜色区分（$nav-active 红）。
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
  // min-height: 40 会让文字在按钮里垂直居中、底边比 logo 底线悬高约 13px，
  // 与底对齐的导航不齐。压到内容高并让内容沉底后，文字底边与 logo 底线取平；
  // 代价是点击区变小（桌面端鼠标操作可接受），手机端菜单按钮不在此列。
  min-height: 0;
  align-items: flex-end;

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
