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
          id: 'vue',
          assets: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
          global: 'Vue'
        },
        {
          id: 'vuetify',
          assets: [
            'https://cdn.jsdelivr.net/npm/vuetify@2.2.28/dist/vuetify.min.js',
            'https://cdn.jsdelivr.net/npm/vuetify@2.2.28/dist/vuetify.min.css'
          ],
        },
        {
          id: 'axios',
          assets: 'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
          global: 'axios'
        },
        {
          id: 'vuex',
          assets: 'https://cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js'
        }
        
      ]
    }
  },
  
}
