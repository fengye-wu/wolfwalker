// 轮播的触摸手势判定。首页顶部 banner、首页商品轮播、商品页顶部 banner
// 三处共用，逻辑一模一样，所以从 HomeView 里提出来。
//
// 两种用法：
//   1. 只传 onLeft/onRight —— 全程不拦 touchmove，touchend 结算一次。
//      够用于 ElCarousel 这类自己带切换动画的轮播。
//   2. 再传 onLock/onMove/onSettle —— 「跟手」模式，手指按着图就跟着走。
//      首页商品轮播用这一档。

// 横向不足 40px 当误触；横向没超过纵向说明用户其实在滚页面，也不接管。
export const SWIPE_MIN_X = 40
// 跟手模式下，横竖方向未定前不动轨道 —— 竖着滚页面时图跟着抖最难看。
// 谁先超过 8px 就锁定那个轴，之后不再改判。
const SWIPE_AXIS_LOCK = 8
// 快速轻扫：手指走得够快就不看距离。0.5px/ms 约等于一屏宽划过 0.8 秒，
// 比这快的都是明确要翻页，不该因为距离差几像素被判成误触弹回去。
const SWIPE_FLICK_SPEED = 0.5

export const createSwipe = ({
  onLeft,
  onRight,
  onStart,
  onEnd,
  // 下面几个是可选的「跟手」扩展。不传就是原来的行为：
  // 全程不拦 touchmove，只在 touchend 结算一次。
  onLock,
  onMove,
  onSettle,
  // 结算阈值，返回 px。跟手模式下该按卡片宽度取比例，不能用固定值。
  threshold,
}) => {
  let startX = 0
  let startY = 0
  let startTime = 0
  let swiped = false
  let axis = null

  // 返回 1（下一张）/ -1（上一张）/ 0（不动）
  const decide = (deltaX, elapsed) => {
    const min = threshold?.() ?? SWIPE_MIN_X
    // elapsed 为 0 时按「无限快」算，别用 elapsed > 0 当前提 ——
    // 那样零耗时的手势会连轻扫一起否掉。
    const speed = elapsed > 0 ? Math.abs(deltaX) / elapsed : Infinity
    const flick = speed > SWIPE_FLICK_SPEED && Math.abs(deltaX) > 12
    if (!flick && Math.abs(deltaX) < min) return 0
    return deltaX < 0 ? 1 : -1
  }

  return {
    start(event) {
      const touch = event.changedTouches[0]
      startX = touch.clientX
      startY = touch.clientY
      startTime = event.timeStamp
      swiped = false
      axis = null
      onStart?.()
    },
    move(event) {
      if (!onMove) return
      const touch = event.changedTouches[0]
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY
      if (!axis) {
        if (Math.abs(deltaX) < SWIPE_AXIS_LOCK && Math.abs(deltaY) < SWIPE_AXIS_LOCK) return
        axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y'
        // 判定为横向的那一刻才通知「真的开始拖了」。放在 touchstart 里做不行：
        // 那时方向还没定，竖着滚页面也会被当成拖动 —— 轨道会被切成无过渡，
        // 索引也会被提前借位，白改一遍状态。
        if (axis === 'x') onLock?.()
      }
      if (axis === 'x') onMove(deltaX)
    },
    end(event) {
      const touch = event.changedTouches[0]
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY
      // 跟手模式用轴锁的结果；非跟手模式没有 touchmove 可参考，
      // 沿用「横向要超过纵向」这条老判据。
      const horizontal = onMove ? axis === 'x' : Math.abs(deltaX) > Math.abs(deltaY)
      const step = horizontal ? decide(deltaX, event.timeStamp - startTime) : 0
      swiped = step !== 0

      // 跟手模式要在同一处把偏移归零和翻页一起做掉（同一帧才有过渡），
      // 所以交给 onSettle 全权处理，不再走 onEnd + onLeft/onRight。
      if (onSettle) {
        onSettle(step)
        return
      }
      onEnd?.()
      if (step === 1) onLeft()
      else if (step === -1) onRight()
    },
    // 滑动松手后浏览器还会补一个 click。轮播里的卡片都是链接或按钮，
    // 不拦就会在滑动的同时跳走。捕获阶段先手截住，stopPropagation 让
    // 链接自己的处理器根本收不到这个事件。
    guardClick(event) {
      if (!swiped) return
      swiped = false
      event.preventDefault()
      event.stopPropagation()
    },
  }
}
