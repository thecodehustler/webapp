<template>
  <v-list>
    <v-list-item v-if="state == 1" color="error">
      Error.
    </v-list-item>
    <v-subheader v-if="state == 0">{{count}} 条结果</v-subheader>
    <v-expand-transition>
    <v-list-item v-for="result in data" :key="result.landmark_id" @click="itemClicked(result)">
      <v-list-item-content>
      <v-list-item-title>{{result.name}}</v-list-item-title>
      <v-list-item-subtitle>{{result.subtitle}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    </v-expand-transition>
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
       * 0 = Success
       * 1 = Failed
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
      this.$store.dispatch('loadLocalContent', result);
    }
  },
  computed: {
    count: function(){
      return this.data.length;
    }
  }
};
</script>

<style>
</style>