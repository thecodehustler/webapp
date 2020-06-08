<template>
  <v-app :dark="dark">
    <v-content>
      <Main v-if="supported"></Main>
      <NotSupported v-else></NotSupported>
      <v-snackbar vertical></v-snackbar>
    </v-content>
    <v-footer>
      <div><a href="http://www.beian.miit.gov.cn">赣ICP备20005831号-1</a></div> 
      <v-spacer></v-spacer>
      <div v-if="!supported"><LangSelect /></div>
      <div v-if="!supported" class="text--disabled">© 2020 SHERRY / APTX</div>
    </v-footer>
  </v-app>
</template>

<script>
import AsyncComponents from "./commons/async-components/AsyncComponents";
let NotSupported = AsyncComponents.build('components/not-supported-view/NotSupported.vue');
let Main = AsyncComponents.build("components/Main.vue");
import LangSelect from './components/lang-select/LangSelect';

export default {
  name: "App",
  components: {
    Main,
    NotSupported,
    LangSelect
  },
  data: () => ({
    supported: true
  }),
  computed: {
    dark: function() {
      return this.$store.state.darkMode;
    }
  },
  methods: {
    isSupported() {

    }
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
      this.$store.dispatch('obtainUserinfo');
    } else {
      this.$store.commit('useFake');
    }
  },
  mounted() {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.supported = context && context instanceof WebGLRenderingContext;
  }
};
</script>
