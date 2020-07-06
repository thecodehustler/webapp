<template>
  <v-app :dark="dark">
    <v-main>
      <router-view v-if="notSupportedReason === 0"></router-view>
      <!-- <Main v-if="notSupportedReason === 0"></Main> -->
      <NotSupported v-else-if="notSupportedReason === 1"></NotSupported>
      <div v-else></div>
      <v-snackbar vertical top right color="warning" v-model="ieWarningSnackbar" timeout="14000">
        {{$t('app.ie_warning')}}
        <v-btn text @click="ieWarningSnackbar = false">
          {{$t('app.close')}}
        </v-btn>
      </v-snackbar>
      <vue-headful :title="$t('app.title')"></vue-headful>
    </v-main>
    <v-footer>
      <div>
        <a href="http://www.beian.miit.gov.cn">赣ICP备20005831号-1</a>
      </div>
      <v-spacer></v-spacer>
      <div v-if="notSupportedReason > 0">
        <LangSelect />
      </div>
      <div v-if="notSupportedReason !== 0" class="text--disabled">© 2020 SHERRY / APTX</div>
    </v-footer>
  </v-app>
</template>

<script>
import "./components/headful";
import NotSupported from './components/not-supported-view/NotSupported';
import LangSelect from "./components/lang-select/LangSelect";
import isIE from './commons/is-ie';

export default {
  name: "App",
  components: {
    LangSelect,
    NotSupported,
  },
  data: () => ({
    notSupportedReason: -1,
    ieWarningSnackbar: false,
  }),
  computed: {
    dark: function() {
      return this.$store.state.darkMode;
    }
  },
  methods: {
    isSupported() {}
  },
  created() {
    this.$store.dispatch("initWX"); // 开始准备微信

    // 解析参数
    let query = window.location.search.substring(1);
    let vars = (function() {
      let vs = query.split("&");
      let ret = new Map();
      vs.forEach(v => {
        let c = v.split("=");
        ret.set(c[0], c[1]);
      });
      return ret;
    })();
    console.log(vars);

    if (vars.has("code")) {
      // let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx116c7ab3d519b006&secret=SECRET_CODE&code=${vars.get('code')}&grant_type=authorization_code`
      // // 如果是从微信服务器重定向过来，并带有一个 code 参数
      // axios.get(url).then(result => {
      //   let access_token = result.data?.access_token;
      //   let openid = result.data?.openid;
      //   axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`).then( res => {
      //     this.$store.commit('updateUserInfo');
      //   })
      this.$store.commit("redirected", vars.get("code"));
      this.$store.dispatch("obtainUserinfo");
    } else {
      this.$store.commit("useFake");
    }
  },
  mounted() {
    if (!isIE()) {
      document.dispatchEvent(new Event("x-app-rendered"));
    }
    // 判断浏览器是否支持 WebGL
    this.$nextTick(() => {
      let canvas = document.createElement("canvas");
      let context =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      this.notSupportedReason = (context && context instanceof WebGLRenderingContext)? 0: 1;
      if (isIE()) {
        this.ieWarningSnackbar = true;
      }
    });
  }
};
</script>
