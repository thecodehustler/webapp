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
        target: 'https://uni-inno-webapp.top:443',
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
    devtool: 'source-map', // 调试用的选项
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              // warnings: false,
              drop_console: true,//console
              drop_debugger: true,
              unused: true,
              pure_funcs: ['console.log', 'console.warn', 'console.error']//移除console
            },
            output: {
              comments: false
            }
          }
        })
      ]
    },
  },

  chainWebpack: config => {
    // 添加全局变量。这些变量仅在构建环境中可用。
    config.plugin('define').tap(args => {
      // let a = new Date();
      const Vars = require('./webpack.global.vars.js');
      Object.assign(args[0], Vars.VARS);
      // args[0]["MY_APP_VERSION"] = JSON.stringify(`${a.getFullYear() % 1000 * 10000 + (a.getMonth() + 1) * 100 + a.getDate()}@${new GitRevision().version()}`);
      // args[0]['MY_APP_VERSION'] = `${a.getUTCFullYear() * 10000 + (a.getUTCMonth() + 1) * 100 + a.getUTCDate() + 1}@${new GitRevision().commithash()}`;
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
      headless: false,
      onlyProduction: true
    },
    externals: {
      common: externalsCommon
    }
  }
}
