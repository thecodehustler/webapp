
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import modOverlay from './module-overlay';
import modWx from './module.wx';

export default new Vuex.Store({
  state: {
    landed: false,
    darkMode: false,
    loginInfo: {
      id: '',
      avatarURL: '',
      name: ''
    },
  },
  mutations: {
    userLanded(state) { // 关闭 Overlay 之后更新这一状态。
      state.landed = true;
    },
    initLandingState(state, payload) {
      state.landed = payload;
    },
    darkMode(state, payload) {
      state.darkMode = payload;
    },
    wxReady(state) {
      state.wx.ready = true;
    },
  },
  actions: {
  },
  modules: {
    overlay: modOverlay,
    wx: modWx
  }
})
