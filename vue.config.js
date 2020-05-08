const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  "transpileDependencies": [
    "vuetify",
  ],

  crossorigin: 'anonymous',
  productionSourceMap: false,

  css: {
    sourceMap: false,
  },

  pwa: {
    workboxOptions: {
      cleanupOutdatedCaches: true, // 让 Workbox 尝试去清除过时的缓存。
    }
  },

  devServer: {
    proxy: {
      '/api': {
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
    // optimization: {
    //   minimizer: [
    //     new UglifyJsPlugin({
    //       uglifyOptions: {
    //         compress: {
    //           // warnings: false,
    //           drop_console: true,//console
    //           drop_debugger: false,
    //           pure_funcs: ['console.log']//移除console
    //         }
    //       }
    //   })
    // ]
    // }

  },

  // chainWebpack: config => {
  //   config.when(process.env.NODE_ENV === 'production', config => {
  //     config.entry('app').clear().add('./src/main-prod.js');

  //     let externals = {
  //       vue: "Vue",
  //       // axios: 'axios',
  //       vuetify: 'vuetify',
  //       'vue-router': 'VueRouter',
  //       'vuex': 'Vuex',
  //       'lodash': 'LoDash',
  //       'vue-cesium': 'VueCesium'
  //     };
  //     config.externals(externals);
  //     const cdn = {
  //       css: [
  //       ],
  //       js: [
  //         'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js', //Vue
  //         'https://cdn.jsdelivr.net/npm/vue-router@3.1.6/dist/vue-router.min.js', // Router
  //         'https://cdn.jsdelivr.net/npm/vuetify@2.2.26/dist/vuetify.min.js', //Vuetify
  //         'https://cdn.jsdelivr.net/npm/vue-cesium@2.1.0/lib/index.umd.js' // VueCesium
  //         'https://cdn.jsdelivr.net/npm/vuex@3.3.0/dist/vuex.min.js', // vuex
  //         // 'https://cdn.jsdelivr.net/npm/axios@0.19.2/index.min.js', //axios
  //         'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js', // LoDash
  //       ]
  //     };
  //     config.plugin('html')
  //       .tap(args => {
  //         args[0].cdn = cdn
  //         return args
  //       });
  //   });
  //   config.when(process.env.NODE_ENV === 'development', config => {
  //   });

  // },

  lintOnSave: false,

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: [
        '/'
      ],
      useRenderEvent: false,
      headless: false,
      onlyProduction: true
    }
  }
}
