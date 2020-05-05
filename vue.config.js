const path = require('path');

module.exports = {
  "transpileDependencies": [
    "vuetify",
  ],

  crossorigin: 'anonymous',
  productionSourceMap: false,
  css: {
    sourceMap: false,
  }

  "configureWebpack": {
    resolve: {
      alias: {
        SRC: path.resolve(__dirname, 'src/')
      }
    },
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

  productionSourceMap: false
}
