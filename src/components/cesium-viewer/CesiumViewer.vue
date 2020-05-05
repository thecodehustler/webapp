<template>
  <div class="root">
    <div class="debug-float" v-if="debug.show">
      <v-card>
        <v-card-title @click="debug.hide = !debug.hide">{{$t("home.debug_Title")}}</v-card-title>
        <v-slide-y-transition>
        <v-card-text v-if="!debug.hide">
          <v-subheader>鼠标所在位置</v-subheader>
          {{debug.locationOnGlobe.latitude}}, {{debug.locationOnGlobe.longitude}}
          <br />
          {{debug.locationOnGlobe.above}}
          <v-subheader>相机参数</v-subheader>
          <p>位置：(Lng: {{debug.cameraPosition.position.lng}}, Lat: {{debug.cameraPosition.position.lat}}, {{debug.cameraPosition.position.height}})</p>
          <p>方向：({{debug.cameraPosition.heading}}, {{debug.cameraPosition.pitch}}, {{debug.cameraPosition.roll}})</p>
        </v-card-text>
        </v-slide-y-transition>
      </v-card>
    </div>

    <vc-viewer
      @ready="onCesiumReady"
      :infoBox="false"
      :logo="false"
      :scene3DOnly="true"
      :camera="cameraParameters"
      @moveStart="onCameraMoveStart"
      @moveEnd="onCameraMoveEnd"
      @MOUSE_MOVE="onMouseMove"
      @selectedEntityChanged="onSelectedEntityChanged"
    >
      <!-- Terrains -->
      <vc-provider-terrain-cesium ref="terrain"></vc-provider-terrain-cesium>
      <!-- 3D tileset -->
      <vc-primitive-tileset
        v-for="tileset in innerData.Primitives.Tilesets"
        :url="tileset.url"
        :key="tileset.url"
        :modelMatrix="tileset.modelMatrix"
        @readyPromise="tileset.proxyReady($event, tileset)"
      ></vc-primitive-tileset>
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
    <slot></slot>
  </div>
</template>

<script>
import * as CVDataTypes from "./CesiumViewerTypes";

function setupViewer(vm, viewer) {
  viewer.imageryLayers.removeAll(); // 移除掉自带的那个图层；
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100; //
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000; //相机高度的最大值
  viewer.scene.globe.depthTestAgainstTerrain = true;
}

/**
 * Vue Component starts here...
 */
export default {
  name: "CesiumViewer",
  data() {
    return {
      debug: {
        show: true,
        locationOnGlobe: new CVDataTypes.LocationOnGlobe(),
        cameraPosition: new CVDataTypes.CameraParameters(),
        hide: false,
      }
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
      console.log("flyTo() called!!!");

      this.viewer.scene.camera.flyTo(o);
    };
  },
  methods: {
    onCesiumReady(cesiumInstance) {
      this.viewer = cesiumInstance.viewer; // 保留一份本地副本。
      let viewer = this.viewer;
      console.log("Cesium is ready to operate.");
      setupViewer(this, viewer);
      this.$emit("ready", cesiumInstance);
    },
    onCameraMoveStart() {
      this.$emit("cameraMoveStart");
    },
    onCameraMoveEnd() {
      let camP = this.debug.cameraPosition;
      let cat = this.viewer.camera.positionCartographic;
      camP.position = {
        lat: Cesium.Math.toDegrees(cat.latitude),
        lng: Cesium.Math.toDegrees(cat.longitude),
        height: cat.height
      };
      camP.heading = Cesium.Math.toDegrees(this.viewer.camera.heading);
      camP.pitch = Cesium.Math.toDegrees(this.viewer.camera.pitch);
      camP.roll = Cesium.Math.toDegrees(this.viewer.camera.roll);
      this.$emit("cameraMoveEnd");
    },
    onMouseMove(event) {
      let ret = new CVDataTypes.LocationOnGlobe();
      let viewer = this.viewer;
      // 屏幕坐标转为世界坐标
      let ray = viewer.camera.getPickRay(event.endPosition);
      let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(cartesian)) {
        // 笛卡尔坐标转为地理坐标
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        ret.longitude = Cesium.Math.toDegrees(cartographic.longitude);
        ret.latitude = Cesium.Math.toDegrees(cartographic.latitude);
        ret.above = viewer.scene.globe.getHeight(cartographic);
        ret.height = cartographic.height;
        let toEmit = {
          viewer: this.viewer,
          event: event
        };
        this.$emit("mouseOnGlobe", toEmit);
        this.debug.locationOnGlobe = ret;
      }
    },
    onSelectedEntityChanged(entity) {
      let toEmit = {
        entity,
        viewer: this.viewer
      };
      this.$emit("selectedEntityChanged", toEmit);
    },
    resolveWhenReady() {
      return new Promise(resolve => {
        let id = setInterval(() => {
          if (this.cesiumInstance) {
            resolve(this.cesiumInstance);
            clearInterval(id);
          }
        });
      });
    },
    clearSelection() {
      this.viewer.selectedEntity = undefined;
    },

    async getCesiumInstance() {
      if (this.cesiumInstance) {
        return this.cesiumInstance;
      } else {
        return await this.resolveWhenReady();
      }
    },
    getVCViewer() {}
  }
};
</script>

<style>
div.root {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

div.debug-float {
  position: fixed;
  left: 4px;
  top: 4px;
  z-index: 9999;
}
</style>