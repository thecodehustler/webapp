<template>
  <v-container class="fill-height flex-grow-1 flex-shrink-0 ma-0 pa-0" fluid>
    <v-row no-gutters class="fill-height">
      <v-col>
        <v-overlay absolute opacity="0.9" :value="!imageryReady">
          <v-progress-circular size="96" indeterminate></v-progress-circular>
        </v-overlay>
        <!-- <LocationWatcher :enabled="true" id="CB" @update="locationUpdated"></LocationWatcher> -->
        <div class="viewer-fill">
          <!-- 这就很神必了好伐 -->
          <CesiumViewer
            :innerData="cesiumData"
            @ready="onCesiumReady"
            :cameraParameters="camera"
            @selectedEntityChanged="entityChanged"
            @mouseOnGlobe="mouseOnGlobe"
            ref="viewer"
          ></CesiumViewer>
        </div>
        <MainToolbar ref="toolbar"></MainToolbar>
        <ArticleOverlay ref="article"></ArticleOverlay>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
"use strict";

import "../commons/location-watcher/LocationWatcherComponent";
import CesiumViewer from "./cesium-viewer/CesiumViewer.vue";
import ArticleOverlay from "./article-overlay/ArticleOverlay.vue";
import MainToolbar from "./main-toolbar/MainToolbar.vue";

let home = new CameraParameters({
  position: cesiumSettings.homePosition,
  heading: 0,
  pitch: -45,
  roll: 0
});

import {
  ViewerData,
  // eslint-disable-next-line no-unused-vars
  Tileset,
  CameraParameters,
  KMLData
} from "./cesium-viewer/CesiumViewerTypes";
import { States } from "./location-button/LocationFAB";
import { mapState } from "vuex";
import {cesiumSettings} from '../config/config';

export default {
  data: () => {
    return {
      cesiumData: new ViewerData(),
      imageryReady: false,
      // debug: {
      //   sampleArticle: {
      //     name: "Sample Title",
      //     subtitle: "Sample subtitle",
      //     description: "TEXT TEXT"
      //   },
      //   sampleURL: "/api/info?landmarkID=2",
      //   showArticle: false
      // },
      camera: new CameraParameters({
        position: {
          lng: 113,
          lat: 40,
          height: 30000
        }
      }),
      locationWatcherStates: States.STOPPED
    };
  },
  methods: {
    onCesiumReady(cesiumInstance) {
      this.viewer = cesiumInstance.viewer;
      let viewer = cesiumInstance.viewer;
      // Called when Cesium is ready.
      console.log("CesiumViewer is ready to operate.");
      // console.log(Cesium); // Cesium 现在已经可以以一个全局变量的方式被访问。

      this.cesiumData.Imagerys.push({
        index: 1,
        URLTemplate: {
          url: cesiumSettings.imageryURLTemplate
        }
      }); // 加入 Google 地球图层。

      Cesium.IonResource.fromAssetId(cesiumSettings.tileset.cesiumIonAssetID).then(resURL => {
        this.tileset = viewer.scene.primitives.add(
          new Cesium.Cesium3DTileset({
            url: resURL,
            show: this.show3D
          })
        );
        console.log(this.tileset);
      });

      this.cesiumData.DataSources.KMLData.push(
        new KMLData(cesiumSettings.kmlDataURL).ready(ret => {
          console.log("New KML Loaded,", ret);
          this.$refs.viewer.flyTo(home);
          this.imageryReady = true;
        })
      );

      this.$refs.toolbar.$on("goHome", () => {
        this.$refs.viewer.flyTo(home);
      });
    },
    entityChanged(obj) {
      console.log(obj);
      if (
        obj.entity &&
        obj.entity.kml.snippet &&
        obj.entity.kml.snippet != ""
      ) {
        this.$store.dispatch(
          "loadFromURL",
          `/api/info?landmarkID=${obj.entity.kml.snippet}`
        );
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
        pickedEntity.label.scale = 1.3;
        this.cached = pickedEntity;
      }
    }
  },
  components: {
    CesiumViewer,
    ArticleOverlay,
    MainToolbar
  },
  created() {},
  computed: {
    ...mapState({
      open: state => state.overlay.open,
      show3D: state => state.show3DBuildings
    })
  },
  watch: {
    open: function(newVal) {
      if (!newVal) {
        // 文章预览关闭之后……
        let v = this.$refs.viewer;
        v.clearSelection(); // 清除 Cesium 的选择状态。
      }
    },
    show3D: function(newVal) {
      if (this.tileset) {
        this.tileset.show = newVal;
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