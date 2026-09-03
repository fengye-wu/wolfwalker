import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
import { HEADER_HEIGHT_STUCK } from '../composables/useHeaderScroll'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import AboutView from '../views/AboutView.vue'
import FactoryView from '../views/FactoryView.vue'
import CustomView from '../views/CustomView.vue'
import ContactView from '../views/ContactView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // 打开新标签页 / 刷新：一律回顶部。
    // 浏览器自带的 scrollRestoration 已被 vue-router 关掉（传了 scrollBehavior
    // 就会设成 manual），但 vue-router 自己还留了一手：页面隐藏前它把滚动位置
    // 写进 history.state.scroll，这份 state 能活过刷新，首次导航又会把它取出来
    // 当 savedPosition 递进来。所以刷新后停在半页，得在这里显式挡掉。
    // behavior 用 instant：html 上有 scroll-behavior: smooth，不指定的话
    // 刷新瞬间会从上次的位置一路滑上来。
    if (from === START_LOCATION) {
      // 带锚点的链接是明确的意图，照旧跳到对应位置
      if (to.hash) return { el: to.hash, top: HEADER_HEIGHT_STUCK }
      return { top: 0, behavior: 'instant' }
    }

    if (savedPosition) return savedPosition
    if (to.name === 'products' && from.name === 'products' && to.path === from.path) return false
    // 锚点一定是滚到页面中段，那时头部已经吸顶成 72px，让出这个高度就够。
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: HEADER_HEIGHT_STUCK }
    return { top: 0, behavior: 'smooth' }
  },
  // meta.headerOverlay：这一页开头是满幅的深色大图/色块，桌面端头部可以透明
  // 压在上面，main 不留顶部空白。不带这个标记的页面开头是文档流里的普通内容
  // （product-detail 是 56px 高的面包屑、not-found 是居中的 404），压上去会被
  // 盖住，所以照旧留出头部高度 72px。
  // meta.headerDark：透明态下用深色字。只有上面这两页需要 —— 它们顶端是白底。
  //
  // 各页顶端 92px 实测亮度（0-255，越大越亮）：
  //   products 17.7/83.7/112.2  contact 51.6  factory 72.4/75.7/94.0
  //   home 130.4/73.7/51.0  about 29.7/121.8/157.4  custom 171.9/121.5/108.7
  //   product-detail 232.6/194.6/247.6  not-found 247.6
  // 三个数分别是 brand / nav / tools 三个区域，白字够不够看它们的最大值。
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { headerOverlay: true } },
    { path: '/product', name: 'products', component: ProductView, meta: { headerOverlay: true } },
    // 枚举必须与 data/products.js 的 categories 逐项一致，漏一个那类的详情页就是 404。
    // NeckPillow 的大小写照抄，路由参数大小写敏感。
    { path: '/product/:category(tent|airpad|foampad|NeckPillow|sofa|tableAndchair|accessories)/:id', name: 'product-detail', component: ProductDetailView, meta: { headerDark: true } },
    { path: '/AboutUs', name: 'about', component: AboutView, meta: { headerOverlay: true } },
    { path: '/factory', name: 'factory', component: FactoryView, meta: { headerOverlay: true } },
    { path: '/custom', name: 'custom', component: CustomView, meta: { headerOverlay: true } },
    { path: '/contact', name: 'contact', component: ContactView, meta: { headerOverlay: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView, meta: { headerDark: true } },
  ],
})

export default router
