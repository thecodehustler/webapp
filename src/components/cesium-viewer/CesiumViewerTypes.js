/**
 * 数据类型定义。
 */
import LD from 'lodash';

export function CameraParameters(options) {
  let o = {
    position: {
      lng: 0,
      lat: 0,
      height: 0
    },
    heading: 0,
    pitch: 0,
    roll: 0
  };
  // Object.assign(this, o);
  LD.assign(this, o, options);
}

export class Tileset {
  constructor(options) {
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
  constructor(url) {
    this.url = url;
    this.show = true;
    this.clampToGround = true;
    this._ready = undefined; // callback
    this.options = {
      clampToGround: true,
    };
    this.ready = function (f) {
      this._ready = f;
      return this;
    };
    this.proxyReady = function(obj, thiz) {
      if (typeof thiz._ready == 'function')
        thiz._ready(obj);
    }
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
