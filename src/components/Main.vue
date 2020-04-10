<template>
  <v-container class="fill-height" ma-0>
    <div class="viewer-fill fixed">
      <CesiumViewer :innerData="cesiumData" @ready="onCesiumReady"></CesiumViewer>
    </div>
    <v-card>
      <v-card-title>调试信息</v-card-title>
      <v-card-subtitle>我要死了</v-card-subtitle>
      <v-card-text>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import CesiumViewer from "./cesium-viewer/CesiumViewer";
import { ViewerData } from "./cesium-viewer/CesiumViewer";

export default {
  data: () => {
    return {
      cesiumData: new ViewerData(),
    };
  },
  methods: {
    onCesiumReady(cesiumInstance) {
      // Called when Cesium is ready.
      console.log("CesiumViewer is ready to operate.");
      // console.log(Cesium); // Cesium 现在已经可以以一个全局变量的方式被访问。
      this.cesiumData.Imagerys.push({
        index: 1,
        URLTemplate: {
          url: "https://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}"
        }
      }); // 加入 Google 地球图层。
      this.cesiumData.Primitives.Tilesets.push({
        url: 'http://127.0.0.1:7999/upgraded/Production_1.json',
        modelMatrix: Cesium.Matrix4.IDENTITY
      })
    }
  },
  components: {
    CesiumViewer
  },
  created() {
  },
  computed: {
  }
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