<template>
  <iframe :src="source" frameborder="0" scrolling="no" style="width: 100%; height: 100%" allowfullscreen="true">
  </iframe>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
@Component
export default class BiliVideoView extends Vue {
  @Prop({type: String, required: true}) avid !: string;
  @Prop({type: String}) p!: number;
  get source(): string {
    return `https://player.bilibili.com/player.html?aid=${this.avid}&page=${this.p}&high_quality=1`;
  }
}
// player.bilibili.com/player.html?aid=20544123&bvid=BV1rW411W71F
</script>