const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  pages: {
    index: {
      entry: './src/atom/index.js',
      template: './src/atom/index.html'
    },
    login: {
      entry: './src/login/login.js',
      template: './src/login/login.html'
    }
  },
  chainWebpack: config => {
    // 原来对于svg的处理设置不包括新的icon目录
    config.module
      .rule('svg')
      .exclude
      .add(resolve('src'))
    // config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
    //const svgRule = config.module.rule('svg')
    //svgRule.uses.clear()
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src')) //处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  configureWebpack: config => {
    // 性能检测，文件大小超过最大限制，会提示
    config.performance = {
      hints: false
    };
    config.resolve = {
      extensions: ['.js', '.vue', '.json', '.css', 'svg'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        '@echarts': resolve('src/atom')
      }
    };
    // 可视化性能分析
    if (process.env.SPE_ENV === 'analyz') {
      return {
        plugins: [
          // new CompressionPlugin({
          //   test: /\.js$|\.html$|\.css/,
          //   threshold: 10240,
          //   deleteOriginalAssets: false
          // }),
          new BundleAnalyzerPlugin()
        ]
      }
    }
  },
  productionSourceMap: false, // 开发环境是否生成sourcemap文件
  devServer: {
    port: 8008
  }
}