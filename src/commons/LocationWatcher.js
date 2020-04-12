import LoDash from 'lodash';

let geo = navigator.geolocation;
let instance;

class GeoWatch {
    constructor() {
        this.successCallbacks = [];
        this.errorCallbacks = [];
        this.registeredCallbacks = new Map();
        this._watch = null;
        this._cachedCoords = null;
        console.log("GeoWatch: ct called.");

        this.invokeCallbacksDebounced = LoDash.debounce( pos => {
            console.log(this.registeredCallbacks);
            for (let [id, cb] of this.registeredCallbacks) {
                if (cb.success) {
                    cb.success(pos);
                }
            }
        }, 3000, {
            leading: true
        });
        this.onError = err => {
            for (let [id, cb] of this.registeredCallbacks) {
                if (cb.error) {
                    cb.error(pos, err);
                }
            }
        }
    }
    registerCallbacks(callbacks, callbackID) {
        if (typeof callbackID != 'string') {
            throw Error("Key must be a string.");
        }
        if (callbacks.success) {
            this.registeredCallbacks.set(callbackID, callbacks);
        } else return;
        console.log("GeoWatch: callback registered: " + callbackID);
        if (this._cachedCoords) {
            this.invokeCallbacksDebounced(this._cachedCoords);
        }
    }
    unregisterCallbacks(callbackID) {
        if (this.registeredCallbacks.has(callbackID)) {
            this.registeredCallbacks.delete(callbackID);
        }
        console.log("Geowatch: callback unregistered: " + callbackID);
    }

    startWatching() {
        if (this._watch == undefined) { // not watching.
            this._watch = geo.watchPosition((coords) => {
                this._cachedCoords = coords;
                this.invokeCallbacksDebounced(coords);
            }, this.onError, {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 10000
            });
            console.log("GeoWatch: started, " + this._watch);
        }
    }
    
    stopWatching() {
        if (this._watch) {
            geo.clearWatch(this._watch);
            for (let [id, cb] of this.registeredCallbacks) {
                if (cb.stop) {
                    cb.stop();
                }
            }
        }
        console.log("GeoWatch: stopped, " + this._watch);
        this._watch = undefined;
    }

    get isWatching() {
        return this._watch != undefined;
    }
}

if (!instance)
    instance = new GeoWatch;

const GEOWATCHER_STATES = {
    STOPPED: 0,
    PENDING: 1,
    FAILED: 2,
    ONGOING: 3
};

export {instance as default, GEOWATCHER_STATES};