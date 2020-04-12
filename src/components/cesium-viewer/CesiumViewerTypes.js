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

export function Tileset(options) {
  LD.assign(this, options);
}

export function ViewerData() {
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
   * Tilesets: {url: 'your url to tileset', modelMatrix: Cesium.Matrix4, onReady: function(tileset){}}
   */
}