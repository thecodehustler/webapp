<template>
  <div class="float" :style="{top: cssTop, left: cssLeft}" v-if="cesiumUp">
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
      required: true
    },
    clampInViewport: {
      type: Boolean,
    }
  },
  name: "CesiumHtmlOverlay",
  data() {
    return {
      top: 0,
      left: 0,
      cesiumUp: false
    };
  },
  computed: {
    cssTop() {
      return this.top + "px";
    },
    cssLeft() {
      return this.left + "px";
    }
  },
  methods: {
    preRenderListener() {
      let scratch = new Cesium.Cartesian2();
      let position = Cesium.Cartesian3.fromDegrees(
        this.position.latitude,
        this.position.longitude
      );
      let canvasPosition = this.viewer.scene.cartesianToCanvasCoordinates(
        position,
        scratch
      );
      if (Cesium.defined(canvasPosition)) {
        this.top = canvasPosition.y;
        this.left = canvasPosition.x;
      }
    },
    init(cesiumInstance) {
      this.viewer = cesiumInstance.viewer;
      this.viewer.scene.preRender.addEventListener(this.preRenderListener);
      this.cesiumUp = true;
    }
  },
  created() {
    let promise = this.$parent.getCesiumInstance(); // 这要求 CesiumViewer 必须作为他的直接父组件。
    promise.then((instance) => {
      this.init(instance);
    })
  },
  beforeDestroy() {
    this.viewer.preRender.removeEventListener(this.preRenderListener);
  }
};
</script>

<style>
div.float {
  position: absolute;
  display: flex;
  overflow-x: hidden;
}
</style>