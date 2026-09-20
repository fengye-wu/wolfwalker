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
        // 播完把 animate.css 类摘掉：fill-mode: both 会把结束帧的 transform
        // 一直锁在元素上，优先级高于普通 CSS transform，元素后续的 hover
        // 缩放/位移（scale / translate）会全部失效（实测联系页 photo 中招）。
        // animate.css 各入场动画结束帧都是「回正」，摘掉类不会闪。
        el.addEventListener(
          'animationend',
          () => el.classList.remove('animate__animated', ...names),
          { once: true },
        )
      } else {
        el.classList.add('reveal-visible')
      }
      observer.disconnect()
    }, { threshold: 0.12 })

    // 首次加载看不到动画，坑都在「触发时机过早」：
    //   1) mount 同帧 observer 就回调，动画在浏览器画出首帧前已跑完前段；
    //   2) rAF 双层仍与刷新时的首帧 paint 存在竞态 —— 回调始终跑在 paint 前，
    //      页面可见时动画已开播，CPU/网络快慢决定丢多少前段（表现为时有时无）；
    //   3) img 是 OSS 外链，动画播完图才加载出来，等于白播。
    // 解法：rAF 后再补 60ms 宏任务延迟，确保动画开始于页面完成首帧之后
    // （60ms 肉眼无感，但足够躲开刷新白屏期）；img 没加载完（complete 为假）
    // 则等 load/error 后再观察（破图也要 reveal，别把内容卡死在隐藏态）。
    // 另给动画统一加 150ms 的 animation-delay，浏览器偶发的首帧抖动不再吃掉开头。
    const startObserve = () => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.animationDelay = '0.15s'
          observer.observe(el)
        }, 60)
      })
    }
    if (el.tagName === 'IMG' && !el.complete) {
      el.addEventListener('load', startObserve, { once: true })
      el.addEventListener('error', startObserve, { once: true })
    } else {
      startObserve()
    }
  },
})

app.use(router).mount('#app')
