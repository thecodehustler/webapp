<template>
  <v-bottom-sheet
    :value="open"
    inset
    max-width="450"
    scrollable
    persistent
    no-click-animation
    id="bottom-sheet"
    ref="bottom-sheet"
  >
    <v-card max-height="85vh" ref="card">
      <!-- 上面的几个按钮 -->
      <v-toolbar
        min-width="100%"
        absolute
        v-show="overlay.errorReason === 0"
        :color="computedToolbarColor"
        dense
        flat
      >
        <v-toolbar-title v-show="!intersect" class="font-weight-medium">{{ overlay.data.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
        <v-progress-linear absolute top :active="overlay.loading" indeterminate></v-progress-linear>
      </v-toolbar>
      <!-- 显示错误信息用的 -->
      <v-overlay :value="overlay.errorReason != 0" absolute color="error">
        <v-row justify="center">
          <v-icon>mdi-alert-circle</v-icon>
        </v-row>
        <v-row justify="center">
          <h2 class="title">{{errorMessage}}</h2>
        </v-row>
        <v-row justify="center">
          <v-btn @click="close" color="error" text>{{$t('article.got_it')}}</v-btn>
        </v-row>
      </v-overlay>
      <!-- 由于 Bottom Sheet 的一些限制，这里直接用 Card Text 承载内容。
      并移除掉内边距、外边距。-->
      <v-card-text class="ma-0 pa-0">
        <v-img
          gradient="to bottom, rgba(100,115,201,.33), rgba(25,32,72,.7)"
          :src="overlay.data.head_image_url"
          height="180"
        >
          <v-container
            class="fill-height align-content-end pb-0"
            
          >
            <v-row v-if="overlay.contentReady" class="pb-0 mb-0">
              <v-col class="mb-0">
                <h2 class="headline font-weight-medium">{{ overlay.data.name }}</h2>
                <p class="subtitle-1 mb-0 pb-0" id="subheading">{{ overlay.data.subtitle }}</p>
                <div id="intersect-checker" v-intersect="{handler: onIntersect}"></div>
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
          <v-btn
            :href="overlay.data.mp_link"
            text
            :disabled="!overlay.data.mp_link"
            target="_blank"
          >
            {{$t('article.goto')}}
            <v-icon small>mdi-open-in-new</v-icon>
          </v-btn>
        </v-card-actions>
      </v-expand-transition>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import {Vue, Component, Watch} from 'vue-property-decorator';
import {namespace} from 'vuex-class';

const overlay = namespace('overlay');

@Component
export default class ArticleOverlay extends Vue {
  intersect = true;
  @overlay.State('overlay') overlay;
  @overlay.Mutation('openPanel') openPanel;
  @overlay.Action('closePanel') closePanel;
  @overlay.Action('loadFromURL') loadFromURL;
  @overlay.State('open') open;

  // TODO: The color code is NOT supposed to be fixed. The color should be theme-aware.
  get computedToolbarColor() {
    if (!this.intersect) {
      return "rgba(0,0,0,0.67)";
    }
    return "rgba(0,0,0,0)";
  }

  get errorMessage() {
    switch (this.overlay.errorReason) {
      case 0:
        return "";
      case 1:
        return this.$t("article.errors.network");
      case 2:
        return this.$t("article.errors.not_exist");
      case 3:
        return this.$t("article.errors.internal_server_error");
      default:
        return this.$t("article.errors.unknown");
    }
  }

  close() {
    this.closePanel().then(() => {
      // console.log('After Close');
      this.$router.back();
    });
  }

  /**
   * Callback: Called when intersect.
   * @param entries
   * @param observer
   */
  onIntersect(entries, observer) {
    console.log(entries, observer);
    this.intersect = entries[entries.length - 1].isIntersecting;
  }

  mounted() {
    if (this.$route.query.id) {
      // this.$store.dispatch(
      //         "loadFromURL",
      //         `/api/info?landmarkID=${this.$route.query.id}`
      // );
      this.loadFromURL(`/api/info?landmarkID=${this.$route.query.id}`);
    } else {
      this.$router.back();
    }
  }

  beforeDestroy() {
    console.log("Overlay beforeDestroy!");
  }
}
///////////////////////////////////////////////
/*export default {
  data() {
    return {
      intersect: true,
      thisIsIE: false
    };
  },
  computed: {
    computedToolbarColor() {
      if (!this.intersect) {
        return "rgba(0,0,0,0.67)";
      }
      return "rgba(0,0,0,0)";
    },
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
    close() {
      this.$store.commit("close");
      this.$router.back();
    },

    onIntersect(entries, observer) {
      console.log(entries, observer);
      this.intersect = entries[entries.length - 1].isIntersecting;
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.$store.dispatch(
        "loadFromURL",
        `/api/info?landmarkID=${this.$route.query.id}`
      );
    } else {
      this.$router.back();
    }
  },
  beforeDestroy() {
    console.log("Overlay beforeDestroy!");
  }
};*/
</script>

<style lang="scss">
#subheading {
  line-height: 1.2;
}
#card-text {
  h2 {
    font-weight: 500;
    font-size: 1em;
    color: #2196f3;
    margin-bottom: 12px;
    margin-top: 12px;
  }
  strong {
    font-weight: 600;
  }

  img {
    max-width: 95%;
  }
}
#intersect-checker {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 2px;
  height: 0px;
  visibility: hidden;
}
</style>