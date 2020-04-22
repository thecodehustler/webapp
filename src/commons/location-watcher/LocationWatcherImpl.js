import LoDash from 'lodash';

let geo = navigator.geolocation;
let instance;

export function LocationWatcherCallbacks(onSuccess, onError) {
  this.success = onSuccess;
  this.error = onError;
}

class GeoWatch {
  constructor() {
    this.registeredCallbacks = new Map(); // map of LocationWatcherCallbacks
    this._watchID = null;
    this._cachedCoords = null;
    this.enabledIDs = [];
    console.log("GeoWatch: ct called.");

    this.invokeCallbacksDebounced = LoDash.debounce(pos => {
      for (const id of this.enabledIDs) {
        if (this.registeredCallbacks.has(id)) {
          let a = this.registeredCallbacks.get(id);
          console.log(a);
          a.success(pos);
        }
      }
    }, 3000, {
      leading: true
    });
    this.onError = err => {
      for (const id of this.enabledIDs) {
        if (this.registeredCallbacks.has(id))
          this.registeredCallbacks.get(id).error(err);
      }
    }
  }

  registerCallbacks(callbacks, callbackID) {
    if (typeof callbackID != 'string') {
      throw Error("Key must be a string.");
    }
    console.log("GeoWatch: callback registered: " + callbackID);
    this.registeredCallbacks.set(callbackID, callbacks);
    if (this._cachedCoords) {
      this.invokeCallbacksDebounced(this._cachedCoords);
    }
  }

  enableCallback(id) {
    if (this.enabledIDs.lastIndexOf(id) == -1) {
      this.enabledIDs.push(id);
    }
    this.startWatching();
  }

  disableCallback(id) {
    if (this.enabledIDs.lastIndexOf(id) != -1) {
      this.enabledIDs.splice(this.enabledIDs.lastIndexOf(id), 1);
    }
    if (this.enabledIDs.length == 0) {
      this.stopWatching();
    }
  }

  unregisterCallbacks(callbackID) {
    if (this.registeredCallbacks.has(callbackID)) {
      this.registeredCallbacks.delete(callbackID);
      // delete this.registeredCallbacks[callbackID];
    }
    this.disableCallback(callbackID);
    console.log("Geowatch: callback unregistered: " + callbackID);
  }

  startWatching() {
    if (this._watchID == undefined) { // not watching.
      this._watchID = geo.watchPosition((coords) => {
        this._cachedCoords = coords;
        this.invokeCallbacksDebounced(coords);
      }, this.onError, {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000
      });
      console.log("GeoWatch: started, " + this._watchID);
    }
  }

  stopWatching() {
    if (this._watchID) {
      geo.clearWatch(this._watchID);
      for (let cb of this.registeredCallbacks) {
        if (cb.stop) {
          cb.stop();
        }
      }
    }
    console.log("GeoWatch: stopped, " + this._watchID);
    this._watchID = undefined;
    this._cachedCoords = undefined;
  }



  get isWatching() {
    return this._watchID != undefined;
  }
}

if (!instance) {
  instance = new GeoWatch;
  globalThis.GeoWatcher = instance;
}

const GEOWATCHER_STATES = {
  STOPPED: 0,
  PENDING: 1,
  FAILED: 2,
  ONGOING: 3
};

export { instance as default, GEOWATCHER_STATES };