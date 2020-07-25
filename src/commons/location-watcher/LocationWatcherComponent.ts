'use strict';

import GW from './LocationWatcherImpl';
import {LocationWatcherCallbacks} from './LocationWatcherImpl';
import Vue from 'vue';

// Multiple component will share some common data;

const component = {
  name: 'LocationWatcher',
  render: function(createElement: Function) {
    return createElement('i', {'display': 'none'});
  },
  data() {
    return {};
  },
  props: {
    enabled: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    onUpdate(coord: Position) {
      this.$emit('update', coord);
    },
    onError(error:PositionError) {
      this.$emit('error', error)
    }
  },
  created() {
    this.geoCallback = new LocationWatcherCallbacks(this.onUpdate, this.onError); // 创建回调
    GW.registerCallbacks(this.geoCallback, this.id); // 想起注册！
    if (this.$props.enabled) {
      GW.enableCallback(this.id);
    }
  },
  destroyed() {
    GW.unregisterCallbacks(this.$props.id);
  },
  watch: {
    'enabled': function(newVal){
      if (newVal) {
        GW.enableCallback(this.id);
      } else {
        GW.disableCallback(this.id);
      }
    }
  },
}

Vue.component('LocationWatcher', component);