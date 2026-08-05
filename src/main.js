import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)

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
