<template>
  <v-container class="fill-height" ma-0>
    <LocationWatcher :enabled="true" id="CB" @update="locationUpdated"></LocationWatcher>
    <div class="viewer-fill fixed">
      <CesiumViewer
        :innerData="cesiumData"
        @ready="onCesiumReady"
        :cameraParameters="camera"
        ref="viewer"
      >
        <CesiumHtmlOverlay id="testerFloat" :position="{latitude: 32, longitude: 45}">
          <v-card>
            <v-card-title>台湾</v-card-title>
            <v-card-text>
              <p>台湾是一个怎么样的地方。</p>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn>想去</v-btn>
            </v-card-actions>
          </v-card>
        </CesiumHtmlOverlay>
      </CesiumViewer>
    </div>
    <LocationFAB @click="onFABClick" :state="locationWatcherStates"></LocationFAB>
  </v-container>
</template>

<script>
"use strict";

import "../commons/location-watcher/LocationWatcherComponent";
import AsyncComponents from "../commons/async-components/AsyncComponents";

let CesiumViewer = AsyncComponents.build(
  "components/cesium-viewer/CesiumViewer.vue"
);
import {
  ViewerData,
  // eslint-disable-next-line no-unused-vars
  Tileset,
  CameraParameters,
  KMLData
} from "./cesium-viewer/CesiumViewerTypes";
import LocationFAB from "./location-button/LocationFAB";
import { States } from "./location-button/LocationFAB";
import CesiumHtmlOverlay from "./cesium-viewer/cesium-html-overlay/CesiumHtmlOverlay";
// eslint-disable-next-line no-unused-vars
import Vue from "vue";

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
      let viewer = cesiumInstance.viewer;
      globalThis.Cesium = cesiumInstance.Cesium;
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
          onReady(e, t) {
            console.log(e, t);

            viewer.scene.primitives.add(
              new Cesium.DebugModelMatrixPrimitive({
                modelMatrix: Cesium.Matrix4.fromTranslation(
                  e.boundingSphere.center
                ),
                length: 30000000.0,
                width: 2.0
              })
            );
          }
        })
      );
      this.cesiumData.DataSources.KMLData.push(
        new KMLData("http://127.0.0.1:7999/statics/gadm36_CHN_3.kmz").ready(
          ret => {
            console.log("KML loaded!", ret);
          }
        )
      );
      this.cesiumData.DataSources.KMLData.push(
        new KMLData("http://127.0.0.1:7999/statics/sample.kmz").ready(
          ret => {
            console.log('New KML Loaded,', ret);
          }
        )
      )
    },
    onFABClick() {
      console.log("clicked.");
      this.locationWatcherStates = States.RUNNING;
    },
    locationUpdated(coord) {
      console.log(coord);
      console.log(this.$refs.viewer);
    }
  },
  components: {
    CesiumViewer,
    LocationFAB,
    CesiumHtmlOverlay
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