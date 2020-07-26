<template>
  <v-container class="fill-height text-center align-content-center overflow-y-auto">
    <v-row align-content="center" align="center" class="text-center">
      <v-col>
        <h1 class="display-2 font-weight-light condensed">{{errorTitle}}</h1>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col>
        <p class="text--secondary subtitle-1">{{errorDescription}}</p>
      </v-col>
    </v-row>
    <v-row>
      <slot name="addition">

      </slot>

    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator';
@Component 
export default class NotSupported extends Vue {
  @Prop(String) errorTitle!: string;
  @Prop(String) errorDescription!: string;
}
</script>