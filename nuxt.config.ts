export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },
  ssr: false,
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      title: 'bngrid',
      meta: [
        {
          name: 'description',
          content: 'bngrid - 华容网格 原子组件 流畅动画'
        },
        {
          name: 'theme-color',
          media: '(prefers-color-scheme: light)',
          content: '#E1E1E1'
        },
        {
          name: 'theme-color',
          media: '(prefers-color-scheme: dark)',
          content: '#1E1E1E'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/icon.png'
        }
      ]
    },
    pageTransition: {
      name: 'page'
    }
  },
  css: ['~/assets/css/main.css'],
  components: [
    {
      path: '~/components/atom',
      pathPrefix: false,
      global: true
    },
    '~/components'
  ],
  compatibilityDate: '2024-08-04'
})
