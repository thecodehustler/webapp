<template>
<div @click.stop="">
  <v-select v-model="state" :items="options" dense>
  </v-select>
</div>
</template>

<script>
export default {
  data() {
    return {
      options: ["English", "中文"],
      state: '中文'
    };
  },
  watch: {
    state(n) {
      switch(n) {
        case '中文':
          this.$i18n.locale = 'cn';
          break;
        case 'English':
          this.$i18n.locale = 'en';
          break;
      }
    }
  }
};
</script>

<style>
</style>