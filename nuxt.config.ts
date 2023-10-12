// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore']
      }
    ],
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
        dir: 'ltr'
      },
      titleTemplate: '%s - BNGrid',
      meta: [
        { name: 'description', content: '华容网格 原子组件' },
        { name: 'theme-color', content: '#00e696' }
      ],
      link: [
        { rel: 'icon', href: 'favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '192x192', href: 'favicon.png' },
        { rel: 'mask-icon', href: 'favicon.svg', color: '#00e696' }
      ]
    }
  },
  components: {
    global: true,
    dirs: ['~/components']
  }
})
