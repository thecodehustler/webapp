import Vue from 'vue';
import V18N from 'vue-i18n';

Vue.use(V18N);

import msgCN from './zh_CN';

export default new V18N({
  locale: 'cn',
  messages: {
    cn: msgCN
  }
  // en: msgEN
});