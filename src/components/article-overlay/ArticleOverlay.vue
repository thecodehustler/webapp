<template>
  <v-bottom-sheet v-model="open" inset max-width="425" scrollable persistent no-click-animation>
    <v-card>
      <!-- 显示错误信息用的 -->
      <v-overlay :value="overlay.errorReason != 0" absolute color="error">
        <v-row justify="center">
          <v-icon>mdi-alert-circle</v-icon>
        </v-row>
        <v-row justify="center">
          <h2 class="title">{{errorMessage}}</h2>
        </v-row>
        <v-row justify="center">
          <v-btn @click="close" color="error" text>知道了</v-btn>
        </v-row>
      </v-overlay>
      <!-- 由于 Bottom Sheet 的一些限制，这里直接用 Card Text 承载内容。
      并移除掉内边距、外边距。-->
      <v-card-text class="ma-0 pa-0">
        <v-img
          gradient="to bottom, rgba(100,115,201,.33), rgba(25,32,72,.7)"
          :src="overlay.data.head_image_url"
          lazy-src="../../assets/placeholder.jpg"
          height="180"
        >
          <v-btn icon right absolute @click="close">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
          <v-progress-linear absolute top :active="overlay.loading" indeterminate></v-progress-linear>

          <v-container class="fill-height align-content-end pb-0">
            <v-row v-if="overlay.contentReady" class="pb-0 mb-0">
              <v-col class="mb-0">
                <h2 class="headline font-weight-medium">{{ overlay.data.name }}</h2>
                <p class="subtitle-1 mb-0 pb-0">{{ overlay.data.subtitle }}</p>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
        <!-- <v-toolbar prominent height="120" color="primary">
          <template slot="extension">
            <v-container class="px-0 mx-0 mb-2">
              <v-row>
                <v-col v-if="overlay.contentReady">
                  <h2 class="heading">{{ overlay.data.name }}</h2>
                  <p class="subheading">{{overlay.data.subtitle}}</p>
                </v-col>
              </v-row>
            </v-container>
          </template>

          <template slot="img">
            <v-img
              gradient="to bottom, rgba(100,115,201,.33), rgba(25,32,72,.7)"
              :src="overlay.data.head_image_url"
            ></v-img>
          </template>

          <template>
            <v-spacer />
            <v-btn icon @click="close">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </template>
        </v-toolbar>-->

        <!-- <v-card-text v-if="overlay.contentReady"> -->
        <!-- <v-container class="me-3 ps-3"> -->
        <!-- <v-row>{{overlay.data.description}}</v-row> -->
        <!-- </v-container> -->
        <v-slide-y-transition>
          <v-card-text v-show="overlay.contentReady">
            <div id="card-text" v-html="overlay.data.rawHTML"></div>
          </v-card-text>
        </v-slide-y-transition>
      </v-card-text>
      <v-divider></v-divider>
      <v-expand-transition>
        <v-card-actions v-show="overlay.contentReady && overlay.data.mp_link">
          <v-spacer />
          <v-btn :href="overlay.data.mp_link" text :disabled="!overlay.data.mp_link" target="_blank">
            {{$t('article.goto')}}
            <v-icon small>mdi-open-in-new</v-icon>
          </v-btn>
        </v-card-actions>
      </v-expand-transition>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      // textInfo: {
      //   // 需要与后端返回的数据一致
      //   name: "",
      //   subtitle: "",
      //   top_image_url: "",
      //   description: "",
      //   mp_link: ""
      // },
      // contentReady: false,
      // contentLoading: false,
      // contentShow: false,
      // errorReason: 0,
    };
  },
  // props: {
  //   debugInfo: {
  //     type: Object,
  //     required: false
  //   },
  //   show: {
  //     type: Boolean,
  //   },
  //   url: {
  //     type: String,
  //     required: false
  //   }
  // },
  computed: {
    errorMessage() {
      switch (this.overlay.errorReason) {
        case 0:
          return "正常。";
        case 1:
          return this.$t("article.errors.network");
        case 2:
          return this.$t("article.errors.not_exist");
        case 3:
          return this.$t("article.errors.internal_server_error");
        default:
          return this.$t("article.errors.unknown");
      }
    },
    ...mapState({
      overlay: state => state.overlay.overlay
    }),
    open: {
      set(val) {
        if (val == false) this.$store.commit("close");
      },
      get() {
        return this.$store.state.overlay.open;
      }
    }
  },
  methods: {
    ...mapMutations({
      close: "close"
    })
  }
};
</script>

<style lang="sass">

#card-text
  h2
    font-weight: 500
    font-size: 1em
    color: #2196F3
    margin-bottom: 12px
  strong
    font-weight: 600
  img
    max-width: 95%
</style>