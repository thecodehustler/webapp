<template>
  <v-app :dark="dark">
    <v-content>
      <Main />
      <v-snackbar vertical></v-snackbar>
    </v-content>
    <v-footer>
      <a href="http://www.beian.miit.gov.cn">赣ICP备20005831号-1</a>
    </v-footer>
  </v-app>
</template>

<script>
import AsyncComponents from "./commons/async-components/AsyncComponents";
import axios from "axios";

let Main = AsyncComponents.build("components/Main.vue");

export default {
  name: "App",
  components: {
    Main
  },
  data: () => ({}),
  computed: {
    dark: function() {
      return this.$store.state.darkMode;
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
      this.$store.subscribe
    }
  }
};
</script>
