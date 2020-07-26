<template>
  <div class="cesium-viewer-root">
    <!-- <div class="debug-float" v-if="debug.show">
      <v-card max-height="320">
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
    </div> -->

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
      @renderError="onRenderError"
      :showRenderLoopErrors="false"
      :useDefaultRenderLoop="useDefaultRenderLoop"
    >
      <!-- Terrains -->
      <vc-provider-terrain-cesium ref="terrain"></vc-provider-terrain-cesium>
      <!-- 3D tileset -->
      <vc-primitive-tileset
        v-for="tileset in innerData.Primitives.Tilesets"
        :url="tileset.url"
        :key="tileset.key"
        :modelMatrix="tileset.modelMatrix"
        :show="tileset.show"
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
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 300000; //相机高度的最大值
  viewer.scene.globe.depthTestAgainstTerrain = true;
}

/**
 * Vue Component starts here...
 */
export default {
  name: "CesiumViewer",
  data() {
    return {
        useDefaultRenderLoop: true
      // debug: {
      //   show: true,
      //   locationOnGlobe: new CVDataTypes.LocationOnGlobe(),
      //   cameraPosition: new CVDataTypes.CameraParameters(),
      //   hide: true,
      // }
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
      const o = {
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
  methods: { // Called when Cesium and viewer is ready.
    onCesiumReady(cesiumInstance) {
      // 当前版本的 Cesium 有一个 bug，
      // 导致无法加载用于解压被压缩过的 KMZ 的 Worker.
      // 这里与 HTML 代码配对，来直接载入
      Cesium.zip.useWebWorkers = false;
      Cesium.zip.Inflater = window.zip.Inflater;
      Cesium.zip.Deflater = window.zip.Deflater;

      this.viewer = cesiumInstance.viewer; // 保留一份本地副本。
      const viewer = this.viewer;
      console.log("Cesium is ready to operate.");
      setupViewer(this, viewer);
      this.$emit("ready", cesiumInstance);
    },
    onCameraMoveStart() {
      this.$emit("cameraMoveStart");
    },
    onCameraMoveEnd() {
      const camP = new CVDataTypes.CameraParameters();
      const cat = this.viewer.camera.positionCartographic;
      camP.position = {
        lat: Cesium.Math.toDegrees(cat.latitude),
        lng: Cesium.Math.toDegrees(cat.longitude),
        height: cat.height
      };
      camP.heading = Cesium.Math.toDegrees(this.viewer.camera.heading);
      camP.pitch = Cesium.Math.toDegrees(this.viewer.camera.pitch);
      camP.roll = Cesium.Math.toDegrees(this.viewer.camera.roll);
      this.$emit("cameraMoveEnd", camP);
    },
    onMouseMove(event) {
      const ret = new CVDataTypes.LocationOnGlobe();
      const viewer = this.viewer;
      // 屏幕坐标转为世界坐标
      const ray = viewer.camera.getPickRay(event.endPosition);
      const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(cartesian)) {
        // 笛卡尔坐标转为地理坐标
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        ret.longitude = Cesium.Math.toDegrees(cartographic.longitude);
        ret.latitude = Cesium.Math.toDegrees(cartographic.latitude);
        ret.above = viewer.scene.globe.getHeight(cartographic);
        ret.height = cartographic.height;
        const toEmit = {
          viewer: this.viewer,
          event: event
        };
        this.$emit("mouseOnGlobe", toEmit);
        // this.debug.locationOnGlobe = ret;
      }
    },
    onSelectedEntityChanged(entity) {
      const toEmit = {
        entity,
        viewer: this.viewer
      };
      this.$nextTick(() => {
        this.$emit("selectedEntityChanged", toEmit);
        // 尝试规避一些鼠标单击事件的问题。
      })
    },
    onRenderError(scene, error) {
      // console.log('Render error: ', error);
      this.$emit('error', error);
      // this.useDefaultRenderLoop = true;
    },
    // resolveWhenReady() {
    //   return new Promise(resolve => {
    //     let id = setInterval(() => {
    //       if (this.cesiumInstance) {
    //         resolve(this.cesiumInstance);
    //         clearInterval(id);
    //       }
    //     });
    //   });
    // },
    // 这些方法事实上没有被使用了
    clearSelection() {
      this.viewer.selectedEntity = undefined;
    },

    // async getCesiumInstance() {
    //   if (this.cesiumInstance) {
    //     return this.cesiumInstance;
    //   } else {
    //     return await this.resolveWhenReady();
    //   }
    // },
    // getVCViewer() {}
  }
};
</script>

<style>
div.cesium-viewer-root {
  /* height: 100%;
  width: 100%; */
  padding: 0;
  margin: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
/* 
div.debug-float {
  position: fixed;
  left: 4px;
  top: 4px;
  z-index: 9999;
} */
</style>