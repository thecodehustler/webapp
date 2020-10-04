
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import modOverlay from './module-overlay';
import modWx from './module-wx';
import modSWS from './service-worker-state';
import modSettings from './module-settings';

export default new Vuex.Store({
  state: {
    landed: false,
    darkMode: false,
    loginInfo: {
      id: '',
      avatarURL: '',
      name: ''
    },
    show3DBuildings: false
  },
  mutations: {
    userLanded(state) { // 关闭 Overlay 之后更新这一状态。
      state.landed = true;
    },
    initLandingState(state, payload) {
      state.landed = payload;
    },
    toggle3DBuildings(state, option) {
      state.show3DBuildings = option;
    }
  },
  actions: {
  },
  modules: {
    overlay: modOverlay,
    wx: modWx,
    sw: modSWS,
    settings: modSettings,
  }
})
