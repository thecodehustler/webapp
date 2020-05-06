<template>
  <v-app :dark="dark">
    <v-content>
      <Main/>
    </v-content>
    <v-footer>
      备案号：XXXXXXXXX
    </v-footer>
  </v-app>
</template>

<script>
import AsyncComponents from './commons/async-components/AsyncComponents';

let Main = AsyncComponents.build('components/Main.vue');

export default {
  name: 'App',
  components: {
    Main,
  },
  data: () => ({
    
  }),
  computed: {
    dark: function() {
      return this.$store.state.darkMode;
    }
  },
  created() {
    this.$store.dispatch('initWX'); // 开始准备微信
  }
};
</script>
