<template>
  <v-container class="bottom-absolute">
    <v-card>
      <v-expand-transition>
        <SearchResultList
          :data="result"
          :state="searchState"
          v-show="showResult && textInput != ''"
        ></SearchResultList>
      </v-expand-transition>

      <v-toolbar dense bottom>
          <v-menu offset-y transition="v-slide-y-transition">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-avatar color="indigo" size="36">
                  <p v-if="!userInfo.avatar_url">DC</p>
                  <v-img :src="userInfo.avatar_url"></v-img>
                </v-avatar>
              </v-btn>
            </template>
            <v-card>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar size="64">
                    <img :src="userInfo.avatar_url" height="64" width="64" />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{userInfo.name}}</v-list-item-title>
                    <v-list-item-subtitle>{{userInfo.id}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="error" text>{{$t('toolbar.log_out')}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

        <v-text-field
          hide-details
          prepend-inner-icon="mdi-magnify"
          single-line
          clearable
          dark
          v-model="textInput"
          :label="$t('toolbar.search')"
          @focus="showResult = true"
          @blur="showResult = false"
        ></v-text-field>

        <!-- 暂时不要显示它 -->
        <v-btn @click="btnClicked" icon v-if="false">
          <v-icon>{{iconText}}</v-icon>
        </v-btn>
        <v-btn @click="goHome" icon>
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list min-width="120">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title><v-checkbox v-model="show3D" color="primary" :label="$t('toolbar.menu.show3d')" /></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="1">
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

<script>
import lodash from "lodash";
import Axios from "axios";
import SearchResultList from "./SearchResultList";
import { mapState } from "vuex";

export const States = {
  STOPPED: 0, // 未开始
  RUNNING: 1, // 已在运行
  ERROR: 2, // 出错
  PAUSED: 3, // 已被暂停
  PENDING: 4 // 正在等待返回
};

export default {
  data() {
    return {
      count: 0,
      iconText: "mdi-crosshairs-gps",
      textInput: "",
      result: [],
      showResult: false,
      searchState: 0,
      show3D: false // 我们默认不开这个。
    };
  },
  computed: {
    ...mapState({
      wxReady: state => state.wx.wxState == 0,
      userInfo: state => state.wx.userInfo
    })
  },
  props: {
    state: {
      required: true,
      type: Number
    }
  },
  created() {
    this.intervalID = undefined;
    // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
    // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
    // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
    // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
    // 请参考：https://lodash.com/docs#debounce
    this.debouncedGetEntries = lodash.debounce(this.searchQuery, 1500);
    this.$store.commit("updateInfo", {
      // Some fake user info.
      name: "DaChuang User",
      id: "daxueshengchaungye!",
      avatar_url:
        "https://gitlab.com/uploads/-/system/user/avatar/615016/avatar.png"
    });
  },
  methods: {
    start() {
      if (this.intervalID == undefined) {
        this.intervalID = setInterval(() => {
          this.count++;
          if (this.count % 2 == 0) {
            this.iconText = "mdi-crosshairs";
          } else {
            this.iconText = "mdi-crosshairs-gps";
          }
        }, 500);
      }
    },
    stop() {
      if (this.intervalID) {
        clearInterval(this.intervalID);
        this.intervalID = undefined;
      }
      this.iconText = "mdi-crosshairs-gps";
    },
    error() {
      this.stop();
      this.iconText = "mdi-error";
    },
    btnClicked() {
      this.$emit("locBtnClick");
    },
    searchQuery() {
      if (this.textInput !== "") {
        var vm = this;
        Axios.get("/api/search", {
          params: {
            name: this.textInput
          }
        })
          .then(ret => {
            let data = ret.data;
            console.log("search returned", data);
            vm.searchState = 0;
            vm.result = data;
          })
          .catch(reason => {
            console.log(reason);
            vm.searchState = 1;
          });
      }
    },
    goHome() {
      console.log("goHome");
      this.$emit("goHome");
    },
  },
  watch: {
    // 当 State 发生改变时被调用。
    // state: function(newV) {
    //   console.log(this);
    //   switch (newV) {
    //     case States.RUNNING:
    //       console.log(this);
    //       this.start();
    //       break;
    //     case States.STOPPED:
    //       this.stop();
    //       break;
    //     case States.ERROR:
    //       this.error();
    //       break;
    //     case States.PAUSED:
    //       this.stop();
    //       break;
    //     default:
    //       throw new RangeError("Unexpected state of FAB.");
    //   }
    // },
    textInput: function(newVal) {
      if (newVal !== "") {
        this.debouncedGetEntries();
      }
    },
    show3D: function(newVal) {
      this.$emit('show3DToggled', newVal);
    }
  },
  components: {
    SearchResultList
  }
};
</script>

<style>
div.bottom-absolute {
  position: absolute;
  display: flex;
  bottom: 0;
  left: 0;
}
</style>