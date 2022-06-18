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
                        { text: 'vue2源码解析', link: '/study/vue2源码解析.md' }
                    ]
                },
                {
                    text: '小程序',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        { text: '微信小程序', link: '/study/微信小程序.md' }
                    ]
                },
                {
                    text: 'vue3',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        // This shows `/guide/index.md` page.
                        { text: 'vue3语法', link: '/study/创建vue3.md' }, // /guide/index.md
                        { text: 'vue3功能和vue2对比', link: '/study/vue3.md' }, // /guide/one.md
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