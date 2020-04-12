<template>
  <v-overlay :value="overlay" @landing-close="selfClose">
    <v-card height="80vh" width="80vw" v-on="$listeners">
      <v-carousel
        show-arrows-on-hover
        height="100%"
        :continuous="false"
        :cycle="false"
        v-on="$listeners"
      >
        <v-carousel-item v-for="(slide, i) in slides" :key="i" v-on="$listeners">
          <component :is="slide.component" @landing-close="selfClose"></component>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-overlay>
</template>

<script>
// Must-have components.
import Utils from "../commons/utils";
import Vue from "vue";

export default {
  name: "LandingView",
  components: {
    // some lazy load code here.
  },
  data() {
    return {
      slides: [
        // {component: ''}
      ],
      overlay: true
    };
  },
  created() {
    const componentsPath = [
      "views/landing/Intro1.vue",
      "views/landing/Intro2.vue"
    ];
    let promises = componentsPath.map(path => {
      return Utils.asyncComponent(path);
    });
    promises.forEach(x => {
      this.slides.push({ component: x });
    });
  },
  components: {},
  methods: {
    selfClose() {
      console.log("closed");
      this.overlay = false;
        Vue.nextTick(() => {
          this.$store.commit("userLanded");
        });
      // this.$emit('userLanded');
    }
  }
};
</script>

<style>
</style>