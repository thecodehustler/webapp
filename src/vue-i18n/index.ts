import Vue from 'vue';
import V18N from 'vue-i18n';
import msgCN from './zh_CN';
import msgEN from './en_US';
import { Browser } from '@/commons/browser';

Vue.use(V18N);

const V18nOptions = new V18N({
  locale: Browser.host.osMajorLanguage,
  messages: {
    zh: msgCN,
    en: msgEN
  }
  // en: msgEN
});

export default V18nOptions;