import axios from 'axios';

import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";

export enum ErrorReason {
  SUCCESS,
  NETWORK_ERROR,
  ITEM_DOESNT_EXIST,
  INTERNAL_ERROR
}
@Module({namespaced: true})
export default class ModuleOverlay extends VuexModule {
  open = false;
  overlay = { // 只应由相关组件内部读取。其他地方不要碰这个。
    loading: false, // 组件是否呈现正在载入的样子。
    errorReason: 0, // 错误原因。
    data: {},
    contentReady: false
  }

  @Mutation openPanel() {
    this.open = true;
  }

  @Mutation close() {
    this.open = false;
  }

  @Action({commit: 'close'})
  closePanel() {
    return false;
    // this.open = false;
  }
  @Mutation updateErrorReason(reason: ErrorReason) {
    this.overlay.errorReason = reason;
  }

  @Mutation startLoading() {
    this.overlay.errorReason = ErrorReason.SUCCESS;
          this.overlay.loading = true;
      this.overlay.contentReady = false;
  }

  @Mutation stopLoading() {
    this.overlay.loading = false;
  }
  @Mutation updateData(data: any) {
    if (data.head_image_url == null) {
        data.head_image_url = ' '; // 传一个无用的数据，强迫 IMG 刷新。
        // SB Vuetify 是你逼我的。
      }
      this.overlay.data = data
  }
  @Mutation markAsReady() {
    this.overlay.contentReady = true;
  }

  /**
   *  从一个 URL 请求内容。
   *  请求完之后把数据填充进去。
   */
  @Action loadFromURL(url: string) {
      let errorReason: ErrorReason = ErrorReason.SUCCESS;
      // this.updateData({});
      this.context.commit('updateData', {}); // 清空之前的数据
      let data = {};
      this.context.commit('openPanel');
      // this.startLoading();
      this.context.commit('startLoading');
      // commit('open'); // 打开面板
      // commit('startLoading');
      axios
        .get(url)
        .then(value => { // 有数据
          console.log("Got data,", value);
          if (value.data.landmark_id) { // 正确的数据
            data = value.data;
            this.context.commit('markAsReady'); // 只有在数据正确的时候才标注为Ready。
          } else {
            errorReason = ErrorReason.ITEM_DOESNT_EXIST; // 项目不存在
            // console.log('Error: 2');
          }
        })
        .catch(reason => {
          console.log(reason);
          if (!reason.status) { // network error
            errorReason = ErrorReason.NETWORK_ERROR;
          } else {
            switch (reason.status) {
              case 500:
              errorReason = ErrorReason.INTERNAL_ERROR; // 内部错误
            }
          }
        })
        .finally(() => {
          this.context.commit('stopLoading');
          // this.stopLoading();
          // this.updateErrorReasons(errorReason);
          // this.updateData(data);
          this.context.commit('updateErrorReason', errorReason);
          this.context.commit('updateData', data);
        });
  }

  @Action loadLocalContent(data: any) {
    this.context.commit('markAsReady');
    // this.markAsReady();
    this.context.commit('updateErrorReason', ErrorReason.SUCCESS);
    // this.updateErrorReasons(ErrorReason.SUCCESS);
    this.context.commit('updateData', data);
    // this.updateData(data);
    // this.openPanel();
    this.context.commit('openPanel');
  }
}

// const mod = {
//   state: {
//     open: false,
//     overlay: { // 只应由相关组件内部读取。其他地方不要碰这个。
//       loading: false, // 组件是否呈现正在载入的样子。
//       errorReason: 0, // 错误原因。
//       data: {},
//       contentReady: false
//     }
//   },
//   mutations: {
//     open(state) {
//       state.open = true;
//     },
//     close(state) {
//       state.open = false;
//     },
//     updateErrorReason(state, reason) {
//       state.overlay.errorReason = reason;
//     },
//     startLoading(state) { // 让 UI 变为正在加载的状态。
//       state.overlay.errorReason = 0; // 重设错误。
//       state.overlay.loading = true;
//       state.overlay.contentReady = false;
//     },
//     stopLoading(state) {
//       state.overlay.loading = false;
//     },
//     updateData(state, data) {
//       if (data.head_image_url == null) {
//         data.head_image_url = ' '; // 传一个无用的数据，强迫 IMG 刷新。
//         // SB Vuetify 是你逼我的。
//       }
//       state.overlay.data = data
//     },
//     markAsReady(state) {
//       state.overlay.contentReady = true;
//     },
//   },
//   actions: {
//     loadFromURL({ commit }, url) { //
//       /**
//        *  从一个 URL 请求内容。
//        *  请求完之后把数据填充进去。
//        */
//       let errorReason = 0;
//       commit('updateData', {}); // 清空之前的数据
//       let data = {};
//       commit('open'); // 打开面板
//       commit('startLoading');
//       axios
//         .get(url)
//         .then(value => { // 有数据
//           console.log("Got data,", value);
//           if (value.data.landmark_id) { // 正确的数据
//             data = value.data;
//             commit('markAsReady'); // 只有在数据正确的时候才标注为Ready。
//           } else {
//             errorReason = 2; // 项目不存在
//             console.log('Error: 2');
//           }
//         })
//         .catch(reason => {
//           console.log(reason);
//           if (!reason.status) { // network error
//             errorReason = 1;
//           } else {
//             switch (reason.status) {
//               case 500:
//               errorReason = 3; // 内部错误
//             }
//           }
//         })
//         .finally(() => {
//           commit('stopLoading');
//           commit('updateErrorReason', errorReason);
//           commit('updateData', data);
//         });
//     },
//     loadLocalContent({commit}, data) {
//       commit('markAsReady');
//       commit('updateErrorReason', 0);
//       commit('updateData', data);
//       commit('open');
//     }
//   },
// }

// export default mod;