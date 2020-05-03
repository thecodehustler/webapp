<template>
  <v-overlay :value="overlay" @landing-close="selfClose">
    <v-card height="80vh" width="80vw" v-on="$listeners" class="d-flex flex-column">
      <v-carousel
        show-arrows-on-hover
        class="flex-shrink-0 flex-grow-1"
        hide-delimiters
        :continuous="false"
        :cycle="false"
        v-on="$listeners"
        v-model="onboarding"
      >
        <v-carousel-item v-for="(slide, i) in slides" :key="i" v-on="$listeners">
          <component :is="slide.component" @landing-close="selfClose"></component>
        </v-carousel-item>
      </v-carousel>
      <!-- <v-window v-model="onboarding" v-on="$listeners" show-arrows-on-hover="true" class="flex-grow-1 flex-shrink-0">
        <v-window-item v-for="(slide, i) in slides" :key="i" v-on="$listeners" class="fill-height flex-grow-1">
          <component :is="slide.component" @landing-close="selfClose" class="fill-height"></component>
        </v-window-item>
      </v-window> -->
      <v-card-actions class="flex-shrink-1 flex-grow-0">
        <v-item-group v-model="onboarding" class="text-center" mandatory>
          <v-item
          v-for="(slide, i) in slides"
          :key="`btn-${i}`"
          v-slot:default="{ active, toggle }">
          <v-btn :input-value="active" icon @click="toggle">
            <v-icon>mdi-record</v-icon>
          </v-btn>
          </v-item>
        </v-item-group>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
// Must-have components.
import AsyncComponents from '../../commons/async-components/AsyncComponents';
import Vue from "vue";

export default {
  name: "LandingView",
  components: {
  },
  data() {
    return {
      slides: [
        // {component: ''}
      ],
      overlay: true,
      onboarding: 0,
    };
  },
  created() {
    const componentsPath = [
      "views/landing/pages/Intro1.vue",
      "views/landing/pages/Intro2.vue"
    ];
    let promises = componentsPath.map(path => {
      return AsyncComponents.build(path);
    });
    promises.forEach(x => {
      this.slides.push({ component: x });
    });
  },
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