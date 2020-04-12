import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    landed: false,
  },
  mutations: {
    userLanded(state) { // 关闭 Overlay 之后更新这一状态。
      state.landed = true;
    },
    initLandingState(state, payload) {
      state.landed = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
