<template>
  <v-btn icon>
    <v-icon v-text="iconText" @click="cycle"></v-icon>
  </v-btn>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
    import {namespace} from "vuex-class";
    import {ThemeOption} from "@/store/module-settings";

    const settings = namespace('settings');
    @Component
  export default class ThemeAdjustButton extends Vue {
      @settings.State('theme') theme!: ThemeOption;
      @settings.Mutation('setTheme') setTheme!: Function;

      get iconText() {
          switch(this.theme) {
              case ThemeOption.DARK:
                  return 'mdi-brightness-4';
              case ThemeOption.LIGHT:
                  return 'mdi-brightness-7';
              default:
                  return 'mdi-brightness-6';
          }
      }

      cycle() {
        let current = this.theme;
        current += 1;
        current %= 3;
        this.setTheme(current);
      }
  }
</script>

<style scoped>

</style>