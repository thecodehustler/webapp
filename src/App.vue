<template>
  <v-app :dark="dark">

    <v-content>
      <Main/>
      <!-- <LandingOverlay /> -->
    </v-content>
    <v-footer>
      备案号：XXXXXXXXX
    </v-footer>
  </v-app>
</template>

<script>
import AsyncComponents from './commons/async-components/AsyncComponents';

let Main = AsyncComponents.build('components/Main.vue');
// let LandingOverlay = AsyncComponents.build('views/landing/LandingOverlay.vue');

export default {
  name: 'App',

  components: {
    Main,
    // LandingOverlay
  },

  data: () => ({
    
  }),
  computed: {
    dark: function() {
      return this.$store.state.darkMode;
    }
  }
};
</script>
