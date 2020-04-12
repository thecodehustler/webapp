import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

// 导入 Vue-Cesium 库；
import VueCesium from 'vue-cesium';

Vue.config.productionTip = false

// 在 Vue 中声明要使用这个库。
Vue.use(VueCesium);

let root = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
});

store.commit('initLandingState', localStorage.getItem('landed') == 'true')

root.$mount('#app');