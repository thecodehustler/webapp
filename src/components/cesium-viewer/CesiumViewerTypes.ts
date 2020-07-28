/**
 * 数据类型定义。
 */

export function CameraParameters(options) {
  const o = {
    position: {
      lng: 0,
      lat: 0,
      height: 0
    },
    heading: 0,
    pitch: 0,
    roll: 0
  };
  Object.assign(this, o, options);
  // LD.assign(this, o, options);
}

export class Tileset {
  constructor(options) {
    this.show = false;
    LD.assign(this, options);
    this.proxyReady = function (vueEvent, tileset) {
      console.log('proxy called.');
      if (this.onReady) {
        this.onReady(vueEvent, tileset);
      }
    };
  }
}

export class KMLData {
  url: string;
  show = true;
  clampToGround = true;
  _ready: Function|undefined = undefined;
  ready(callback: Function) {
    this._ready = callback;
    return this;
  }
  options = {};

  proxyReady(obj: any, thiz: KMLData) {
    if (typeof thiz._ready == 'function')
      thiz._ready(obj);
  }
  constructor(url: string) {
    this.url = url;
    this.options = {
      clampToGround: true,
    };
  }

}


export class ViewerData {
  constructor() {
    this.Imagerys = [];
    /**
     * Imagery: {index: '', BingMaps.optional: {url, mapStyle}, URLTemplate.optional: {url}}
     */
    this.TerrainProviders = [];
    this.DataSources = {
      CZMLData: [],
      GeoJSONData: [],
      KMLData: []
      /**
       * KMLData: {url: 'url to kmz file', show: boolean}
       */
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
     * Tilesets: {url: 'your url to tileset', modelMatrix: Cesium.Matrix4, onReady: function(tileset){}}
     */
  }
}

export class LocationOnGlobe {
  constructor() {
    this.longitude = 0;
    this.latitude = 0;
    this.above = 0;
    this.height = 0;
  }
}
