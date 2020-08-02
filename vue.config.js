/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const externalsCommon = require('./webpack.externals').default;

module.exports = {
  "transpileDependencies": [
    "vuetify",

  ],
  // 生产模式下关闭 SourceMap。
  productionSourceMap: false,
  css: {
    sourceMap: false,
  },

  pwa: {
    workboxOptions: {
      cleanupOutdatedCaches: true
    },
    name: '天空旅行团'
  },

  devServer: {
    // devServer 这段将向以下两个 URL 的请求导向 80 端口。
    proxy: {
      '/api': {
        target: 'https://uni-inno-webapp.top',
        ws: true,
        changeOrigin: true,
      },
      '/wx': {
        target: 'https://uni-inno-webapp.top',
        ws: true,
        changeOrigin: true,
      }
    }
  },

  "configureWebpack": {
    resolve: {
      alias: {
        SRC: path.resolve(__dirname, 'src/')
      }
    },
    devtool: 'source-map', // 在热重载环境下向浏览器提供 SourceMap，以便调试。
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            parallel: true,
            compress: {
              // warnings: false,
              drop_console: true, // 干掉所有的 console.*
              drop_debugger: true,
              unused: true,
              // pure_funcs: ['console.log', 'console.warn', 'console.error'] //移除console系列函数。
            },
            output: {
              comments: false // 干掉最终生成代码中的一切注释。
            }
          }
        })
      ]
    },
  },

  chainWebpack: config => {
    // 添加全局变量。这些变量仅在构建环境中可用。
    config.plugin('define').tap(args => {
      const Vars = require('./webpack.global.vars.js');
      Object.assign(args[0], Vars.VARS);
      return args;
    })
  },

  lintOnSave: false,

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/'
      ],
      useRenderEvent: true,
      headless: true,
      onlyProduction: true
    },
    externals: {
      common: externalsCommon
    }
  }
}
