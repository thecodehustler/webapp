<template>
  <v-list>
    <v-subheader v-if="state == 1">{{$t('toolbar.search_error')}}</v-subheader>
    <v-subheader v-else-if="state == 0">{{count}} 条结果</v-subheader>
    <v-progress-linear indeterminate v-if="state == 2"></v-progress-linear>
    <transition-group name="expand">
      <!-- 这里对点击事件用.stop以防止向下传播。 -->
    <v-list-item v-for="result in data" :key="result.landmark_id" @click="itemClicked(result)">
      <v-list-item-content>
      <v-list-item-title>{{result.name}}</v-list-item-title>
      <v-list-item-subtitle>{{result.subtitle}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    </transition-group>
    <!-- </v-expand-transition> -->
  </v-list>
</template>

<script>
export default {
  props: {
    state: {
      type: Number,
      required: true
      /**
       * State:
       * 0 = Success,
       * 1 = Failed,
       * 2 = Pending.
       */
    },
    data: {
      required: true
    },
  },
  methods: {
    itemClicked(result) {
      console.log(result);
      // this.$emit("selected", result);
      this.$store.dispatch('loadFromURL', `/api/info?landmarkID=${result.landmark_id}`);
      // this.$store.dispatch('loadLocalContent', result);
    }
  },
  computed: {
    count: function(){
      return this.data.length;
    }
  }
};
</script>