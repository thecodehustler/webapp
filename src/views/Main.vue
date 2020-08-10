<template>
  <v-container class="fill-height flex-grow-1 flex-shrink-0 ma-0 pa-0" fluid>
    <v-row no-gutters class="fill-height">
      <v-col>
        <!--        <v-overlay absolute opacity="0.9" :value="!imageryReady">-->
        <!--          <v-progress-circular size="96" indeterminate></v-progress-circular>-->
        <!--        </v-overlay>-->
        <NotSupported :error-title="$t('home.cesium_RenderErrorTitle')"
                      :error-description="$t('home.cesium_RenderErrorDescription')" v-if="renderErrorOccurred">
          <template v-slot:addition>
            <v-col>
              <v-btn @click="reload">{{ $t('app.action_refresh') }}</v-btn>
            </v-col>
          </template>
        </NotSupported>
        <div class="viewer-fill">
          <!-- 这就很神必了好伐 -->
          <CesiumViewer
              :innerData="cesiumData"
              @ready="onCesiumReady"
              :cameraParameters="camera"
              @selectedEntityChanged="entityChanged"
              @mouseOnGlobe="mouseOnGlobe"
              @error="onRenderError"
              ref="viewer"
              v-show="!renderErrorOccurred"
          ></CesiumViewer>
        </div>
        <MainToolbar ref="toolbar" :is-loading="!imageryReady"></MainToolbar>
        <!-- 计划是通过路由来控制组件的可见性 -->
        <div id="scrub">
          <router-view name="fs"></router-view>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
"use strict";
import CesiumViewer from "../components/cesium-viewer/CesiumViewer.vue";
import MainToolbar from "../components/main-toolbar/MainToolbar.vue";
import {ViewerData, Tileset, CameraParameters, KMLData} from "@/components/cesium-viewer/CesiumViewerTypes";
import {cesiumSettings} from "@/config/config";
import NotSupported from "@/components/not-supported-view/NotSupported.vue";

const home = new CameraParameters({
  position: cesiumSettings.homePosition,
  heading: 0,
  pitch: -45,
  roll: 0
});

import {Vue, Component, Watch} from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import {Viewer} from "cesium";
import * as Cesium from "cesium";

const overlay = namespace('overlay');

@Component({
  components: {
    NotSupported,
    CesiumViewer,
    MainToolbar,
  }
})
export default class Main extends Vue {
  // Rendering error handling.
  renderErrorOccurred = false;
  renderErrorInfo = '';
  onRenderError(ret: Error) {
    console.log('Render Error!', ret);
    this.renderErrorOccurred = true;
    this.renderErrorInfo = ret.toString();
  }

  // Determine if everything loaded up.
  imageryReady = false;

  camera = new CameraParameters({
    position: {
      lng: 117.62396258879075,
      lat: 40.12260573122965,
      height: 10000
    },
    roll: 0,
    pitch: -45,
  });
  cesiumData = new ViewerData();

  /**
   * Called when VueCesium reports that Cesium is ready.
   **/
  onCesiumReady(cesiumInstance) {
    this.viewer = cesiumInstance.viewer as Viewer;
    const viewer = cesiumInstance.viewer;
    console.log("Main:", "CesiumViewer is ready to operate.");
    // console.log(Cesium); // Cesium 现在已经可以以一个全局变量的方式被访问。

    this.cesiumData.Imagerys.push({
      index: 1,
      URLTemplate: {
        url: cesiumSettings.imageryURLTemplate
      }
    }); // 加入 Google 地球图层。

    Cesium.IonResource.fromAssetId(
        cesiumSettings.tileset.cesiumIonAssetID
    ).then((resURL: string) => {
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
  }

  /**
   * Called when the selected Entity changed.
   **/
  entityChanged(obj) {
    // console.log(obj);
    if (
        obj.entity &&
        obj.entity.kml.snippet &&
        obj.entity.kml.snippet != ""
    ) {
      this.$router
          .push({
            name: "Landmark",
            query: {id: obj.entity.kml.snippet}
          });
    } else {
      this.$refs.viewer.clearSelection();
      // this.$router.replace('/');
    }
  }
  /** Called when your mouse is on the globe. */
  mouseOnGlobe(obj) {
    // 鼠标悬浮在某个尸体上的时候触发。
    const pickedPrimitive = obj.viewer.scene.pick(obj.event.endPosition);
    const pickedEntity = Cesium.defined(pickedPrimitive)
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
  /** Reload this page. */
  reload() {
    location.reload();
  }

  @State(state => state.show3DBuildings) show3D !: boolean;
  @overlay.State('open') open!: boolean;

  @Watch('open') onArticleStateChanged(newState: boolean) {
    if (!newState) {
      const v = this.$refs.viewer;
      v.clearSelection(); // 清除 Cesium 的选择状态。
    }
  }

  @Watch('show3D') onShow3DChanged(newState: boolean) {
    if (this.tileset) {
      this.tileset.show = newState;
    }
  }
}



/*
export default {
  data: () => {
    return {
      renderErrorOccurred: false,
      renderErrorInfo: '',
      cesiumData: new ViewerData(),
      imageryReady: false,
      camera: new CameraParameters({
        position: {
          lng: 113,
          lat: 40,
          height: 30000
        }
      }),
    };
  },
  methods: {
    onCesiumReady(cesiumInstance) {
      this.viewer = cesiumInstance.viewer as Viewer;
      const viewer = cesiumInstance.viewer;
      // Called when Cesium is ready.
      console.log("CesiumViewer is ready to operate.");
      // console.log(Cesium); // Cesium 现在已经可以以一个全局变量的方式被访问。

      this.cesiumData.Imagerys.push({
        index: 1,
        URLTemplate: {
          url: cesiumSettings.imageryURLTemplate
        }
      }); // 加入 Google 地球图层。

      Cesium.IonResource.fromAssetId(
          cesiumSettings.tileset.cesiumIonAssetID
      ).then((resURL: string) => {
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
        this.$router
            .push({
              name: "Landmark",
              query: {id: obj.entity.kml.snippet}
            })
            .then(() => {

            });
      } else {
        // this.$router.replace('/');
      }
    },

    mouseOnGlobe(obj) {
      // 鼠标悬浮在某个尸体上的时候触发。
      const pickedPrimitive = obj.viewer.scene.pick(obj.event.endPosition);
      const pickedEntity = Cesium.defined(pickedPrimitive)
          ? pickedPrimitive.id
          : undefined;
      if (Cesium.defined(this.cached) && Cesium.defined(this.cached.label)) {
        this.cached.label.scale = 1.0;
      }
      if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.label)) {
        pickedEntity.label.scale = 1.3;
        this.cached = pickedEntity;
      }
    },

    onRenderError(ret) {
      console.log('Render Error!', ret);
      this.renderErrorOccurred = true;
      this.renderErrorInfo = ret.toString();
    },
    reload() {
      location.reload();
    }
  },
  components: {
    NotSupported,
    CesiumViewer,
    MainToolbar,
  },
  created() {
  },
  computed: {
    ...mapState({
      open: state => state.overlay.open,
      show3D: state => state.show3DBuildings
    })
  },
  watch: {
    open: function (newVal) {
      if (!newVal) {
        // 文章预览关闭之后……
        const v = this.$refs.viewer;
        v.clearSelection(); // 清除 Cesium 的选择状态。
      }
    },
    show3D: function (newVal) {
      if (this.tileset) {
        this.tileset.show = newVal;
      }
    }
  }
};*/
</script>

<style lang="scss">
.viewer-fill {
  height: 100%;
  width: 100%;
}

.fixed {
  position: absolute;
}

div#scrub {
  position: fixed;
}
</style>