
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    landed: false,
    darkMode: false,
    loginInfo: {
      id: '',
      avatarURL: '',
      name: ''
    },
    wx: {
      ready: false,
    }
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
    userInfoObtained(state, payload) {

    }
  },
  actions: {
  },
  modules: {
  }
})
