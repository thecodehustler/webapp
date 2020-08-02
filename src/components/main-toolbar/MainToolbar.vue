<template>
  <v-container class="bottom-absolute">
    <v-row dense class="flex-wrap-reverse">
      <v-col class="flex-shrink-0 flex-grow-1">
        <v-card id="main-toolbar-container" v-click-outside="onClickOutside" max-width="500">
          <v-expand-transition>
            <SearchResultList
                :data="searchResult"
                :state="searchState"
                v-show="showResultPanel && textInput !== ''"
                @selected="selected"
            ></SearchResultList>
          </v-expand-transition>

          <v-toolbar dense bottom ref="main-toolbar">
            <v-menu
                top
                :offset-y="offsetY"
                max-height="500"
                transition="slide-y-reverse-transition"
                :close-on-content-click="closeOnContentClick"
                attach="#main-toolbar-container"
            >
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" v-show="wxReady || fake">
                  <v-avatar color="grey" size="36">
                    <span v-if="!userInfo.avatar_url" class="white--text headline">{{ avatarAlt }}</span>
                    <v-img :src="userInfo.avatar_url"></v-img>
                  </v-avatar>
                </v-btn>
              </template>

              <UserInfoCard></UserInfoCard>
            </v-menu>

            <v-text-field
                hide-details
                prepend-inner-icon="mdi-magnify"
                single-line
                clearable
                dark
                v-model="textInput"
                :label="$t('toolbar.search')"
                @focus="showResultPanel = true"
            ></v-text-field>

            <!-- 暂时不要显示它 -->
            <v-btn @click="goHome" icon>
              <v-icon>mdi-home</v-icon>
            </v-btn>
            <!-- 三点菜单 -->
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list min-width="150" width="250">
                <v-list-item @click.native.prevent="" class="py-0">
                  <v-list-item-icon>
                    <v-icon>mdi-translate</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <LangSelect></LangSelect>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item three-line @click.stop="show3D = !show3D">
                  <v-list-item-action>
                    <v-checkbox v-model="show3D" color="primary" @click="show3D = !show3D"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t('toolbar.menu.show3d') }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon small>mdi-alert</v-icon>
                      {{ $t('toolbar.menu.show3dHint') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click.native.stop="" :ripple="1===0">
                  <v-container class="pa-0 ma-0">
                    <v-row>
                      <v-col class="justify-center d-flex pa-0 ma-0" @click="openAboutDialog">
                        <v-btn text>
                          <v-icon>mdi-information</v-icon>
                          <span class="pl-1">{{ $t('toolbar.menu.about') }}</span>
                        </v-btn>
                      </v-col>
                      <!-- <v-col class="justify-center d-flex pa-0 ma-0"> -->
                      <v-divider vertical class="d-flex"></v-divider>
                      <!-- </v-col> -->
                      <v-col class="justify-center d-flex pa-0 ma-0">
                        <ThemeAdjustButton>
                          <span class="pl-1">{{ themeText }}</span>
                        </ThemeAdjustButton>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item
                    href="https://uni-inno-webapp.top/code-server/"
                    color="success"
                    title="Try this out! My code server!"
                    target="_blank"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-microsoft-visual-studio-code</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Try this out!</v-list-item-title>
                    <v-list-item-subtitle>My Code Server!</v-list-item-subtitle>
                    <span>
                  <v-chip label title="Promotion (迫真)" disabled x-small>Promotion</v-chip>
                </span>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col class="flex-shrink-1 flex-grow-0 justify-end align-self-start ml-auto">
        <transition name="v-loading-button">
          <v-btn fab :loading="true" small :class="{'v-loading-button-enter': !isLoading, 'v-loading-button-enter-active': isLoading, 'v-loading-button-leave-active': !isLoading}"></v-btn>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {debouncedSearch, SearchState} from "@/commons/landmark-search";

import LangSelect from "../../components/lang-select/LangSelect.vue";
import SearchResultList from "./SearchResultList.vue";
import UserInfoCard from "./UserInfoCard.vue";
import ThemeAdjustButton from "../../components/theme-adjust-button/ThemeAdjustButton.vue";

import {Component, Emit, Prop, Vue, Watch} from "vue-property-decorator";
import {Mutation, namespace, State} from "vuex-class";

import {wxSettings} from "@/config/config";
import {AxiosResponse} from "axios";
import {ThemeOption} from "@/store/module-settings";

const settings = namespace("settings");

@Component({
  components: {
    LangSelect,
    SearchResultList,
    UserInfoCard,
    ThemeAdjustButton,
  },
})
export default class MainToolbar extends Vue {
  keep = true;
  offsetY = true;
  closeOnContentClick = false;

  // 搜索相关
  debouncedGetSearchResultEntries = debouncedSearch();

  searchState = SearchState.PENDING;
  textInput = "";
  searchResult = [];
  showResultPanel = false;

  @Watch("textInput") onTextInput(newVal: string) {
    if (newVal) {
      newVal = newVal.trim();
      if (newVal !== "") {
        this.showResultPanel = true;
        this.searchResult = [];
        this.searchState = SearchState.ONGOING;
        this.debouncedGetSearchResultEntries(newVal)
            .then((ret: AxiosResponse) => {
              this.searchResult = ret.data;
              this.searchState = SearchState.PENDING;
            })
            .catch((reason: Error) => {
              console.warn(reason);
              this.searchState = SearchState.ERROR;
            });
      } else {
        this.showResultPanel = false;
      }
    } else {
      this.showResultPanel = false;
    }
  }

  onClickOutside() {
    this.showResultPanel = false;
  }

  selected() {
    this.textInput = "";
  }

  // 从 Vuex 传来的微信相关数据。
  @State((state) => state.wx.wxState == 0) wxReady!: boolean;
  @State((state) => (state.wx.useFake ? state.wx.localFake : state.wx.userInfo))
  userInfo !: any;
  @State((state) => state.wx.useFake) fake!: boolean;
  @Mutation("updateFake") updateFakeInformation!: Function;

  created() {
    this.updateFakeInformation(wxSettings.fakeUserInfo);
    console.log(this.wxReady);
  }

  get avatarAlt() {
    const text = "";
    if (this.userInfo.name) {
      const arr = this.userInfo.name.split(" ");
      text.concat(arr[0].charAt(0));
      if (arr.length > 1) {
        text.concat(arr[arr.length - 1].charAt(0));
      }
    }
    return text;
  }

  // 栏上的按钮们的回调和相关的数据。
  show3D = false;
  @Mutation("toggle3DBuildings") toggleBuildings!: Function;

  @Watch("show3D") toggle(newVal: boolean) {
    this.toggleBuildings(newVal);
  }

  @Emit("goHome") goHome() {
    console.log('goHome emitted.');
  }

  openAboutDialog() {
    this.$router.push("/about");
  }

  // 界面主题相关。
  @settings.State theme!: ThemeOption;

  get themeText() {
    switch (this.theme) {
      case ThemeOption.FOLLOW:
        return this.$t("settings.themeOptions.follow");
      case ThemeOption.LIGHT:
        return this.$t("settings.themeOptions.light");
      case ThemeOption.DARK:
        return this.$t("settings.themeOptions.dark");
      default:
        return "¯\\_(ツ)_/¯";
    }
  }

  showButton = true;
  @Prop({required: true, type: Boolean}) isLoading !: boolean;
}

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

<style lang="scss">
div.bottom-absolute {
  position: absolute;
  display: flex;
  bottom: 0;
  left: 0;
  width: 100%;
}
/* Animations */
.v-loading-button-enter, .v-loading-button-leave-to {
  transform: translateX(250px);
}

.v-loading-button-enter-active {
  transition: all 0.25s ease;
}

.v-loading-button-leave-active {
  transition: all 0.25s ease;
}
</style>