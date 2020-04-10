<template>
  <vc-viewer @ready="onCesiumReady" :infoBox="false" :logo="false">
    <!-- 3D tileset -->
    <vc-primitive-3dtileset
      v-for="tileset in innerData.Primitives.Tilesets"
      :url="tileset.url"
      :key="tileset.url"
      :modelMatrix="tileset.modelMatrix"
    ></vc-primitive-3dtileset>

    <vc-layer-imagery v-for="imagery in innerData.Imagerys" :key="imagery.index">
      <vc-provider-imagery-urltemplate v-if="imagery.URLTemplate" :url="imagery.URLTemplate.url"></vc-provider-imagery-urltemplate>
      <vc-provider-imagery-bingmaps
        v-else-if="imagery.BingMaps"
        :url="imagery.BingMaps.url"
        :mapstyle="imagery.BingMaps.mapStyle"
      ></vc-provider-imagery-bingmaps>
    </vc-layer-imagery>
  </vc-viewer>
</template>

<script>
function setupViewer(vm, viewer) {
  viewer.imageryLayers.removeAll(); // 移除掉自带的那个图层；
}

function ViewerData() {
  this.Imagerys = [];
  /**
   * Imagery: {index: '', BingMaps.optional {url, mapStyle}, URLTemplate.optional:{url}}
   */
  this.TerrainProviders = [];
  this.DataSources = {
    CZMLData: [],
    GeoJSONData: [],
    KMLData: []
  };
  this.Entities = {
    Billboards: [],
    Models: []
  };
  this.Primitives = {
    Tilesets: [],
    GLTFModels: []
  };
  /**
   * Tilesets: {url: 'your url to tileset', modelMatrix: Cesium.Matrix4}
   */
}

export default {
  name: "CesiumViewer",
  data() {
    return {
      cesiumData: null
    };
  },
  props: {
    innerData: {
      type: ViewerData,
      required: true
    }
  },

  created() {
    this.$data.cesiumData = this.$props.innerData;
  },
  methods: {
    onCesiumReady(cesiumInstance) {
      let { Cesium, viewer } = cesiumInstance;
      console.log("Cesium is ready to operate.");
      setupViewer(this, viewer);
      this.$emit("ready", cesiumInstance);
    }
  }
};

export { ViewerData };
</script>

<style>
</style>