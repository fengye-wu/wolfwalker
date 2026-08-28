<script setup>
import { computed } from 'vue';
import { useLocale } from '../composables/useLocale';
import { footerImages, footerRoutes, copy as footerCopy } from '../data/footer';

const { locale } = useLocale();

const copy = computed(() => footerCopy[locale.value]);
</script>

<template>
  <footer id="site-footer" class="site-footer">
    <div class="site-footer__inner">
      <RouterLink to="/" class="footer-brand" :aria-label="copy.brandHome">
        <img :src="footerImages.logoMark" alt="" />
      </RouterLink>

      <nav :aria-label="copy.products">
        <h2>{{ copy.products }}</h2>
        <RouterLink
          v-for="(label, index) in copy.productLinks"
          :key="label"
          :to="footerRoutes.product[index] || '/product'"
          >{{ label }}</RouterLink
        >
      </nav>

      <nav :aria-label="copy.solutions">
        <h2>{{ copy.solutions }}</h2>
        <RouterLink
          v-for="(label, index) in copy.solutionLinks"
          :key="label"
          :to="footerRoutes.solution[index] || '/factory'"
          >{{ label }}</RouterLink
        >
      </nav>

      <nav :aria-label="copy.about">
        <h2>{{ copy.about }}</h2>
        <RouterLink
          v-for="(label, index) in copy.aboutLinks"
          :key="label"
          :to="footerRoutes.about[index] || '/AboutUs'"
          >{{ label }}</RouterLink
        >
      </nav>

      <div class="footer-contact">
        <h2>{{ copy.contact }}</h2>
        <p>{{ copy.phone }}</p>
        <p>{{ copy.email }}</p>
        <p>{{ copy.place }}</p>
      </div>

      <div class="footer-qr">
        <img :src="footerImages.wechatQr" :alt="copy.wechatQrAlt" />
        <p>{{ copy.scan }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  background: $white;
  color: $footer-text;
  padding: clamp(90px, 8.6vw, 165px) 0 42px;
  border-top: 1px solid $footer-line;

  @include mobile {
    padding: 40px 0 28px;
  }

  &__inner {
    @include shell-width($shell-footer);

    margin: 0 auto;
    display: grid;
    // 六列：品牌 + 三个链接栏 + 联系方式 + 二维码
    grid-template-columns: 1.45fr repeat(3, 0.72fr) 1.25fr 0.72fr;
    gap: clamp(28px, 3.1vw, 60px);
    align-items: start;

    @include tablet-down {
      grid-template-columns: 1.2fr repeat(2, 1fr);
    }

    // 手机端六等分：三个链接栏各占 2 列并排成一行，
    // 下一行联系方式占 4 列、二维码占 2 列。
    // 原来是 2 列，三个链接栏折成两行、剩一格空着。
    @include mobile {
      width: calc(100% - 40px);
      grid-template-columns: repeat(6, 1fr);
      gap: 26px 14px;
    }
  }

  h2 {
    margin: 0 0 18px;
    color: $footer-strong;
    font-size: 16px;
    font-weight: 700;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 10px;

    // 三栏并排，每栏 2/6
    @include mobile {
      grid-column: span 2;
      gap: 7px;
    }
  }

  @include mobile {
    h2 {
      margin-bottom: 12px;
      font-size: 14px;
    }
  }

  &__legal {
    @include shell-width($shell-footer);

    margin: 70px auto 0;
    color: $footer-legal;
    font-size: 10px;

    @include mobile {
      width: calc(100% - 40px);
      margin-top: 48px;
      line-height: 1.6;
    }
  }
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-self: start;
  color: $footer-strong;
  text-decoration: none;

  @include mobile {
    grid-column: 1 / -1;
  }

  img {
    width: 286px;
    height: 42px;
    object-fit: contain;

    // 286px 在 350 可用宽下几乎顶满，按 6.8:1 等比缩到 220
    @include mobile {
      width: 220px;
      height: 32px;
    }
  }

  strong {
    font-size: clamp(15px, 1.15vw, 22px);
    font-style: italic;
    font-weight: 800;
    letter-spacing: 0;
  }
}

// 链接和联系信息是同一套字号配色，合并成一条规则输出
.site-footer nav a,
.footer-contact p {
  margin: 0;
  color: $footer-link;
  font-size: 12px;
  line-height: 1.5;
  text-decoration: none;
}

.site-footer nav a:hover {
  color: $home-rose;
}

.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 10px;

  @include tablet-down {
    margin-top: 28px;
  }

  // 与二维码同排：占 4/6，剩下 2 列给二维码
  @include mobile {
    grid-column: span 4;
    margin-top: 0;
    gap: 7px;
  }
}

.footer-qr {
  @include tablet-down {
    margin-top: 28px;
  }

  // 与联系方式同排，占右侧 2/6
  @include mobile {
    grid-column: span 2;
    margin-top: 0;
    justify-self: end;
  }

  img {
    width: 112px;
    height: 112px;
    object-fit: contain;

    // 2/6 栏在 350 可用宽下约 108px，缩到 96 留出呼吸
    @include mobile {
      width: 96px;
      height: 96px;
    }
  }

  // 说明文字与二维码同宽才能居中对齐
  p {
    width: 112px;
    margin: 12px 0 0;
    color: $footer-note;
    font-size: 12px;
    text-align: center;

    @include mobile {
      width: 96px;
      margin-top: 8px;
      font-size: 11px;
      line-height: 1.4;
    }
  }
}
</style>
