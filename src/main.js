import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VI18NOptions from './vue-i18n';

// 导入 Vue-Cesium 库；
import VueCesium from 'vue-cesium';
// 在 Vue 中声明要使用这个库。
Vue.use(VueCesium, {
  // cesiumPath: './Cesium/Cesium.js',
  cesiumPath: 'https://cesium.com/downloads/cesiumjs/releases/1.68/Build/Cesium/Cesium.js',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjcxZDU2OS0zZThlLTQxMTYtYjE0Ny1jZjIyN2ZlYzRlYTEiLCJpZCI6MTc2ODksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzI1OTU5NDl9.3kZPuGydn6_Ffm6pewG2NbBeyYfTaA72Z3cT_gqGD_w',
});

Vue.config.productionTip = false

let root = new Vue({
  router,
  store,
  vuetify,
  i18n: VI18NOptions,
  render: h => h(App) // 等效于 createElement: createElement(App)
});

root.$vuetify.theme.dark = true;

store.commit('initLandingState', localStorage.getItem('landed') == 'true')
store.commit('darkMode', true);
root.$mount('#app');

let wx = require('./wx-js');