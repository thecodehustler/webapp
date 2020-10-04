import {Browser} from './commons/browser';
console.log(Browser);
if (!Browser.features.intersectionObserver) {
  import(/* webpackChunkName: "intersect-observer-polyfill" */ "intersection-observer").then(
    (object) => {
      console.log('polyfill loaded.', object);
      // object.prototype.POLL_INTERVAL = 200; // 配置这个 Polyfill 的检测间隔为 200 毫秒。
    }
  );
}

import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VI18NOptions from './vue-i18n/index';

// 导入 Vue-Cesium 库；
import VueCesium from 'vue-cesium';
// 在 Vue 中声明要使用这个库。
Vue.use(VueCesium, {
  cesiumPath: 'https://unpkg.com/cesium@1.73.0/Build/Cesium/Cesium.js',
  accessToken: VARS.CESIUM_ACCESS_TOKEN,
});

Vue.config.productionTip = false

console.log(VI18NOptions);
const root = new Vue({
  router,
  store,
  vuetify,
  i18n: VI18NOptions,
  render: h => h(App), // 等效于 createElement: createElement(App),
});
root.$mount('#app');