/**
 * 数据类型定义。
 */
import * as Cesium from "cesium";

interface CP {
  position: {
    lat: 0,
    lng: 0,
    height: 0
  }
  heading: 0;
  pitch: 0;
  roll: 0;
}

export class CameraParameters {
  position = {
    lat: 0,
    lng: 0,
    height: 0
  }
  heading = 0;
  pitch = 0;
  roll = 0;

  constructor(options: CP) {
    Object.assign(this, options);
  }
}

interface TilesetOptions {
  url: string,
  show: boolean,
  onReady?: Function,
}
export class Tileset {
  show = false;
  onReady: Function | undefined = undefined;

  proxyReady(vueEvent: any, tileset: any) {
    console.log('proxy called.');
    if (this.onReady) {
      this.onReady(vueEvent, tileset); // May look further into this.
    }
  }

  constructor(options: TilesetOptions) {
    Object.assign(this, options);
  }
}

export class KMLData {
  url: string;
  show = true;
  clampToGround = true;
  _ready: Function | undefined = undefined;

  // Method
  ready(callback: Function) {
    this._ready = callback;
    return this;
  }

  options = {};

  proxyReady(obj: any, thiz: KMLData) {
    if (typeof thiz._ready === 'function')
      thiz._ready(obj);
  }

  constructor(url: string) {
    this.url = url;
    this.options = {
      clampToGround: true,
    };
  }
}

interface Imagery {
  index: string; // Index for vue.
  BingMaps?: { url: string, mapStyle: any };
  URLTemplate?: string;
}

// interface KMLData {
//   url: string; // URL to your KML data.
//   show: boolean;
// }

// interface Tileset {
//   url: string; // URL to your tileset.
//   modelMatrix: Cesium.Matrix4;
//   onReady: Function;
// }

// interface Entities {
//   Billboards: Array<any>;
//   Models: Array<any>;
// }

export class ViewerData {
  Imagerys: Array<Imagery> = []; // TODO: Typo must be fixed.
  Entities = {
    Billboards: [],
    Models: [],
  };
  DataSources = {
    CZMLData: [],
    GeoJSONData: [],
    KMLData: new Array<KMLData>()
  }
  TerrainProviders = [];
  Primitives = {
    Tilesets: new Array<Tileset>(),
    GLTFModels: []
  }
}

export class LocationOnGlobe {
  longitude = 0;
  latitude = 0;
  above = 0;
  height = 0;

}
