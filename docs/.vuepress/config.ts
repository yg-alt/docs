import { defineConfig, defineConfig4CustomTheme } from "vuepress/config"

export default defineConfig((ctx) => ({
	title: "前端小站",
	description: "D & Y",
	/**
	 * Type is `DefaultThemeConfig`
	 */
	themeConfig: {
		repo: "https://github.com/Cwd295645351/hr/", // 仓库链接
		repoLabel: "查看源码",
		// 默认是 false, 设置为 true 来启用
		editLinks: true,
		docsDir: "",
		// 假如文档放在一个特定的分支下：
		docsBranch: "master",
		// 默认为 "Edit this page"
		editLinkText: "帮助我们改善此页面！",
		nav: [{ text: "Guide", link: "/guide/" }],
		// sidebar: ["/", "/guide", ["/design-patterns", "patterns"]]
		/** 侧边栏 */
		sidebar: {
			"/foo/": ["", "one", "two"],
			"/guide/": [""],
			"/design-patterns/": [""],
			"/": ["", "contact", "about"]
		},
		// search: false, // 禁用默认搜索框
		searchMaxSuggestions: 10, // 搜索结果数量
		lastUpdated: "Last Updated", // 最后更新时间 string | boolean
		// 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
		nextLinks: false,
		// 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
		prevLinks: false
	},
	// do not execute babel compilation under development
	evergreen: ctx.isProd
}))
