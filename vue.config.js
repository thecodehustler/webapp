const path = require('path');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  "configureWebpack": {
    resolve: {
      alias: {
        SRC: path.resolve(__dirname, 'src/')
      }
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vuetify: {
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
            chunks: 'all',
            priority: 1,
            filename: 'vuetify.js'
          },
          vue: {
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            chunks: "all",
            priority: 3,
            filename: 'vue.js'
          },
          vue_cesium: {
            test: /[\\/]node_modules[\\/]vue-cesium[\\/]/,
            chunks: "all",
            priority: 2,
            filename: 'vc.js'
          },
          views_landing: {
            test: /[\\/]src[\\/]views[\\/]landing[\\/]/,
            chunks: "all",
            priority: 4
          },
          chunk_commons: {
            test: /[\\/]src[\\/]commons[\\/]/,
            chunks: "all",
            priority: 0,
          }
        }
      }
    }
  },

  lintOnSave: false
}
