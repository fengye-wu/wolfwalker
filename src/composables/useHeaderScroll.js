import { onMounted, onUnmounted, readonly, ref } from 'vue'

// 头部两态的尺寸。三处要用到同一组数字（头部自身、App 的顶部留白、
// 路由锚点偏移），所以放这里导出，不各自写字面量。
//
// 92 - 20 = 72 不是巧合：初始态 92 高、跟着页面滚，滚过 20px 时它正好
// 只剩 72px 露在视口里，这一刻换成 fixed 72px，下沿位置连续、不跳。
export const HEADER_HEIGHT_TOP = 92
export const HEADER_HEIGHT_STUCK = 72
export const HEADER_STICK_AT = HEADER_HEIGHT_TOP - HEADER_HEIGHT_STUCK

// 模块级共享：多个组件调用也只挂一个 scroll 监听。
const stuck = ref(false)
let consumers = 0
let frame = 0

const measure = () => {
  frame = 0
  stuck.value = window.scrollY >= HEADER_STICK_AT
}

// scroll 一帧可能来好几次，用 rAF 合并，读 scrollY 也才不会触发额外重排。
const onScroll = () => {
  if (frame) return
  frame = requestAnimationFrame(measure)
}

export function useHeaderScroll() {
  onMounted(() => {
    if (consumers++ === 0) {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    // 刷新时浏览器可能已经停在半页上，先同步一次当前位置
    measure()
  })

  onUnmounted(() => {
    if (--consumers === 0) {
      window.removeEventListener('scroll', onScroll)
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }
  })

  return { stuck: readonly(stuck) }
}
