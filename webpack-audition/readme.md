# webpack-audition
- webpack是打包的不二选择
- 每日必用，面试必考
- 成熟的工具，重点在于配置和使用，原理并不高优
## webpack5
- webpack5主要是内部效率的优化
- 对比webpack4，没有多大使用上的变化
  升级 webpack5 以及周边插件后，代码需要做出的调整：

- package.json 的 dev-server 命令改了 `"dev": "webpack serve --config build/webpack.dev.js",`
- 升级新版本 `const { merge } = require('webpack-merge')`
- 升级新版本  `const { CleanWebpackPlugin } = require('clean-webpack-plugin')`
- `module.rules` 中 `loader: ['xxx-loader']` 换成 `use: ['xxx-loader']`
- `filename: 'bundle.[contenthash:8].js'` 其中 `h` 小写，不能大写
## webpack基本配置
- 拆分配置和merge，通过webpack-merge去合并
`const { merge } = require('webpack-merge')`
- 启动本地服务-需要安装webpack-dev-server
```js
devServer: {
    historyApiFallback: true,
    contentBase: distPath,
    open: true,
    compress: true,
    hot: true,
    port: 8080,

    // 设置代理 —— 如果有需要的话！
    proxy: {
      // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
      '/api': 'http://localhost:3000',

      // 将本地 /api2/xxx 代理到 localhost:3000/xxx
      '/api2': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '/api2': ''
        }
      }
    }
  }
```
然后要在package.json里配置
`"dev": "webpack serve --config build/webpack.dev.js",`
- 处理es6-记得配置babel
```js
{
  test: /\.js$/,
  use: ['babel-loader'],
  include: srcPath,
  exclude: /node_modules/
}
```
- 处理样式
```js
{
    test: /\.css$/,
    // loader 的执行顺序是：从后往前
    use: ['style-loader', 'css-loader', 'postcss-loader'] // 加了 postcss
},
{
    test: /\.less$/,
    // 增加 'less-loader' ，注意顺序
    use: ['style-loader', 'css-loader', 'less-loader']
}
```
- 处理图片
```js
// 本地直接引入图片 url
{
    test: /\.(png|jpg|jpeg|gif)$/,
    use: 'file-loader'
}

// 线上 - 考虑 base64 编码的情况
{
  test: /\.(png|jpg|jpeg|gif)$/,
  use: {
    loader: 'url-loader', 
    options: {
      // 小于 5kb 的图片用 base64 格式产出
      // 否则，依然延用 file-loader 的形式，产出 url 格式
      limit: 5 * 1024,
    
      // 打包到 img 目录下
      outputPath: '/img1/',
  
      // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
      // publicPath: 'http://cdn.abc.com'
    }
  }
}
```
## webpack高级配置
- 多入口[build-multi-page]
- 抽离CSS[build-min-extract-css]
```
MiniCssExtractPlugin.loader    
// 抽离 css 文件
  new MiniCssExtractPlugin({
  filename: 'css/[name].[contenthash:8].css'
  })
  
optimization: {
    // 压缩 css
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
}
```
- 抽离公共代码 [build-splitChunks]

```js
optimization:{
  // 分割代码块
  splitChunks: {
    chunks: 'all',
            /**
             * initial 入口 chunk，对于异步导入的文件不处理
             async 异步 chunk，只对异步导入的文件处理
             all 全部 chunk
             */

            // 缓存分组
            cacheGroups: {
      // 第三方模块
      vendor: {
        name: 'vendor', // chunk 名称
                priority: 1, // 权限更高，优先抽离，重要！！！
                test: /node_modules/,
                minSize: 0,  // 大小限制
                minChunks: 1  // 最少复用过几次
      },

      // 公共的模块
      common: {
        name: 'common', // chunk 名称
                priority: 0, // 优先级
                minSize: 0,  // 公共模块的大小限制
                minChunks: 2  // 公共模块最少复用过几次
      }
    }
  }
}

```
- webpack实现懒加载
`import('...').then(res=>{console.log(res)})`
- 处理jsx和vue
@babel/preset-react和vue-loader
## module chunk bundle的区别
- module: 各个源码文件，webpack中一切皆模块
- chunk: webpack分析过程中，通过入口文件，和依赖分析出的模块的集合，多模块合并成的，如entry，import(), splitChunk
- bundle: 最终的输出文件
## webpack性能优化
- 优化babel-loader
  1. 开启缓存`use:['babel-loader?cacheDirectory']`
  2. 通过include或exclude明确范围
- IgnorePlugin
  1. 避免引入无用模块
  `new webpack.IgnorePlugin(/\.\/loacle/, /moment/)`
- noParse
  1. 避免重复打包
  `module:{nopares: [/react\.min\.js$/]}`
- happyPack
  1. 多进程打包
  2. js是单线程的，开启多进程打包
```js
const HappyPack = require('happypack')
module: {
  rules: [
    {
      test: /\.js$/,
// 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
      use: ['happypack/loader?id=babel'],
      include: srcPath,
// exclude: /node_modules/
    }
  ],
  plugins: [
    // happyPack 开启多进程打包
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory']
    }),
  ]
}

```
- ParallelUglifyPlugin
  1. 多进程压缩
  2. webpack内置Uglify工具压缩js
```js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
plugins: [
  // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
  new ParallelUglifyPlugin({
    // 传递给 UglifyJS 的参数
    // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
    uglifyJS: {
      output: {
        beautify: false, // 最紧凑的输出
        comments: false, // 删除所有的注释
      },
      compress: {
        // 删除所有的 `console` 语句，可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      }
    }
  })
]
```
- 自动刷新
```js
module.export = {
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggreateTimeout: 300,
    poll: 1000
  }
}
```
- 热更新
  1. 自动刷新: 整个网页全部刷新，速度较慢，状态会丢失
  2. 热更新: 新代码生效，网页不刷新，状态不丢失
```js
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
entry: {
  // index: path.join(srcPath, 'index.js'),
  index: [
    'webpack-dev-server/client?http://localhost:8080/',
    'webpack/hot/dev-server',
    path.join(srcPath, 'index.js')
  ],
  other: path.join(srcPath, 'other.js')
}
plugins: [
  new HotModuleReplacementPlugin()
]

// // 增加，开启热更新之后的代码逻辑
// if (module.hot) {
//     module.hot.accept(['./math'], () => {
//         const sumRes = sum(10, 30)
//         console.log('sumRes in hot', sumRes)
//     })
// }

```
- DllPlugin
  1. 动态链接库插件
  2. webpack已经内置到了DllPlugin
  3. DllPlugin-打包出dll文件
  4. DllReferencePlugin-使用dll文件
- 产出代码
  1. 小图片base64编码
  2. bundle加hash
  3. 懒加载
  4. 提取公共代码
  5. IgnorePlugin
  6. 使用CDN加速
`publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名）`
  7. 使用production
    1) 自动开启代码压缩
    2) vue react会自动删掉调试代码
    3) 启动Tree-Shaking：就是把没用的函数不进行打包，必须用ES6 module才能使其生效
  8. Scope Hosting

## ES6 Module 和Commonjs的区别
1. 都是模块化的解决方式
2. ES6是静态引入，编译时引入
3. Commonjs动态引入，执行时引入
## Scope Hosting
1. 代码体积更小
2. 创建函数作用域更少
3. 代码可读性更好
`ModuleContenationPlugin`
## babel
+ 前端开发环境必备工具，使es6兼容不同浏览器
### babel-polyfill
regenerator和core-js的集合，新语法补丁集合，babel7.4之后被弃用
### babel-runtime
## webpack面试真题
1. 前端为什么要进行打包和构建
  + 体积更小，加载更快
  + 编译高级语言或语法
  + 兼容性和错误检查
  + 统一，高效的开发环境
  + 统一的构建流程和产出标准
  + 集成公司构建规范
## 常见的loader和plugin
  + 官网有
## bebel和webpack的区别
  + babel是js新语法的编译工具，不关心模块化
  + webpack是打包构建工具，十多个loader plugin的集合
## 如何产出一个lib
  + output内添加library属性