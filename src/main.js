import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VI18NOptions from './vue-i18n';

import {MainConfig} from './config/config'

// 导入 Vue-Cesium 库；
import VueCesium from 'vue-cesium';
// 在 Vue 中声明要使用这个库。
Vue.use(VueCesium, {
  cesiumPath: 'https://cdn.jsdelivr.net/npm/cesium@1.70.0/Build/Cesium/Cesium.js',
  accessToken: MainConfig.cesiumAccessToken,
});

Vue.config.productionTip = false

let root = new Vue({
  router,
  store,
  vuetify,
  i18n: VI18NOptions,
  render: h => h(App), // 等效于 createElement: createElement(App),
});

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.addEventListener('message', (msg) => {
//     console.log(msg);
//     if (msg.data.type == 'updateAvaliable') {
//       store.commit('updateAvaliable');
//       console.log('Should update!');
//     }
//   })
// }

root.$vuetify.theme.dark = true;

store.commit('darkMode', true);
root.$mount('#app');