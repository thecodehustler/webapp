import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators';

import VueI18nOptions from '../vue-i18n/index';
import { Browser } from '@/commons/browser';
export enum ThemeOption {
  LIGHT,
  DARK,
  FOLLOW
}

const SETTINGS_KEY = 'settings';

class SettingsData {

  lang: string = Browser.host.osMajorLanguage;
  theme: ThemeOption = ThemeOption.FOLLOW;

  constructor() {
    this.read();
    this.init();
  }

  read() {
    const rawData = localStorage.getItem(SETTINGS_KEY);
    if (rawData !== null) {
      const data = JSON.parse(rawData);
      console.log('Read: ', data);
      // TODO: Add type check for each data entries.
      Object.assign(this, data);
    }
  }

  write() {
    const data = JSON.stringify(this);
    console.log('Writing:', data); // REMOVE THIS.
    localStorage.setItem(SETTINGS_KEY, data);
  }

  init() {
    VueI18nOptions.locale = this.lang;
  }
}

/*
* Mutation 并没有 context 可供访问。
* 各个 Mutation 都应该是原子化的，只能更改 state，不能再做其他操作了。
*/
@Module({namespaced: true})
export default class Settings extends VuexModule {
  data = new SettingsData();
  //
  // constructor(params: any) {
  //   super(params);
  //   // console.log(this);
  //   // this.read();
  // }

  @Mutation setLanguage(payload: string) {
    this.data.lang = payload;
    VueI18nOptions.locale = payload;
    this.data.write();
    // this.context.dispatch('write');
  }

  @Mutation setDarkMode(isDark: ThemeOption) {
    this.data.theme = isDark;
    this.data.write();
  }

  @Mutation setTheme(theme: ThemeOption) {
    this.data.theme = theme;
    this.data.write();
  }
  
  // @Action assign(object: Record<string, any>) {
  //   console.log('assign is called, after:', this);
  //   Object.assign(this, object);
  //   // this.apply();
  //   // this.context.dispatch('initApply');
  // }

  // @Action initApply() {
  //   this.context.commit('setTheme', this.theme);
  //   this.context.commit('setLanguage', this.lang);
  // }

  // @Action write() {
  //   const data = JSON.stringify(this);
  //   console.log(data);
  //   localStorage.setItem(SETTINGS_KEY, data);
  //   // TODO: Write this JSON data into something.
  // }
  //
  // read() {
  //
  // }
}