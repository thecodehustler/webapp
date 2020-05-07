<template>
  <v-app :dark="dark">
    <v-content>
      <Main/>
    </v-content>
    <v-footer>
      <a href="http://www.beian.miit.gov.cn">赣ICP备20005831号-1</a>
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
