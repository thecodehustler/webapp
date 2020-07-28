<template>
  <div class="hover" @click="selfClose()">
    <div class="float" :style="{top: cssTop, left: cssLeft}" v-if="cesiumUp">
      <slot></slot>
    </div>
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
      // 钳制到视图以内。
      type: Boolean
    }
  },
  name: "CesiumHtmlOverlay",
  data() {
    return {
      top: 0,
      left: 0,
      cesiumUp: false,
      show: true
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
      const scratch = new Cesium.Cartesian2();
      const position = Cesium.Cartesian3.fromDegrees(
        this.position.latitude,
        this.position.longitude
      );
      const canvasPosition = this.viewer.scene.cartesianToCanvasCoordinates(
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
    },
    selfClose() {
      this.show = false;
    }
  },
  created() {
    const promise = this.$parent.getCesiumInstance(); // 这要求 CesiumViewer 必须作为他的直接父组件。
    promise.then(instance => {
      this.init(instance);
    });
  },
  beforeDestroy() {
    this.viewer.preRender.removeEventListener(this.preRenderListener);
  }
};
</script>

<style>
div.hover {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}
div.float {
  position: absolute;
  display: flex;
}
</style>