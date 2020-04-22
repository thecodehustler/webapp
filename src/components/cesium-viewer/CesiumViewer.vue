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
      @readyPromise="tileset.proxyReady($event, tileset)"
    ></vc-primitive-3dtileset>
    <!-- Imagerys -->
    <vc-layer-imagery v-for="imagery in innerData.Imagerys" :key="imagery.index">
      <vc-provider-imagery-urltemplate v-if="imagery.URLTemplate" :url="imagery.URLTemplate.url"></vc-provider-imagery-urltemplate>
      <vc-provider-imagery-bingmaps
        v-else-if="imagery.BingMaps"
        :url="imagery.BingMaps.url"
        :mapstyle="imagery.BingMaps.mapStyle"
      ></vc-provider-imagery-bingmaps>
    </vc-layer-imagery>
    <!-- KML Data -->
    <vc-datasource-kml
      v-for="kml in innerData.DataSources.KMLData"
      :data="kml.url"
      :show="kml.show"
      :key="kml.url"
      :options="kml.options"
      @ready="kml.proxyReady($event, kml)"
    ></vc-datasource-kml>
  </vc-viewer>
</template>

<script>
import * as CVDataTypes from "./CesiumViewerTypes";

function setupViewer(vm, viewer) {
  viewer.imageryLayers.removeAll(); // 移除掉自带的那个图层；
}

/**
 * Vue Component starts here...
 */
export default {
  name: "CesiumViewer",
  data() {
    return {
    };
  },
  props: {
    innerData: {
      type: CVDataTypes.ViewerData,
      required: true
    },
    cameraParameters: {
      type: CVDataTypes.CameraParameters,
      required: false
    }
  },

  created() {
    this.flyTo = options => {
      console.log("flyTo() called!!!");
      if (this.cesiumInstance.viewer.scene.camera) {
        if (typeof options === typeof CameraParameters) {
          let o = {
            destination: Cesium.Cartesian3.fromDegrees(
              options.position.lng,
              options.position.lat,
              options.position.height
            ),
            orientation: Cesium.HeadingPitchRoll.fromDegrees(
              options.heading,
              options.pitch,
              options.roll
            )
          };

          this.cesiumInstance.viewer.scene.camera.flyTo(o);
        }
      }
    };
  },
  methods: {
    onCesiumReady(cesiumInstance) {
      this.cesiumInstance = cesiumInstance; // 保留一份本地副本。
      let viewer = cesiumInstance.viewer;
      console.log("Cesium is ready to operate.");
      setupViewer(this, viewer);
      this.$emit("ready", cesiumInstance);
      viewer.scene.globe.depthTestAgainstTerrain = true;
    },
    onCameraMoveStart() {
      this.$emit("cameraMoveStart");
    },
    onCameraMoveEnd() {
      this.$emit("cameraMoveEnd");
    }
  }
};
</script>

<style>
</style>