<template>
  <div class="root">
    <div class="debug-float">
      <v-card>
        <v-card-title>{{$t("home.debug_Title")}}</v-card-title>
        <v-card-text>
          <v-subheader>鼠标所在位置</v-subheader>
          {{debug.locationOnGlobe.latitude}}, {{debug.locationOnGlobe.longitude}}
          <br />
          {{debug.locationOnGlobe.above}}
          <v-subheader>相机参数</v-subheader>
        </v-card-text>
      </v-card>
    </div>

    <vc-viewer
      @ready="onCesiumReady"
      :infoBox="false"
      :logo="false"
      :scene3DOnly="true"
      :camera="cameraParameters"
      @MOUSE_MOVE="onMouseMove"
      @selectedEntityChanged="onSelectedEntityChanged"
    >
      <!-- Terrains -->
      <vc-provider-terrain-cesium ref="terrain"></vc-provider-terrain-cesium>
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
    <slot></slot>
  </div>
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
      debug: {
        locationOnGlobe: new CVDataTypes.LocationOnGlobe()
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
      this.viewer = cesiumInstance.viewer; // 保留一份本地副本。
      let viewer = this.viewer;
      console.log("Cesium is ready to operate.");
      setupViewer(this, viewer);
      this.$emit("ready", cesiumInstance);
      viewer.scene.globe.depthTestAgainstTerrain = true;
      // this.scrEventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      // this.scrEventHandler.setInputAction(event => {
      // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    },
    onCameraMoveStart() {
      this.$emit("cameraMoveStart");
    },
    onCameraMoveEnd() {
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
        this.$emit("mouseOnGlobe", ret);
        this.debug.locationOnGlobe = ret;

        // 鼠标悬浮在某个尸体上的时候触发。
        let pickedPrimitive = viewer.scene.pick(event.endPosition);
        let pickedEntity = Cesium.defined(pickedPrimitive)
          ? pickedPrimitive.id
          : undefined;
        if (Cesium.defined(pickedEntity)) {
          let toEmit = {
            entity: pickedEntity,
            viewer: this.viewer
          }
          this.$emit("hoverOnEntity", toEmit);
        }
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