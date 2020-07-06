<template>
  <v-container class="bottom-absolute" max-width="730">
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
            <v-btn icon v-on="on" v-show="wxReady || fake">
              <v-avatar color="grey" size="36">
                <span v-if="!userInfo.avatar_url" class="white--text headline">{{avatarAlt}}</span>
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
          @focus="showResult = true"
        ></v-text-field>

        <!-- 暂时不要显示它 -->
        <v-btn @click="btnClicked" icon v-if="false">
          <v-icon>{{iconText}}</v-icon>
        </v-btn>
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
          <v-list min-width="150" width="200">
            <v-list-item>
              <LangSelect></LangSelect>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-checkbox v-model="show3D" color="primary" :label="$t('toolbar.menu.show3d')" />
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="openAboutDialog">
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
import UserInfoCard from "./UserInfoCard";
import { mapState } from "vuex";
import LangSelect from '../../components/lang-select/LangSelect';
import {wxSettings} from '../../config/config';

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
      // focusOnEdit: false,
      // focusOnList: false,
      showResult: false,
      keep: true,
      searchState: 0,
      show3D: false, // 我们默认不开这个。
      showAbout: false
    };
  },
  computed: {
    ...mapState({
      wxReady: state => state.wx.wxState == 0,
      userInfo: state => {
        if (state.wx.useFake) return state.wx.localFake;
        return state.wx.userInfo;
      },
      fake: state => state.wx.useFake
    }),
    avatarAlt() {
      let text = "";
      if (this.userInfo.name) {
        let arr = this.userInfo.name.split(" ");
        text.concat(arr[0].charAt(0));
        if (arr.length > 1) {
          text.concat(arr[arr.length - 1].charAt(0));
        }
      }
      return text;
    },

  },
  props: {
    // state: {
    //   required: true,
    //   type: Number
    // }
  },
  created() {
    this.intervalID = undefined;
    // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
    // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
    // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
    // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
    // 请参考：https://lodash.com/docs#debounce
    this.debouncedGetEntries = lodash.debounce(this.searchQuery, 500);
    this.$store.commit("updateFake", wxSettings.fakeUserInfo);
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
        this.searchState = 2; // Mark state as pending.
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
    openAboutDialog() {
      this.$router.push('/about');
      // this.showAbout = true;
    },
    cardBlur() {
      console.log('Card blur!');
      this.showResult = false;
    },
    alert(msg) {
      alert(msg);
    }
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
      newVal = newVal.trim();
      if (newVal && newVal !== "") {
        this.showResult = true;
        this.debouncedGetEntries();
      } else {
        this.showResult = false;
      }
    },
    show3D: function(newVal) {
      this.$store.commit("toggle3DBuildings", newVal);
    }
  },
  components: {
    SearchResultList,
    UserInfoCard,
    LangSelect
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