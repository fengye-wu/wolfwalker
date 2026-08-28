/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pine: '#173d2b',
        moss: '#687c45',
        signal: '#e96b32',
        ink: '#17201b',
        mist: '#f2f4ef',
      },
      // 全站统一思源黑体。sans 这一项同时是 preflight 给 html 的 font-family，
      // 也就是整站的默认字体 —— 只改 SCSS 里的 $font-han 不够，这里不跟着改，
      // 正文仍会拿到旧的 Inter/Arial。
      // 四个别名的来历见 _variables.scss 的 $font-han 注释，两处要一起改。
      // display 原为 Arial Black（AboutView 那些大写标题的海报感来源），
      // 按「字体全部改用思源」一并并入；粗度改由 font-weight 撑，
      // 思源有 Heavy 档，font-black 仍能压出同等力度。
      fontFamily: {
        sans: [
          'SourceHanSansCN',
          'Source Han Sans CN',
          'Source Han Sans SC',
          'Noto Sans SC',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
        display: [
          'SourceHanSansCN',
          'Source Han Sans CN',
          'Source Han Sans SC',
          'Noto Sans SC',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      boxShadow: {
        lift: '0 18px 50px rgba(23, 32, 27, 0.12)',
      },
    },
  },
  plugins: [],
}
