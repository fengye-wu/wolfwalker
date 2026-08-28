import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
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
      if (to.hash) return { el: to.hash, top: 96 }
      return { top: 0, behavior: 'instant' }
    }

    if (savedPosition) return savedPosition
    if (to.name === 'products' && from.name === 'products' && to.path === from.path) return false
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 96 }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/product', name: 'products', component: ProductView },
    { path: '/product/:category(tent|sleepingpad|sofa|tableAndchair|accessories)/:id', name: 'product-detail', component: ProductDetailView },
    { path: '/AboutUs', name: 'about', component: AboutView },
    { path: '/factory', name: 'factory', component: FactoryView },
    { path: '/custom', name: 'custom', component: CustomView },
    { path: '/contact', name: 'contact', component: ContactView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
})

export default router
