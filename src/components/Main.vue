<template>
  <v-container class="fill-height flex-grow-1 flex-shrink-0 ma-0 pa-0">
    <v-overlay absolute opacity="0.9" :value="!imageryReady">
      <v-progress-circular size="96" indeterminate></v-progress-circular>
    </v-overlay>
    <LocationWatcher :enabled="true" id="CB" @update="locationUpdated"></LocationWatcher>
    <div class="viewer-fill fixed">
      <CesiumViewer
        :innerData="cesiumData"
        @ready="onCesiumReady"
        :cameraParameters="camera"
        @selectedEntityChanged="entityChanged"
        @mouseOnGlobe="mouseOnGlobe"
        ref="viewer"
      ></CesiumViewer>
      <MainToolbar @locBtnClick="onFABClick" :state="locationWatcherStates"></MainToolbar>
      <ArticleOverlay :url="debug.sampleURL" v-model="debug.showArticle" ref="article"></ArticleOverlay>
    </div>
  </v-container>
</template>

<script>
"use strict";

import "../commons/location-watcher/LocationWatcherComponent";
import CesiumViewer from "./cesium-viewer/CesiumViewer.vue";
import ArticleOverlay from "./article-overlay/ArticleOverlay.vue";
import MainToolbar from "./main-toolbar/MainToolbar.vue";

import {
  ViewerData,
  // eslint-disable-next-line no-unused-vars
  Tileset,
  CameraParameters,
  KMLData
} from "./cesium-viewer/CesiumViewerTypes";
import { States } from "./location-button/LocationFAB";
import CesiumHtmlOverlay from "./cesium-viewer/cesium-html-overlay/CesiumHtmlOverlay";

export default {
  data: () => {
    return {
      cesiumData: new ViewerData(),
      imageryReady: false,
      debug: {
        sampleArticle: {
          name: "Sample Title",
          subtitle: "Sample subtitle",
          description: "TEXT TEXT"
        },
        sampleURL: "/info?landmarkID=1",
        showArticle: false
      },
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
        new KMLData("/kmls/sample.kml").ready(ret => {
          console.log("New KML Loaded,", ret);
          ret.viewer.flyTo(ret.cesiumObject);
          this.imageryReady = true;
        })
      );
    },
    entityChanged(obj) {
      console.log(obj);
      if (Cesium.defined(obj.entity)) {
        this.debug.showArticle = true;
      } else {
        // 在这里添加逻辑。
        this.debug.showArticle = false;
      }
    },
    onFABClick() {
      console.log("clicked.");
      this.locationWatcherStates = States.RUNNING;
      switch (this.locationWatcherStates) {
        case States.RUNNING:
          this.locationWatcherStates = States.STOPPED;
      }
    },
    mouseOnGlobe(obj) {
      // 鼠标悬浮在某个尸体上的时候触发。
      let pickedPrimitive = obj.viewer.scene.pick(obj.event.endPosition);
      let pickedEntity = Cesium.defined(pickedPrimitive)
        ? pickedPrimitive.id
        : undefined;
      if (Cesium.defined(this.cached) && Cesium.defined(this.cached.label)) {
        this.cached.label.scale = 1.0;
      }
      if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.label)) {
        pickedEntity.label.scale = 1.5;
        this.cached = pickedEntity;
      }
    },
    locationUpdated(coord) {
      console.log(coord);
    }
  },
  components: {
    CesiumViewer,
    CesiumHtmlOverlay,
    ArticleOverlay,
    MainToolbar
  },
  created() {},
  computed: {},
  watch: {
    "debug.showArticle": function(newVal) {
      if (!newVal) {
        let v = this.$refs.viewer;
        console.log(v);
        v.clearSelection();
      }
    }
  }
};
</script>

<style>
.viewer-fill {
  height: 100%;
  width: 100%;
}

.fixed {
  position: absolute;
}
</style>