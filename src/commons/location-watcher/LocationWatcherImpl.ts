import {debounce} from 'lodash';

const geo = navigator.geolocation;

export class LocationWatcherCallbacks {
  success: PositionCallback;
  error: Function;

  constructor(onSuccess: PositionCallback, onError: PositionCallback) {
    this.success = onSuccess;
    this.error = onError;
  }
}

class GeoWatch {
  registeredCallbacks: Map<string, LocationWatcherCallbacks> = new Map();
  _watchID: number | null = null;
  enabledIDs: Array<string> = [];
  _cachedCoords: Position | null = null;

  onSuccess(pos: Position) {
    for (const id of this.enabledIDs) {
      if (this.registeredCallbacks.has(id)) {
        const a = this.registeredCallbacks.get(id);
        console.log(a);
        if (a) a.success(pos);
      }
    }
  }

  onError(err: PositionError) {
    for (const id of this.enabledIDs) {
      if (this.registeredCallbacks.has(id)) {
        const a = this.registeredCallbacks.get(id);
        if (a) {
          a.error(err);
          // const b: Function = (a.error || function(e){});
          // (err);
        }
      }
    }
  }

  invokeCallbacksDebounced = debounce(this.onSuccess, 3000, {
    leading: true
  });

  constructor() {
    console.log("GeoWatch: ct called.");
  }

  registerCallbacks(callbacks: LocationWatcherCallbacks, callbackID: string) {
    console.log("GeoWatch: callback registered: " + callbackID);
    this.registeredCallbacks.set(callbackID, callbacks);
    if (this._cachedCoords) {
      this.invokeCallbacksDebounced(this._cachedCoords);
    }
  }

  enableCallback(callbackID: string) {
    if (this.enabledIDs.lastIndexOf(callbackID) == -1) {
      this.enabledIDs.push(callbackID);
    }
    this.startWatching();
  }

  disableCallback(callbackID: string) {
    if (this.enabledIDs.lastIndexOf(callbackID) != -1) {
      this.enabledIDs.splice(this.enabledIDs.lastIndexOf(callbackID), 1);
    }
    if (this.enabledIDs.length == 0) {
      this.stopWatching();
    }
  }

  /**
   * Unregister a set of callbacks.
   * @param callbackID
   */
  unregisterCallbacks(callbackID: string) {
    if (this.registeredCallbacks.has(callbackID)) {
      this.registeredCallbacks.delete(callbackID);
      // delete this.registeredCallbacks[callbackID];
    }
    this.disableCallback(callbackID);
    console.log("Geowatch: callback unregistered: " + callbackID);
  }

  /**
   * Start watching for positions.
   */
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
      // for (const cb of this.registeredCallbacks) {
      //   if (cb.stop) {
      //     cb.stop();
      //   }
      // }
    }
    console.log("GeoWatch: stopped, " + this._watchID);
    this._watchID = null;
    this._cachedCoords = null;
  }

  get isWatching() {
    return this._watchID != undefined;
  }
}

const instance: GeoWatch = new GeoWatch;

export enum GEOWATCHER_STATES {
  STOPPED,
  PENDING,
  FAILED,
  ONGOING
}

export default instance;