export const headerImages = {
  logoMark: 'https://wolfwalkershop.oss-cn-beijing.aliyuncs.com/images/home/sub/logo.png'
}

export const headerConfig = {
  height: {
    default: 72,
    desktop: 80,
    home: {
      min: 78,
      max: 118,
    },
  },
}

// 六个一级菜单，各自一条独立路由。
// match 是该菜单要点亮的路由 name 集合 —— 不用 router-link-active，因为
// 商品详情（product-detail）是另一条路由记录，靠那个类名「产品分类」不会亮。
// zh/en 只差 label，所以先写一份再按语言摊开，免得两份数组各改一处走偏。
const navItems = [
  { to: '/', match: ['home'], zh: '首页', en: 'Home' },
  { to: '/product', match: ['products', 'product-detail'], zh: '产品分类', en: 'Products' },
  { to: '/AboutUs', match: ['about'], zh: '关于我们', en: 'About Us' },
  { to: '/factory', match: ['factory'], zh: '工厂介绍', en: 'Factory' },
  { to: '/custom', match: ['custom'], zh: '定制专区', en: 'Custom' },
  { to: '/contact', match: ['contact'], zh: '联系我们', en: 'Contact Us' },
]

export const navigation = {
  zh: navItems.map(({ to, match, zh }) => ({ to, match, label: zh })),
  en: navItems.map(({ to, match, en }) => ({ to, match, label: en })),
}

export const copy = {
  zh: {
    brandName: 'WOLF WALKER',
    brandHome: 'Wolf Walker 首页',
    mainNav: '主导航',
    switchLanguage: 'Switch to English',
    currentLanguage: 'English',
    search: '搜索',
    searchProducts: '搜索产品',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    mobileNav: '移动端导航',
  },
  en: {
    brandName: 'WOLF WALKER',
    brandHome: 'Wolf Walker home',
    mainNav: 'Main navigation',
    switchLanguage: '切换为中文',
    currentLanguage: '中文',
    search: 'Search',
    searchProducts: 'Search products',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mobileNav: 'Mobile navigation',
  },
}
