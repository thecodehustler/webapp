<template>
  <v-dialog v-model="model" max-width="540" scrollable :fullscreen="$vuetify.breakpoint.mobile" transition="slide-y-reverse-transition">
    <v-card max-width="540">
      <v-sheet tile color="blue" height="160">
        <v-container class="align-content-end fill-height relative">
          <v-row no-gutters>
            <h1 class="display-2 font-weight-light condensed white--text">{{$t('app.title')}}</h1>
          </v-row>
          <!-- <img class="absolute-image" src="img/icons/drone-pngrepo-com.png"/> -->
        </v-container>
      </v-sheet>
      <v-card-text>
        <v-container class="pa-0">
          <v-row no-gutters>
            <v-col>
              <h3
                class="subtitle-2 font-weight-medium py-3 blue--text"
              >{{$t('about.open_source_libraries')}}</h3>

              <v-expansion-panels flat>
                <v-expansion-panel v-for="lib of LIBRARIES" :key="lib.name">
                  <v-expansion-panel-header>
                    {{lib.name}}
                    <span style="padding-left: 8px">
                      <v-chip
                        x-small
                        label
                        :href="lib.licenseURL"
                        target="_blank"
                        @click.stop=""
                      >{{lib.license}}</v-chip>
                    </span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-btn small color="primary" :href="lib.homepage" target="_blank">
                      <v-icon small>mdi-home</v-icon>
                      {{$t('about.homepage')}}
                    </v-btn>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>

            <!-- <v-list class="fill-width">
          <v-list-item>
            <v-card outlined href="https://github.com/vuejs/vue" class="god-damn-vuetify-grid">
              <v-container>
                <v-row>
                  <v-col class="flex-shrink-1 flex-grow-0">
                    <v-avatar size="48">
                      <v-img src="https://cn.vuejs.org/images/logo.png"></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col class="flex-grow-1 flex-shrink-0">
                    <h2 class="title">Vue.js</h2>
                    <p class="body-2">渐进式 JavaScript 框架</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-list-item>

          <v-list-item>
            <v-card
              outlined
              href="https://github.com/vuetifyjs/vuetify"
              class="god-damn-vuetify-grid"
            >
              <v-container>
                <v-row>
                  <v-col class="flex-shrink-1 flex-grow-0">
                    <v-avatar size="48">
                      <v-img src="https://vuetifyjs.com/apple-touch-icon-180x180.png"></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col class="flex-grow-1 flex-shrink-0">
                    <h2 class="title">Vuetify</h2>
                    <p class="body-2">制作精良的 Material Design UI 组件库。</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-list-item>
            </v-list>-->
          </v-row>

          <v-row no-gutters>
            <v-col>
              <h3
                class="subtitle-2 font-weight-medium py-3 blue--text"
              >{{$t('app.title')}} - {{$t('about.staff')}}</h3>
              <p>{{$t('about.website')}}SHERRY / APTX</p>
              <p>{{$t('about.map')}}某位不愿透露姓名的路边小伙</p>
              <p>{{$t('about.modeling')}}艺鸣</p>
              <p>
                {{$t('about.articles')}}晋华、恺、
                <span title="？？？在一起？？？">斯斯、秋秋</span>
              </p>
              <p>{{$t('about.guide')}}虹吾、佰林</p>
              <div class="text--disabled text-right">
                <span>{{$t('about.build_version')}} {{VERSION}}</span> ·
                <span v-text="COPYRIGHT"></span>
              </div>
            </v-col>
          </v-row>
          <v-row style="height: 400px;">
            <BiliVideoView avid="2295825" p="23"></BiliVideoView>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" text>{{$t('app.close')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
// export default {
//   data() {
//     return {
//       // eslint-disable-next-line no-undef
//       VERSION: VARS.VERSION,
//       COPYRIGHT: VARS.COPYRIGHT,
//       model: true,
//       LIBRARIES: [
//         {
//           name: "Vue.js",
//           license: "MIT",
//           licenseURL: "https://opensource.org/licenses/MIT",
//           homepage: "https://vuejs.org/",
//         },
//         {
//           name: "Vuetify",
//           license: "MIT",
//           licenseURL: "https://opensource.org/licenses/MIT",
//           homepage: "https://vuetifyjs.com/",
//         },
//         {
//           name: "Vuex",
//           license: "MIT",
//           licenseURL: "https://opensource.org/licenses/MIT",
//           homepage: "https://vuex.vuejs.org/",
//         },
//         {
//           name: "Cesium",
//           license: "Apache-2.0",
//           licenseURL:
//             "https://github.com/CesiumGS/cesium/blob/master/LICENSE.md",
//           homepage: "https://cesiumjs.org",
//         },
//         {
//           name: "Vue I18n",
//           license: "MIT",
//           licenseURL: "https://opensource.org/licenses/MIT",
//           homepage: "https://kazupon.github.io/vue-i18n/",
//         },
//       ],
//     };
//   },
//   methods: {},
//   watch: {
//     model(newVal) {},
//   },
// };

import { Vue, Component, Watch } from "vue-property-decorator";
import BiliVideoView from "../components/article-overlay/bili-video-view/BiliVideoView.vue";
@Component({
  components: {
    BiliVideoView,
  },
})
export default class About extends Vue {
  model = true;
  VERSION = VARS.VERSION;
  COPYRIGHT = VARS.COPYRIGHT;

  close() {
    this.$emit("close");
    this.model = false;
  }

  @Watch("model") onDialogStateChanged(newVal: boolean) {
    if (newVal == false) {
      setTimeout(() => {
        this.$router.go(-1);
      }, 200);
    }
  }

  LIBRARIES = [
    {
      name: "Vue.js",
      license: "MIT",
      licenseURL: "https://opensource.org/licenses/MIT",
      homepage: "https://vuejs.org/",
    },
    {
      name: "Vuetify",
      license: "MIT",
      licenseURL: "https://opensource.org/licenses/MIT",
      homepage: "https://vuetifyjs.com/",
    },
    {
      name: "Vuex",
      license: "MIT",
      licenseURL: "https://opensource.org/licenses/MIT",
      homepage: "https://vuex.vuejs.org/",
    },
    {
      name: "Cesium",
      license: "Apache-2.0",
      licenseURL: "https://github.com/CesiumGS/cesium/blob/master/LICENSE.md",
      homepage: "https://cesiumjs.org",
    },
    {
      name: "Vue I18n",
      license: "MIT",
      licenseURL: "https://opensource.org/licenses/MIT",
      homepage: "https://kazupon.github.io/vue-i18n/",
    },
  ];
}
</script>

<style lang="scss" scoped>
.relative {
  position: relative;
  background: no-repeat url("/img/icons/drone-pngrepo-com.png");
  background-position: right 12px bottom -36px;
  background-size: 180px;
  background-origin: border-box;
}

path {
  fill: white;
}
</style>