<template>
  <div class="float" :style="{top: cssTop, left: cssLeft}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      required: true,
      type: String
    },
    position: {
      required: true,
    }
  },
  name: 'CesiumHtmlOverlay',
  data() {
    return {
      top: 0,
      left: 0
    }
  },
  computed: {
    cssTop() {
      return this.top + 'px';
    },
    cssLeft() {
      return this.left + 'px';
    }
  },
  methods: {
    preRenderListener() {
      let scratch = new Cesium.Cartesian2();
      let position = Cesium.Cartesian3.fromDegrees(position.latitude, position.longitude);
      let canvasPosition = this.$parent.cesiumInstance.scene.cartesianToCanvasCoordinates(position, scratch); // TODO: 改成异步，也就是等到 Cesium Viewer 初始化好了再来调用。
      if (Cesium.defined(canvasPosition)) {
        this.top = canvasPosition.y;
        this.left= canvasPosition.x;
      }
    }
  },
  created() {}
}
</script>

<style>
div.float {
  position: absolute;
  display: flex;
}
</style>