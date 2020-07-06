const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const GitRevision = require('git-revision-webpack-plugin');
// const { default: router } = require('./src/router');

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
        target: 'http://localhost:80',
        ws: true,
        changeOrigin: true,
      },
      '/wx': {
        target: 'http://localhost:80',
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
      let a = new Date();
      args[0]["MY_APP_VERSION"] = JSON.stringify(`${a.getFullYear() % 1000 * 10000 + (a.getMonth() + 1) * 100 + a.getDate()}@${new GitRevision().version()}`);
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
      common: [
        {
          id: 'weixin-js-sdk',
          assets: 'https://cdn.jsdelivr.net/npm/weixin-js-sdk@1.6.0/index.original.js',
          global: 'jWeixin'
        },
        {
          id: 'vue',
          assets: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.runtime.min.js',
          global: 'Vue'
        },
        {
          id: 'vue-router',
          assets: 'https://cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
          global: 'VueRouter'
        },
        {
          id: 'vuex',
          assets: 'https://cdn.jsdelivr.net/npm/vuex@3.5.1/dist/vuex.min.js',
          global: 'Vuex'
        },
        {
          id: 'vue-i18n',
          assets: 'https://cdn.jsdelivr.net/npm/vue-i18n@8.18.2/dist/vue-i18n.min.js',
          global: 'VueI18n'
        },
        {
          id: 'vue-cesium',
          assets: 'https://cdn.jsdelivr.net/npm/vue-cesium@2.1.4/lib/index.umd.min.js',
          global: 'VueCesium'
        },
        {
          id: 'lodash',
          assets: 'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js',
          global: '_'
        },


        {
          id: 'axios',
          assets: 'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
          global: 'axios'
        },
      ]
    }
  }
}
