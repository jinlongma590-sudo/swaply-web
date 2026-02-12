module.exports = {
  plugins: {
    // 1. Tailwind v4 生成现代 CSS (含 @layer, oklch)
    '@tailwindcss/postcss': {},

    // 2. 强力降级处理
    'postcss-preset-env': {
      // 开启所有降级特性
      stage: 0,
      features: {
        // 强制把 @layer 拍平 (解决 Android 11 样式全丢的核心)
        'cascade-layers': true,
        // 强制把嵌套解开
        'nesting-rules': true,
        // 强制把 oklch 颜色转为 rgb (解决颜色丢失)
        'oklch-function': { preserve: false },
        // 处理现代颜色写法
        'color-functional-notation': true,
      },
      browsers: 'Android >= 10',
      autoprefixer: { grid: true }
    },

    // 3. 最后加前缀
    'autoprefixer': {},
  },
}