<template>
  <div>
    <video controls="0" :src="src" @canplaythrough="onVideoCanPlayThrough"></video>
    <div class="video-controls-container flex">
      <v-btn></v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
enum MediaState {
  STOP,
  PLAYING,
  BUFFERING,
  PAUSED
}

@Component
export default class MDVideoView extends Vue {
  src = "";
  playState = MediaState.STOP;
  length = 0;
  current = 0;
  onVideoCanPlayThrough() {
    // TODO: Implement this method.
  }
}
</script>

<style scoped lang="scss">
.video-controls-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 24px;
}
</style>