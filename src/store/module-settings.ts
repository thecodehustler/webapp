import { Module, VuexModule, Mutation } from 'vuex-module-decorators';

import VueI18nOptions from '../vue-i18n/index';
import { Browser } from '@/commons/browser';
export enum ThemeOption {
  LIGHT,
  DARK,
  FOLLOW
}

@Module({namespaced: true})
export default class Settings extends VuexModule {
  lang = Browser.host.osMajorLanguage;
  theme: ThemeOption = ThemeOption.FOLLOW;
  @Mutation setLanguage(payload: string) {
    this.lang = payload;
    VueI18nOptions.locale = payload;
  }

  @Mutation setDarkMode(isDark: ThemeOption) {
    this.theme = isDark;
  }

  @Mutation setTheme(theme: ThemeOption) {
    this.theme = theme;
  }

  write() {
    const data = JSON.stringify(this);
    // TODO: Write this JSON data into something.
  }

  read() {
    const data = JSON.parse(''); // TODO: Read data from local storage.
    Object.assign(this, data);
  }

  apply() {
    // TODO: Code to apply settings on global settings.
  }
}