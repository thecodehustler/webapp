const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const PrerenderSPAPlugin = require('prerender-spa-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

module.exports = {
  "transpileDependencies": [
    "vuetify",
  ],

  // crossorigin: 'anonymous',
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
    pluginOptions: {
      prerenderSpa: {
        registry: undefined,
        renderRoutes: [
          '/',
        ],
        useRenderEvent: true,
        onlyProduction: true,
   
        headless: false, // <- this could also be inside the customRendererConfig
        customRendererConfig:
        {
          args: ["--auto-open-devtools-for-tabs"]
        }
      }
    }
    // productionGzip: true,
    // productionGzipExtensions: ['js', 'css'],

    
  },

  // chainWebpack: () => {
  //   if (process.env.NODE_ENV !== 'production') return;
  //   return {
  //     plugins: [
  //       new CompressionPlugin({
  //         filename: "[path].gz[query]",
  //         test: /\.js$|\.html$|\.css$/,    //压缩 js 与 css
  //         algorithm: 'gzip',
  //         threshold: 10240,
  //         minRatio: 0.8
  //       }),
  //       new PrerenderSPAPlugin({
  //         // 生成文件的路径，也可以与webpakc打包的一致。
  //         // 下面这句话非常重要！！！
  //         // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
  //         staticDir: path.join(__dirname, 'dist'),
  //         // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
  //         routes: ['/'],
  //         // 这个很重要，如果没有配置这段，也不会进行预编译
  //         renderer: new Renderer({
  //           inject: {
  //             foo: 'bar'
  //           },
  //           headless: false,
  //           // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
  //           renderAfterDocumentEvent: 'x-render-event'
  //         })
  //       })
  //     ],
  //   };
  // },

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
      useRenderEvent: true,
      headless: true,
      onlyProduction: true
    }
  }
}
