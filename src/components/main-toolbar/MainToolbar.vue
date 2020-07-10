<template>
  <v-container class="bottom-absolute" max-width="730" >
    <v-card id="main-toolbar-container">
      <v-toolbar dense bottom ref="main-toolbar">
        <v-menu
          top
          :offset-y="offsetY"
          max-height="480"
          transition="slide-y-reverse-transition"
          :close-on-content-click="closeOnContentClick"
          attach="#main-toolbar-container"
        >
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" v-show="wxReady || fake">
              <v-avatar color="grey" size="36">
                <span v-if="!userInfo.avatar_url" class="white--text headline">{{avatarAlt}}</span>
                <v-img :src="userInfo.avatar_url"></v-img>
              </v-avatar>
            </v-btn>
          </template>

          <UserInfoCard></UserInfoCard>
        </v-menu>

        <!-- <v-text-field
          hide-details
          prepend-inner-icon="mdi-magnify"
          single-line
          clearable
          dark
          v-model="textInput"
          :label="$t('toolbar.search')"
          @focus="showResult = true"
        ></v-text-field> -->
        <AutoCompleteSearch></AutoCompleteSearch>

        <!-- 暂时不要显示它 -->
        <!-- <v-btn @click="btnClicked" icon v-if="false">
          <v-icon>{{iconText}}</v-icon>
        </v-btn>-->
        <v-btn @click="goHome" icon>
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <!-- 三点菜单 -->
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list min-width="150" width="250">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-translate</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <LangSelect></LangSelect>
              </v-list-item-content>
            </v-list-item>
            <v-list-item three-line @click.stop="show3D = !show3D">
              <!-- <template v-slot:default="{toggle}"> -->
              <v-list-item-action>
                <v-checkbox v-model="show3D" color="primary"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{$t('toolbar.menu.show3d')}}</v-list-item-title>
                <v-list-item-subtitle><v-icon small>mdi-alert</v-icon> {{$t('toolbar.menu.show3dHint')}}</v-list-item-subtitle>
              </v-list-item-content>
              <!-- </template> -->
            </v-list-item>
            <v-list-item @click="openAboutDialog">
              <v-list-item-icon>
                <v-icon>mdi-information</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{$t('toolbar.menu.about')}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-card>
  </v-container>
</template>

<script lang="ts">
enum SearchState {
  PENDING,
  ONGOING,
  ERROR
}
import lodash from "lodash";
import Axios from "axios";

import LangSelect from "../../components/lang-select/LangSelect.vue";
import SearchResultList from "./SearchResultList.vue";
import UserInfoCard from "./UserInfoCard.vue";
import AutoCompleteSearch from './AutoCompleteSearch.vue';

import { Vue, Component, Emit, Watch, Ref } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";

import { wxSettings } from "../../config/config";

@Component({
  components: {
    LangSelect,
    SearchResultList,
    UserInfoCard,
    AutoCompleteSearch
  }
})
export default class MainToolbar extends Vue {
  keep = true;
  offsetY = true;
  closeOnContentClick = false;

  // 搜索相关
  debouncesGetEntries = lodash.debounce(this.doSearchQuery, 500);

  searchState = SearchState.PENDING;
  textInput = "";
  searchResult = [];
  showResult = false;

  @Watch("textInput") onTextInput(newVal: string) {
    newVal = newVal.trim();
    if (newVal && newVal !== "") {
      this.showResult = true;
      this.debouncesGetEntries();
    } else {
      this.showResult = false;
    }
  }
  doSearchQuery() {
    if (this.textInput !== "") {
      this.searchState = SearchState.ONGOING;
      Axios.get("/api/search", {
        params: {
          name: this.textInput
        }
      })
        .then(ret => {
          let data = ret.data;
          this.searchResult = data;
        })
        .catch(reason => {
          console.warn(reason);
          this.searchState = SearchState.ERROR;
        });
    }
  }

  // 从 Vuex 传来的微信相关数据。
  @State(state => state.wx.wxState == 0) wxReady: boolean;
  @State(state => (state.wx.useFake ? state.wx.localFake : state.wx.userInfo))
  userInfo;
  @State(state => state.wx.useFake) fake: boolean;
  @Mutation("updateFake") updateFakeInformation;

  created() {
    this.updateFakeInformation(wxSettings.fakeUserInfo);
    console.log(this.wxReady);
  }
  get avatarAlt() {
    let text = "";
    if (this.userInfo.name) {
      let arr = this.userInfo.name.split(" ");
      text.concat(arr[0].charAt(0));
      if (arr.length > 1) {
        text.concat(arr[arr.length - 1].charAt(0));
      }
    }
    return text;
  }

  // 按钮们的回调和相关的数据。
  show3D = false;
  @Mutation("toggle3DBuildings") toggleBuildings;
  @Watch("show3D") toggle(newVal: boolean) {
    this.toggleBuildings(newVal);
  }

  @Emit("goHome") goHome() {}

  openAboutDialog() {
    this.$router.push("/about");
  }

  cardBlur() {
    this.showResult = false;
  }
}
// import lodash from "lodash";

// import { mapState } from "vuex";

// // export const States = {
// //   STOPPED: 0, // 未开始
// //   RUNNING: 1, // 已在运行
// //   ERROR: 2, // 出错
// //   PAUSED: 3, // 已被暂停
// //   PENDING: 4 // 正在等待返回
// // };

// export default {
//   data() {
//     return {
//       count: 0,
//       iconText: "mdi-crosshairs-gps",
//       textInput: "",
//       result: [],
//       // focusOnEdit: false,
//       // focusOnList: false,
//       showResult: false,
//       keep: true,
//       searchState: SearchStates.PENDING,
//       show3D: false, // 我们默认不开这个。
//     };
//   },
//   computed: {
//     ...mapState({
//       wxReady: state => state.wx.wxState == 0,
//       userInfo: state => {
//         if (state.wx.useFake) return state.wx.localFake;
//         return state.wx.userInfo;
//       },
//       fake: state => state.wx.useFake
//     }),
//     avatarAlt() {
//       let text = "";
//       if (this.userInfo.name) {
//         let arr = this.userInfo.name.split(" ");
//         text.concat(arr[0].charAt(0));
//         if (arr.length > 1) {
//           text.concat(arr[arr.length - 1].charAt(0));
//         }
//       }
//       return text;
//     },

//   },
//   props: {
//     // state: {
//     //   required: true,
//     //   type: Number
//     // }
//   },
//   created() {
//     // this.intervalID = undefined;
//     // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
//     // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
//     // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
//     // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
//     // 请参考：https://lodash.com/docs#debounce
//     this.debouncedGetEntries = lodash.debounce(this.searchQuery, 500);
//     this.$store.commit("updateFake", wxSettings.fakeUserInfo);
//   },
//   methods: {
//     // start() {
//     //   if (this.intervalID == undefined) {
//     //     this.intervalID = setInterval(() => {
//     //       this.count++;
//     //       if (this.count % 2 == 0) {
//     //         this.iconText = "mdi-crosshairs";
//     //       } else {
//     //         this.iconText = "mdi-crosshairs-gps";
//     //       }
//     //     }, 500);
//     //   }
//     // },
//     // stop() {
//     //   if (this.intervalID) {
//     //     clearInterval(this.intervalID);
//     //     this.intervalID = undefined;
//     //   }
//     //   this.iconText = "mdi-crosshairs-gps";
//     // },
//     // error() {
//     //   this.stop();
//     //   this.iconText = "mdi-error";
//     // },
//     // btnClicked() {
//     //   this.$emit("locBtnClick");
//     // },
//     searchQuery() {
//       if (this.textInput !== "") {
//         var vm = this;
//         this.searchState = 2; // Mark state as pending.
//         Axios.get("/api/search", {
//           params: {
//             name: this.textInput
//           }
//         })
//           .then(ret => {
//             let data = ret.data;
//             console.log("search returned", data);
//             vm.searchState = 0;
//             vm.result = data;
//           })
//           .catch(reason => {
//             console.log(reason);
//             vm.searchState = 1;
//           });
//       }
//     },
//     goHome() {
//       console.log("goHome");
//       this.$emit("goHome");
//     },
//     openAboutDialog() {
//       this.$router.push('/about');
//       // this.showAbout = true;
//     },
//     cardBlur() {
//       console.log('Card blur!');
//       this.showResult = false;
//     },
//     // alert(msg) {
//     //   alert(msg);
//     // }
//   },
//   watch: {
//     // 当 State 发生改变时被调用。
//     // state: function(newV) {
//     //   console.log(this);
//     //   switch (newV) {
//     //     case States.RUNNING:
//     //       console.log(this);
//     //       this.start();
//     //       break;
//     //     case States.STOPPED:
//     //       this.stop();
//     //       break;
//     //     case States.ERROR:
//     //       this.error();
//     //       break;
//     //     case States.PAUSED:
//     //       this.stop();
//     //       break;
//     //     default:
//     //       throw new RangeError("Unexpected state of FAB.");
//     //   }
//     // },
//     textInput: function(newVal) {
//       newVal = newVal.trim();
//       if (newVal && newVal !== "") {
//         this.showResult = true;
//         this.debouncedGetEntries();
//       } else {
//         this.showResult = false;
//       }
//     },
//     show3D: function(newVal) {
//       this.$store.commit("toggle3DBuildings", newVal);
//     }
//   },
//   components: {
//     SearchResultList,
//     UserInfoCard,
//     LangSelect
//   }
// };
</script>

<style>
div.bottom-absolute {
  position: absolute;
  display: flex;
  bottom: 0;
  left: 0;
}
</style>