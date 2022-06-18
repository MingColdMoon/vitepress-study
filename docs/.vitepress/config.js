export default {
    themeConfig: {
        siteTitle: '冷月的笔记',
        logo: '/logo.jpg',


        nav: [
            { text: '前端', link: '/study/vue2源码解析', activeMatch: '/study/vue2源码解析.md' }
        ],

        sidebar: {
            '/study/': [
                {
                    text: 'vue2相关知识',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        { text: 'vue2源码解析', link: '/study/vue2.md' }
                    ]
                },
                {
                    text: 'vue3',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        { text: 'vue3功能和vue2对比', link: '/study/Vue3.md' }, // /guide/one.md
                    ]
                },
                {
                    text: 'react',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        { text: 'react语法', link: '/study/React.md' }
                    ]
                },
                {
                    text: 'webpack',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        { text: 'webpack原理和使用', link: '/study/webpack.md' }
                    ]
                },
                {
                    text: 'typescript',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        { text: 'typescript基本使用', link: '/study/TS.md' }
                    ]
                }
            ]
        },


        socialLinks: [
            // { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
            { icon: 'twitter', link: '...' },
            { icon: 'discord', link: '...' }
        ]

    }
}