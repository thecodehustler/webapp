<template>
  <vc-viewer
    @ready="onCesiumReady"
    :infoBox="false"
    :logo="false"
    :scene3DOnly="true"
    :camera="cameraParameters"
  >
    <!-- 3D tileset -->
    <vc-primitive-3dtileset
      v-for="tileset in innerData.Primitives.Tilesets"
      :url="tileset.url"
      :key="tileset.url"
      :modelMatrix="tileset.modelMatrix"
      @readyPromise="tileset.onReady($event, tileset)"
    ></vc-primitive-3dtileset>

    <vc-layer-imagery v-for="imagery in innerData.Imagerys" :key="imagery.index">
      <vc-provider-imagery-urltemplate v-if="imagery.URLTemplate" :url="imagery.URLTemplate.url"></vc-provider-imagery-urltemplate>
      <vc-provider-imagery-bingmaps
        v-else-if="imagery.BingMaps"
        :url="imagery.BingMaps.url"
        :mapstyle="imagery.BingMaps.mapStyle"
      ></vc-provider-imagery-bingmaps>
    </vc-layer-imagery>
  </vc-viewer>
</template>

<script>

import { ViewerData, Tileset, CameraParameters } from './CesiumViewerTypes';

function setupViewer(vm, viewer) {
  viewer.imageryLayers.removeAll(); // 移除掉自带的那个图层；
}

/**
 * Vue Components starts here...
 */
export default {
  name: "CesiumViewer",
  data() {
    return {
      cesiumData: null
    };
  },
  props: {
    innerData: {
      type: ViewerData,
      required: true
    },
    cameraParameters: {
      type: CameraParameters,
      required: false
    }
  },

  created() {
    this.$data.cesiumData = this.$props.innerData;
    this.flyTo = (options) => {
      console.log('called!!!');
      if (this.cesiumInstance.viewer.scene.camera) {
        if (typeof options == "CameraParameters"){
          let o = {
            destination: Cesium.Cartesian3.fromDegrees(
              options.position.lng, options.position.lat, options.position.height
            ),
            orientation: Cesium.HeadingPitchRoll.fromDegrees(
              options.heading, options.pitch, options.roll
            )
          }

          this.cesiumInstance.viewer.scene.camera.flyTo(o);
        }
      }
    }
  },
  methods: {
    onCesiumReady(cesiumInstance) {
      let { Cesium, viewer } = cesiumInstance;
      console.log("Cesium is ready to operate.");
      setupViewer(this, viewer);
      this.$emit("ready", cesiumInstance);
    },
    onCameraMoveStart() {
      this.$emit("cameraMoveStart");
    },
    onCameraMoveEnd() {
      this.$emit('cameraMoveEnd');
    }
  }
};

// export { ViewerData, Tileset };
</script>

<style>
</style>