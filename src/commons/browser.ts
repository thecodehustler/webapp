export enum Vendor {
  Unknown,
  IExplorer,
  Chrome, 
  Firefox,
  Safari,
  EdgeLegacy,
  WeChat,
}

export enum OSType {
  Unknown,
  Windows,
  MacOS,
  Linux,
  Android,
  iOS,
}

class Features {
  webgl: boolean;
  intersectionObserver: boolean;

  constructor() {
    // Feature detection code here.
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    this.webgl = (context!==null && context instanceof WebGLRenderingContext);
    this.intersectionObserver = ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype);
  }
}

class HostInfo {
  osMajorLanguage: string;
  osType: OSType = OSType.Unknown;
  // deviceType // Vuetify 会帮我们做出判断的。

  constructor() {
    this.osMajorLanguage = navigator.language.slice(0, 2);
    if (navigator.platform.toLowerCase().indexOf('win')) {
      this.osType = OSType.Windows;
    } // else {}
  }
}

class BrowserDetect {
  vendor: Vendor = Vendor.Unknown;
  versionInt = 0;
  features: Features = new Features();
  host: HostInfo = new HostInfo();

  constructor() {
    if ('documentMode' in window.document) { // if documentMode exists.
      this.vendor = Vendor.IExplorer;
      this.versionInt = parseInt(window.document["documentMode"]);
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
      this.vendor = Vendor.Chrome;
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
      this.vendor = Vendor.Firefox;
    }
  }
}

const Browser = new BrowserDetect();

export {Browser};