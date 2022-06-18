## webpack

### 安装eslint

```javascript
npm install eslint eslint-config-enough babel-eslint eslint-loader --save-dev
```

在package.json中添加

```javascript
{
  "eslintConfig": {
    "extends": "enough",
    "env": {
      "browser": true,
      "node": true
    }
  }
}
```

### 安装webpack和Babel

> [webpack](https://github.com/webpack/webpack) 即 webpack 核心库。它提供了很多 [API](https://webpack.js.org/api/node/), 通过 Node.js 脚本中 `require('webpack')` 的方式来使用 webpack。
>
> [webpack-cli](https://github.com/webpack/webpack-cli) 是 webpack 的命令行工具。让我们可以不用写打包脚本，只需配置打包配置文件，然后在命令行输入 `webpack-cli --config webpack.config.js` 来使用 webpack, 简单很多。webpack 4 之前命令行工具是集成在 webpack 包中的，4.0 开始 webpack 包本身不再集成 cli。
>
> [webpack-serve](https://github.com/webpack-contrib/webpack-serve) 是 webpack 提供的用来开发调试的服务器，让你可以用 http://127.0.0.1:8080/ 这样的 url 打开页面来调试，有了它就不用配置 [nginx](https://nginx.org/en/) 了，方便很多。
>
> [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin), [html-loader](https://github.com/webpack/html-loader), [css-loader](https://github.com/webpack/css-loader), [style-loader](https://github.com/webpack/style-loader)        等看名字就知道是打包 html 文件，css 文件的插件，大家在这里可能会有疑问，`html-webpack-plugin` 和 `html-loader` 有什么区别，`css-loader` 和 `style-loader` 有什么区别，我们等会看配置文件的时候再讲。
>
> [file-loader](https://github.com/webpack/file-loader) 和 [url-loader](https://github.com/webpack/url-loader) 是打包二进制文件的插件，具体也在配置文件章节讲解。

```javascript
npm install webpack webpack-cli webpack-serve html-webpack-plugin html-loader css-loader style-loader file-loader url-loader --save-dev
```

```javascript
//babel
npm install babel-core babel-preset-env babel-loader --save-dev
{
  "babel": {
    "presets": ["env"]
  }
}
```

> webpack.config.js

```javascript
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')

// 使用 WEBPACK_SERVE 环境变量检测当前是否是在 webpack-server 启动的开发环境中
const dev = Boolean(process.env.WEBPACK_SERVE)

module.exports = {
  /*
  webpack 执行模式
  development：开发环境，它会在配置文件中插入调试相关的选项，比如 moduleId 使用文件路径方便调试
  production：生产环境，webpack 会将代码做压缩等优化
  */
  mode: dev ? 'development' : 'production',

  /*
  配置 source map
  开发模式下使用 cheap-module-eval-source-map, 生成的 source map 能和源码每行对应，方便打断点调试
  生产模式下使用 hidden-source-map, 生成独立的 source map 文件，并且不在 js 文件中插入 source map 路径，用于在 error report 工具中查看 （比如 Sentry)
  */
  devtool: dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',

  // 配置页面入口 js 文件
  entry: './src/index.js',

  // 配置打包输出相关
  output: {
    // 打包输出目录
    path: resolve(__dirname, 'dist'),

    // 入口 js 的打包输出文件名
    filename: 'index.js'
  },

  module: {
    /*
    配置各种类型文件的加载器，称之为 loader
    webpack 当遇到 import ... 时，会调用这里配置的 loader 对引用的文件进行编译
    */
    rules: [
      {
        /*
        使用 babel 编译 ES6 / ES7 / ES8 为 ES5 代码
        使用正则表达式匹配后缀名为 .js 的文件
        */
        test: /\.js$/,

        // 排除 node_modules 目录下的文件，npm 安装的包不需要编译
        exclude: /node_modules/,

        /*
        use 指定该文件的 loader, 值可以是字符串或者数组。
        这里先使用 eslint-loader 处理，返回的结果交给 babel-loader 处理。loader 的处理顺序是从最后一个到第一个。
        eslint-loader 用来检查代码，如果有错误，编译的时候会报错。
        babel-loader 用来编译 js 文件。
        */
        use: ['babel-loader', 'eslint-loader']
      },

      {
        // 匹配 html 文件
        test: /\.html$/,
        /*
        使用 html-loader, 将 html 内容存为 js 字符串，比如当遇到
        import htmlString from './template.html';
        template.html 的文件内容会被转成一个 js 字符串，合并到 js 文件里。
        */
        use: 'html-loader'
      },

      {
        // 匹配 css 文件
        test: /\.css$/,

        /*
        先使用 css-loader 处理，返回的结果交给 style-loader 处理。
        css-loader 将 css 内容存为 js 字符串，并且会把 background, @font-face 等引用的图片，
        字体文件交给指定的 loader 打包，类似上面的 html-loader, 用什么 loader 同样在 loaders 对象中定义，等会下面就会看到。
        */
        use: ['style-loader', 'css-loader']
      },

      {
        /*
        匹配各种格式的图片和字体文件
        上面 html-loader 会把 html 中 <img> 标签的图片解析出来，文件名匹配到这里的 test 的正则表达式，
        css-loader 引用的图片和字体同样会匹配到这里的 test 条件
        */
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,

        /*
        使用 url-loader, 它接受一个 limit 参数，单位为字节(byte)

        当文件体积小于 limit 时，url-loader 把文件转为 Data URI 的格式内联到引用的地方
        当文件大于 limit 时，url-loader 会调用 file-loader, 把文件储存到输出目录，并把引用的文件路径改写成输出后的路径

        比如 views/foo/index.html 中
        <img src="smallpic.png">
        会被编译成
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAA...">

        而
        <img src="largepic.png">
        会被编译成
        <img src="/f78661bef717cf2cc2c2e5158f196384.png">
        */
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },

  /*
  配置 webpack 插件
  plugin 和 loader 的区别是，loader 是在 import 时根据不同的文件名，匹配不同的 loader 对这个文件做处理，
  而 plugin, 关注的不是文件的格式，而是在编译的各个阶段，会触发不同的事件，让你可以干预每个编译阶段。
  */
  plugins: [
    /*
    html-webpack-plugin 用来打包入口 html 文件
    entry 配置的入口是 js 文件，webpack 以 js 文件为入口，遇到 import, 用配置的 loader 加载引入文件
    但作为浏览器打开的入口 html, 是引用入口 js 的文件，它在整个编译过程的外面，
    所以，我们需要 html-webpack-plugin 来打包作为入口的 html 文件
    */
    new HtmlWebpackPlugin({
      /*
      template 参数指定入口 html 文件路径，插件会把这个文件交给 webpack 去编译，
      webpack 按照正常流程，找到 loaders 中 test 条件匹配的 loader 来编译，那么这里 html-loader 就是匹配的 loader
      html-loader 编译后产生的字符串，会由 html-webpack-plugin 储存为 html 文件到输出目录，默认文件名为 index.html
      可以通过 filename 参数指定输出的文件名
      html-webpack-plugin 也可以不指定 template 参数，它会使用默认的 html 模板。
      */
      template: './src/index.html',

      /*
      因为和 webpack 4 的兼容性问题，chunksSortMode 参数需要设置为 none
      https://github.com/jantimon/html-webpack-plugin/issues/870
      */
      chunksSortMode: 'none'
    })
  ]
}

/*
配置开发时用的服务器，让你可以用 http://127.0.0.1:8080/ 这样的 url 打开页面来调试
并且带有热更新的功能，打代码时保存一下文件，浏览器会自动刷新。比 nginx 方便很多
如果是修改 css, 甚至不需要刷新页面，直接生效。这让像弹框这种需要点击交互后才会出来的东西调试起来方便很多。

因为 webpack-cli 无法正确识别 serve 选项，使用 webpack-cli 执行打包时会报错。
因此我们在这里判断一下，仅当使用 webpack-serve 时插入 serve 选项。
issue：https://github.com/webpack-contrib/webpack-serve/issues/19
*/
if (dev) {
  module.exports.serve = {
    // 配置监听端口，默认值 8080
    port: 8080,

    // add: 用来给服务器的 koa 实例注入 middleware 增加功能
    add: app => {
      /*
      配置 SPA 入口

      SPA 的入口是一个统一的 html 文件，比如
      http://localhost:8080/foo
      我们要返回给它
      http://localhost:8080/index.html
      这个文件
      */
      app.use(convert(history()))
    }
  }
}
```

### 执行webpack

```javascript
//开发环境
node_modules\.bin\webpack-serve webpack.config.js
或者
./node_modules/.bin/webpack-serve webpack.config.js
```

```javascript
//生产环境
./node_modules/.bin/webpack-cli
```

> 使用Npm,在packge.json

```javascript
{
  "scripts": {
    "dev": "webpack-serve webpack.config.js",
    "build": "webpack-cli"
  }
}
```

### 运行流程

> 1. 启动构建，读取并合并配置指令，加载plugin，实例化compile
> 2. 从入口文件出发，针对每个module进行相对应的loader编译，用递归对依赖文件也进行同样的操作，直到执行完入口文件
> 3. 将编译后的module组成chunk，chunk转成文件，文件写入系统

### 热更新（HMR）

#### 	原理

> 1. webpack和文件系统建立监听，当修改文件时webpack会通知webpack-dev-serve
> 2. webpack-dev-serve和文件系统建立监听，此次监听只是live reload（刷新浏览器）
> 3. webpack-dev-serve通过sockJS和浏览器建立socket长链接，并传递最新的模块hash值
> 4. webpack/hot/dev-serve根据webpack-dev-serve/client所传递的hash值和webpack-dev-serve配置来决定是否热更新或者刷新浏览器
> 5. HotModuleReplacement.runtime接收传递过来的hash值，通过JsonpMainTemplate.runtime来向serve端发送请求，服务端返回一个json，里面包含更新的模块hashList，HMR拿到后再次请求获得最新代码
> 6. HMR会对新旧模块进行对比，决定更新后，会更新模块之间的关系依赖
> 7. HMR失败后，会回到第二步骤，执行live reload
>
> 

> 使用`babel` 的 `plugins` [babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node)。

```javascript
//首先在package.json中增加BABEL_ENV
"dev": "BABEL_ENV=development webpack-dev-server XXXX"
```

接着在`.babelrc`只能加入`babel-plugin-dynamic-import-node`这个`plugins`，并让它只有在`development`模式中才生效。

```javascript
{
  "env": {
    "development": {
      "plugins": ["dynamic-import-node"]
    }
  }
}
```

### loader工作原理

#### 	1.1 拿less-loader举例

> 1. 遇见相关模块文件时出发loader
> 2. 接受模块文件的source
> 3. 使用自身的render方法，渲染source，并且返回一个result
> 4. 将result返回或者传递给下一个loader

### 常用的plugin

#### 	1.1 html—webpack—plugin

> 1. 创建HTML页面文件到输出的目录
> 2. 将webpack打包后的chunck引入到HTML里面

#### 	1.2 DefinePlugin

> 1. 定义全局变量

### 自定义一个插件

> 1. 创建一个js命名函数
> 2. 给命名函数的prototype一个apply方法，里面有个compile参数
> 3. 调用complie参数的plugin，挂载到webpack本身的钩子
> 4. 处理webpack内部实例的特定数据
> 5. 功能完成后调用webpack回调

## webpack+TS

[保姆级教程：从零搭建 Webpack5+ts+Vue3 开发环境 - 掘金 (juejin.cn)](https://juejin.cn/post/6979478474620665887#heading-16)
