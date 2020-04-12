<template>
  <v-container class="fill-height" ma-0>
    <div class="viewer-fill fixed">
      <CesiumViewer
        :innerData="cesiumData"
        @ready="onCesiumReady"
        :cameraParameters="camera"
        ref="viewer"
      ></CesiumViewer>
    </div>
    <v-card>
      <v-card-title>调试信息</v-card-title>
      <v-card-subtitle>我要死了</v-card-subtitle>
      <v-card-text>
        Longitude: {{camera.position.lng}}
        <br />
        Latitude: {{camera.position.lat}}
        <br />
        Height: {{camera.position.height}}
      </v-card-text>
    </v-card>
    <LocationFAB @click="onFABClick" :state="locationWatcherStates"></LocationFAB>
  </v-container>
</template>

<script>
import CesiumViewer from "./cesium-viewer/CesiumViewer";
import {
  ViewerData,
  Tileset,
  CameraParameters
} from "./cesium-viewer/CesiumViewerTypes";
import LocationFAB from "./location-button/LocationFAB";
import { States } from "./location-button/LocationFAB";
import LocationWatcher from "../commons/LocationWatcher";

export default {
  data: () => {
    return {
      cesiumData: new ViewerData(),
      _debug: {},
      camera: new CameraParameters({
        position: {
          lng: 113,
          lat: 30,
          height: 300000
        }
      }),
      locationWatcherStates: States.STOPPED
    };
  },
  methods: {
    onCesiumReady(cesiumInstance) {
      this.viewer = cesiumInstance.viewer;
      this.debug = {};
      // Called when Cesium is ready.
      console.log("CesiumViewer is ready to operate.");
      // console.log(Cesium); // Cesium 现在已经可以以一个全局变量的方式被访问。
      this.cesiumData.Imagerys.push({
        index: 1,
        URLTemplate: {
          url: "https://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}"
        }
      }); // 加入 Google 地球图层。
      this.cesiumData.Primitives.Tilesets.push(
        new Tileset({
          url: "http://127.0.0.1:7999/upgraded/Production_1.json",
          modelMatrix: Cesium.Matrix4.IDENTITY,
          onReady: (tileset, object) => {
            console.log(tileset, "loaded", object, this);
            let boundingSphereCenter = tileset.boundingSphere.center; // 包裹球的三维笛卡尔坐标
            let destination = Cesium.Cartographic.fromDegrees(
              117.08,
              35.12,
              400
            ); // 目的地
            let offset = Cesium.Cartesian3.subtract(
              Cesium.Cartographic.toCartesian(destination),
              tileset.boundingSphere.center,
              new Cesium.Cartesian3()
            );
            var moveMatrix = Cesium.Matrix4.fromTranslation(offset);
            object.modelMatrix = moveMatrix;
            this.viewer.scene.primitives.add(
              new Cesium.DebugModelMatrixPrimitive({
                modelMatrix: moveMatrix,
                length: 30000000.0,
                width: 2.0
              })
            );
            this.$refs.viewer.flyTo({
              position: { lng: 117.08, lat: 35.12, height: 2000 },
              heading: 0,
              pitch: -90,
              roll: 0
            });
          }
        })
      );
    },
    onFABClick() {
      console.log("clicked.");
      this.locationWatcherStates = States.RUNNING;
    }
  },
  components: {
    CesiumViewer,
    LocationFAB
  },
  created() {},
  computed: {}
};
</script>

<style>
.viewer-fill {
  height: 100vh;
  width: 100vw;
  left: 0;
  right: 0;
  padding: 0;
  margin: 0;
}

.fixed {
  position: fixed;
}
</style>