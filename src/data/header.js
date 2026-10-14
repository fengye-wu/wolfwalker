const OSS = "https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home";

export const headerImages = {
  logoMark: `${OSS}/sub/logo-black.png`,
};

export const headerConfig = {
  height: {
    default: 72,
    desktop: 80,
    home: {
      min: 78,
      max: 118,
    },
  },
};

// 六个一级菜单，各自一条独立路由。
// match 是该菜单要点亮的路由 name 集合 —— 不用 router-link-active，因为
// 商品详情（product-detail）是另一条路由记录，靠那个类名「产品分类」不会亮。
// 四种语言只差 label，所以先写一份再按语言摊开，免得四份数组各改一处走偏。
const navItems = [
  { to: "/", match: ["home"], zh: "首页", en: "Home", ja: "ホーム", ru: "Главная" },
  {
    to: "/product",
    match: ["products", "product-detail"],
    zh: "产品分类",
    en: "Products",
    ja: "商品",
    ru: "Товары",
  },
  { to: "/AboutUs", match: ["about"], zh: "关于我们", en: "About Us", ja: "ブランドについて", ru: "О бренде" },
  { to: "/factory", match: ["factory"], zh: "工厂介绍", en: "Factory", ja: "工場紹介", ru: "Производство" },
  { to: "/custom", match: ["custom"], zh: "定制专区", en: "Custom", ja: "カスタマイズ", ru: "Кастомизация" },
  { to: "/contact", match: ["contact"], zh: "联系我们", en: "Contact Us", ja: "お問い合わせ", ru: "Контакты" },
];

export const navigation = {
  zh: navItems.map(({ to, match, zh }) => ({ to, match, label: zh })),
  en: navItems.map(({ to, match, en }) => ({ to, match, label: en })),
  ja: navItems.map(({ to, match, ja }) => ({ to, match, label: ja })),
  ru: navItems.map(({ to, match, ru }) => ({ to, match, label: ru })),
};

export const copy = {
  zh: {
    brandName: "WOLF WALKER",
    brandHome: "Wolf Walker 首页",
    mainNav: "主导航",
    switchLanguage: "切换语言",
    currentLanguage: "中文",
    search: "搜索",
    searchProducts: "搜索产品",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    mobileNav: "移动端导航",
    languageMenu: "语言",
  },
  en: {
    brandName: "WOLF WALKER",
    brandHome: "Wolf Walker home",
    mainNav: "Main navigation",
    switchLanguage: "Switch language",
    currentLanguage: "English",
    search: "Search",
    searchProducts: "Search products",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mobileNav: "Mobile navigation",
    languageMenu: "Language",
  },
  ja: {
    brandName: "WOLF WALKER",
    brandHome: "Wolf Walker ホーム",
    mainNav: "メインナビゲーション",
    switchLanguage: "言語を切り替える",
    currentLanguage: "日本語",
    search: "検索",
    searchProducts: "商品を検索",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    mobileNav: "モバイルナビゲーション",
    languageMenu: "言語",
  },
  ru: {
    brandName: "WOLF WALKER",
    brandHome: "Wolf Walker — главная",
    mainNav: "Главная навигация",
    switchLanguage: "Сменить язык",
    currentLanguage: "Русский",
    search: "Поиск",
    searchProducts: "Поиск товаров",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    mobileNav: "Мобильная навигация",
    languageMenu: "Язык",
  },
};
