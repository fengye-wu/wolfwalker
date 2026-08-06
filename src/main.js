import { createApp } from 'vue'
import { ElButton, ElCarousel, ElCarouselItem, ElDrawer, ElForm, ElFormItem, ElInput, ElInputNumber } from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)

const elementComponents = { ElButton, ElCarousel, ElCarouselItem, ElDrawer, ElForm, ElFormItem, ElInput, ElInputNumber }
Object.entries(elementComponents).forEach(([name, component]) => app.component(name, component))

app.directive('reveal', {
  mounted(el) {
    el.classList.add('reveal-ready')
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      el.classList.add('reveal-visible')
      observer.disconnect()
    }, { threshold: 0.12 })
    observer.observe(el)
  },
})

app.use(router).mount('#app')
