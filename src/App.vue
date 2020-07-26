<template>
<body>
  <v-app>
    <v-main>
      <router-view v-if="notSupportedReason === 0"></router-view>
      <NotSupported v-else-if="notSupportedReason === 1" :error-title="$t('app.webgl_unsupported')" :error-description="$t('app.webgl_unsupported_description')">
        <template v-slot:addition>
          <v-col>
            <v-btn href="https://browsehappy.com/" target="_blank">{{$t('app.upgrade_help')}}<v-icon small>mdi-open-in-new</v-icon></v-btn>
          </v-col>
        </template>
      </NotSupported>
      <div v-else></div>
      <v-snackbar vertical top right color="warning" v-model="ieWarningSnackbar" timeout="14000">
        {{$t('app.ie_warning')}}
        <v-btn text @click="ieWarningSnackbar = false">{{$t('app.close')}}</v-btn>
      </v-snackbar>
      <vue-headful :title="$t('app.title')"></vue-headful>
    </v-main>
    <v-footer>
      <div>
        <a href="http://www.beian.miit.gov.cn" target="_blank">赣ICP备20005831号-1</a>
      </div>
      <v-spacer></v-spacer>
      <div v-if="notSupportedReason > 0">
        <LangSelect />
      </div>
      <div v-if="notSupportedReason !== 0" class="text--disabled">© 2020 SHERRY / APTX</div>
    </v-footer>
  </v-app>
</body>
</template>

<script lang="ts">
  import "./components/headful";
  import NotSupported from "./components/not-supported-view/NotSupported.vue";
  import LangSelect from "./components/lang-select/LangSelect.vue";
  import {Browser, Vendor} from "./commons/browser";
  import {Component, Vue, Watch} from "vue-property-decorator";
  import {Action, namespace} from "vuex-class";
  import {ThemeOption} from "@/store/module-settings";

  const settings = namespace('settings');
  
  let media!: MediaQueryListEvent|MediaQueryList|undefined;

@Component({
  components: {
    NotSupported,
    LangSelect
  }
})
export default class App extends Vue {
  notSupportedReason = -1;
  ieWarningSnackbar = false;

  @settings.State('theme') theme!: ThemeOption;
  @settings.Mutation('setDarkMode') setDarkMode!: Function;
  @Action("initWX") initWX!: Function;
  @Action("redirected") onRedirected!: Function;

  onUserAgentColorSchemeChange(ev: MediaQueryListEvent|MediaQueryList) {
    console.log(ev);
    if (ev.matches) {
      // this.setDarkMode(DarkModeOptions.ON);
      this.$vuetify.theme.dark = true;
    } else {
      // this.setDarkMode(false);
      this.$vuetify.theme.dark = false;
    }
  }

  setTheme(newTheme: ThemeOption) {
    const localmedia: MediaQueryList = media;
    if (localmedia) {
      if (typeof localmedia.removeEventListener === 'function')
        localmedia.removeEventListener('change', this.onUserAgentColorSchemeChange);
      else if (typeof localmedia.removeListener === 'function')
        localmedia.removeListener(this.onUserAgentColorSchemeChange);
    }
    media = undefined;
    switch(newTheme) {
      case ThemeOption.FOLLOW: {
        if ('matchMedia' in window) {
          media = window.matchMedia('(prefers-color-scheme: dark)');
          this.onUserAgentColorSchemeChange(media);
          if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', this.onUserAgentColorSchemeChange);
          } else if (typeof media.addListener === 'function') {
            media.addListener(this.onUserAgentColorSchemeChange);
          }
        }
        break;
      }
      case ThemeOption.DARK: {
        this.$vuetify.theme.dark = true;
        break;
      }
      case ThemeOption.LIGHT: {
        this.$vuetify.theme.dark = false;
        break;
      }
    }
  }

  @Watch('theme') onThemeChange(newTheme: ThemeOption) {
    console.log(newTheme);
    this.setTheme(newTheme);
  /*  if (window.matchMedia && this.theme == ThemeOption.FOLLOW) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      this.onUserAgentColorSchemeChange(media);
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', this.onUserAgentColorSchemeChange);
      } else if (typeof media.addListener === 'function') {
        media.addListener(this.onUserAgentColorSchemeChange);
      }
    } else {
      switch(this.theme) {
        case ThemeOption.LIGHT:
          this.$vuetify.theme.dark = false;
          break;
        case ThemeOption.DARK:
        default:
          this.$vuetify.theme.dark = true;
          break;
      }
    }*/
  }

  created() {
    this.setTheme(this.theme);
    this.initWX();
    const query = window.location.search.substring(1);
    const vars = (function() {
      const vs = query.split("&");
      const ret = new Map();
      vs.forEach(v => {
        const c = v.split("=");
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
      this.onRedirected(vars.get("code"));
      // this.$store.commit("redirected", vars.get("code"));
      this.$store.dispatch("obtainUserinfo");
    } else {
      this.$store.commit("useFake");
    }
  }

  mounted() {
    if (Browser.vendor != Vendor.IExplorer) {
      document.dispatchEvent(new Event("x-app-rendered"));
    }
    this.$nextTick(() => {
      this.notSupportedReason = Browser.features.webgl ? 0 : 1;
      if (Browser.vendor == Vendor.IExplorer) {
        this.ieWarningSnackbar = true;
      }
    });
  }
}

// export default {
//   name: "App",
//   components: {
//     LangSelect,
//     NotSupported,
//   },
//   data: () => ({
//     notSupportedReason: -1,
//     ieWarningSnackbar: false,
//   }),
//   computed: {
//     dark: function() {
//       return this.$store.state.darkMode;
//     }
//   },
//   methods: {
//     isSupported() {}
//   },
//   created() {
//     this.$store.dispatch("initWX"); // 开始准备微信
//
//     // 解析参数
//     let query = window.location.search.substring(1);
//     let vars = (function() {
//       let vs = query.split("&");
//       let ret = new Map();
//       vs.forEach(v => {
//         let c = v.split("=");
//         ret.set(c[0], c[1]);
//       });
//       return ret;
//     })();
//     console.log(vars);
//
//     if (vars.has("code")) {
//       // let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx116c7ab3d519b006&secret=SECRET_CODE&code=${vars.get('code')}&grant_type=authorization_code`
//       // // 如果是从微信服务器重定向过来，并带有一个 code 参数
//       // axios.get(url).then(result => {
//       //   let access_token = result.data?.access_token;
//       //   let openid = result.data?.openid;
//       //   axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`).then( res => {
//       //     this.$store.commit('updateUserInfo');
//       //   })
//       this.$store.commit("redirected", vars.get("code"));
//       this.$store.dispatch("obtainUserinfo");
//     } else {
//       this.$store.commit("useFake");
//     }
//   },
//   mounted() {
//     if (Browser.vendor != Vendor.IExplorer) {
//       document.dispatchEvent(new Event("x-app-rendered"));
//     }
//     this.$nextTick(() => {
//       this.notSupportedReason = Browser.features.webgl? 0: 1;
//       if (Browser.vendor == Vendor.IExplorer) {
//         this.ieWarningSnackbar = true;
//       }
//     });
//   }
// };
</script>
<style lang="scss">
a {
  text-decoration: none;
}

::-webkit-scrollbar {
  display: none;
}
</style>