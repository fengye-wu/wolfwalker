import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
// 只负责关掉 ESLint / plugin-vue 里和 Prettier 冲突的格式规则，
// 不把 Prettier 挂进 ESLint（格式问题跑 `npm run format` 解决，检查跑 format:check）。
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// 格式（引号 / 分号 / 换行）全部交给 Prettier（.prettierrc.json），
// 这里只管代码质量和真实错误，存量代码不会因为风格差异被刷屏。
export default [
  // 构建产物和本地工具目录不参与检查
  { ignores: ['dist/**', 'artifacts/**', 'lanhu-mcp/**', '.codebuddy/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  {
    files: ['**/*.{js,mjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
  },
  {
    // 视觉检查脚本跑在 Node 里，需要 process / console 等全局
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]
