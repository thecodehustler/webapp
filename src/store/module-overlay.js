import axios from 'axios';

const mod = {
  state: {
    open: false,
    overlay: { // 只应由相关组件内部读取。其他地方不要碰这个。
      loading: false, // 组件是否呈现正在载入的样子。
      errorReason: 0, // 错误原因。
      data: {},
      contentReady: false
    }
  },
  mutations: {
    open(state) {
      state.open = true;
    },
    close(state) {
      state.open = false;
    },
    updateErrorReason(state, reason) {
      state.overlay.errorReason = reason;
    },
    startLoading(state) {
      state.overlay.errorReason = 0; // 重设错误。
      state.overlay.loading = true;
      state.overlay.contentReady = false;
    },
    stopLoading(state) {
      state.overlay.loading = false;
    },
    updateData(state, data) {
      if (data.head_image_url == null) {
        data.head_image_url = '';
      }
      state.overlay.data = data
    },
    markAsReady(state) {
      state.overlay.contentReady = true;
    },
  },
  actions: {
    loadFromURL({ commit }, url) { //
      /**
       *  从一个 URL 请求内容。
       *  请求完之后把数据填充进去。
       */
      let errorReason = 0;
      let data = {};
      commit('open'); // 打开面板
      commit('startLoading');
      axios
        .get(url)
        .then(value => { // 有数据
          console.log("Got data,", value);
          if (value.data.landmark_id) { // 正确的数据
            data = value.data;
            commit('markAsReady'); // 只有在数据正确的时候才标注为Ready。
          } else {
            errorReason = 2; // 项目不存在
            console.log('Error: 2');
          }
        })
        .catch(reason => {
          console.log(reason);
          if (!reason.status) { // network error
            errorReason = 1;
          } else {
            switch (reason.status) {
              case 500: 
              errorReason = 3; // 内部错误
            }
          }
        })
        .finally(() => {
          commit('stopLoading');
          commit('updateErrorReason', errorReason);
          commit('updateData', data);
        });
    },
    loadLocalContent({commit}, data) {
      commit('markAsReady');
      commit('updateErrorReason', 0);
      commit('updateData', data);
      commit('open');
    }
  },
}

export default mod;