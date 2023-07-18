import { defineConfig } from 'vuepress/config'

export default defineConfig((ctx) => ({
  title: '前端小站',
  /**
   * Type is `DefaultThemeConfig`
   */

  base: '/docs/',
  themeConfig: {
    repo: 'https://github.com/Cwd295645351/docs',
    repoLabel: '查看源码',
    editLinks: true,
    docsDir: 'docs',
    docsBranch: 'main',

    search: true,
    searchMaxSuggestions: 10,

    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！',
    nav: [
      { text: '设计模式', link: '/design/' }, // 内部链接 以docs为根目录
    ],
    smoothScroll: true,
    sidebar: {
      '/design/': ['', 'adapter', 'combination', 'decorator', 'chain-of-responsibility', 'publish-subcribe', 'proxy', 'single', 'status', 'strategy'],
      '/foo/': ['', 'one', 'two'],
    },

    sidebarDepth: 2,
    lastUpdated: 'Last Updated', // string | boolean
  },
  markdown: {
    lineNumbers: true,
  },
}))
