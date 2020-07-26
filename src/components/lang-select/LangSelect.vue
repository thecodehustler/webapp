<template>
<div @click.stop="">
  <v-select :value="lang" :items="options" dense @input="onInput">
  </v-select>
</div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {namespace, State} from "vuex-class";

  const settings = namespace('settings');
enum Locales {
  EN = 'en',
  CN = 'cn'
}
@Component
export default class LangSelect extends Vue {
  @settings.State('lang') lang !: Locales;
  @settings.Mutation('setLanguage') commitNew!: Function;
  options = [{
    text: 'English',
    value: 'en'
  }, {
    text: '中文',
    value: 'zh'
  }];

  created() {
    console.log(this.lang);
  }

  onInput(event: string) {
    this.commitNew(event);
    // this.$i18n.locale = event;
    // console.log('input',event);
  }
}
</script>

<style>
</style>