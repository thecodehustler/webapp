<template>
  <v-app :dark="dark">
    <!-- <v-app-bar
      app
      color="primary"
      dark
      fixed
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar> -->

    <v-content>
      <Main/>

      <LandingOverlay />
    </v-content>
  </v-app>
</template>

<script>
import AsyncComponents from './commons/async-components/AsyncComponents';

let Main = AsyncComponents.build('components/Main.vue');
let LandingOverlay = AsyncComponents.build('views/landing/LandingOverlay.vue');

export default {
  name: 'App',

  components: {
    Main,
    LandingOverlay
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
