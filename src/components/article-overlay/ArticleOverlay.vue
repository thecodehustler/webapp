<template>
  <v-bottom-sheet v-model="contentShow" inset scrollable persistent>
    <v-card height="85%">
      <v-overlay value="contentError" absolute color="error">
        <v-row justify="center">
          <v-icon>mdi-alert-circle</v-icon>
        </v-row>
        <v-row justify="center">
          <h2 class="title">{{errorMessage}}</h2>
        </v-row>
        <v-row justify="center">
            <v-btn @click="contentShow=false" color="error" text>知道了</v-btn>
        </v-row>
      </v-overlay>
      <v-img
        :aspect-ratio="16/9"
        gradient="to bottom, rgba(100,115,201,.33), rgba(25,32,72,.7)"
        src="https://cdn.vuetifyjs.com/images/cards/forest-art.jpg"
      >
        <v-container class="fill-height align-content-end">
          <v-btn icon right top absolute @click="contentShow=false">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
          <v-row>
            <v-col v-if="contentReady">
              <h2 class="heading">{{ textInfo.name }}</h2>
              <div class="subheading">{{textInfo.subtitle}}</div>
            </v-col>
            <v-col v-else>
              <v-progress-linear absolute bottom :active="contentLoading"></v-progress-linear>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
      <v-card-text v-if="contentReady">
        <v-row>
          <v-col>{{textInfo.description}}</v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="contentReady">
        <v-btn :href="textInfo.mp_link" text>
          {{$t('article.goto')}}
          <v-icon small>mdi-open-in-new</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      textInfo: {
        // 需要与后端返回的数据一致
        name: "",
        subtitle: "",
        top_image_url: "",
        description: "",
        mp_link: ""
      },
      contentReady: false,
      contentLoading: false,
      contentError: false,
      contentShow: false,
      errorReason: 0,
    };
  },
  props: {
    debugInfo: {
      type: Object,
      required: false
    },
    show: {
      type: Boolean,
      required: true
    },
    url: {
      type: String,
      required: false
    }
  },
  created() {
    if (this.$props.debugInfo) {
      this.textInfo = this.$props.debugInfo;
      this.contentReady = true;
      this.contentShow = this.show; // 初始值.
    }
  },
  model: {
    prop: "show",
    event: "update"
  },
  mounted() {
    if (this.$props.url) {
      this.loadFromURL(this.$props.url);
    }
  },
  computed: {
    errorMessage() {
      switch(this.errorReason) {
        case 0: return '正常。';
        case 1: return this.$t('article.errors.network');
        case 2: return this.$t('article.errors.not_exist');
        default: return this.$t('article.errors.unknown');
      }
    }
  },
  methods: {
    selfClose() {
      this.show = false;
    },
    loadFromURL(url) {
      this.contentLoading = true;
      axios
        .get(url)
        .then(value => {
          console.log("success,", value);
          this.textInfo = value.data;
          this.contentReady = true;
        })
        .catch(reason => {
          console.log(reason);
          if (reason.response) {
            this.errorReason = 2;
          } else {
            this.errorReason = 1;
          }
        })
        .finally(() => {
          this.contentLoading = false;
        });
    }
  },
  watch: {
    contentShow: function(newVal) {
      this.$emit("update", newVal);
    },
    show: function(newVal) {
      this.contentShow = newVal;
    }
  }
};
</script>

<style>
</style>