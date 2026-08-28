import { createApp } from 'vue'
import { ElButton, ElCarousel, ElCarouselItem, ElDrawer, ElForm, ElFormItem, ElInput, ElInputNumber } from 'element-plus'
import 'element-plus/dist/index.css'
import 'animate.css'
import App from './App.vue'
import router from './router'
import './styles/main.scss'

const app = createApp(App)

const elementComponents = { ElButton, ElCarousel, ElCarouselItem, ElDrawer, ElForm, ElFormItem, ElInput, ElInputNumber }
Object.entries(elementComponents).forEach(([name, component]) => app.component(name, component))

// v-reveal：进入视口播一次入场动效，之后断开观察，不来回播。
// 不传值走默认的淡入上移（transition，样式在 _motion.scss）；
// 传 animate.css 的类名就走 keyframes，例如 v-reveal="'animate__bounceInLeft'"。
// 两条路必须互斥 —— transition 和 animation 同时改 opacity/transform 会打架，
// 而且 transition 是后应用的，会把 animation 的中间值抹平。
app.directive('reveal', {
  mounted(el, binding) {
    const names = binding.value
      ? (Array.isArray(binding.value) ? binding.value : [binding.value])
      : null

    // animate.css 的动画本身从 opacity: 0 起步，但类是进视口才加的，
    // 在那之前得先有东西把元素藏住，否则首屏之外的元素会先露一下。
    el.classList.add(names ? 'reveal-hidden' : 'reveal-ready')

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      if (names) {
        // 同一帧摘掉 reveal-hidden 再加动画类：animate.css 是 fill-mode: both，
        // 动画结束后 opacity 交回样式表，reveal-hidden 留着元素就没了。
        el.classList.remove('reveal-hidden')
        el.classList.add('animate__animated', ...names)
      } else {
        el.classList.add('reveal-visible')
      }
      observer.disconnect()
    }, { threshold: 0.12 })
    observer.observe(el)
  },
})

app.use(router).mount('#app')
