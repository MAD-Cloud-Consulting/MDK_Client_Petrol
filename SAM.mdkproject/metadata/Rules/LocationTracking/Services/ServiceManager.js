
import EnableTracking from './EnableTracking';
import GetCurrentLocation from './GetCurrentLocation';
import StartTracking from './StartTracking';
import StopTracking from './StopTracking';

export default class ServiceManager {
    constructor() {
        this._instance = null;
        this._isEnabled = false;
        this._watchIDs = [];
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    enableTracking() {
        if (!this._isEnabled) {
            return EnableTracking().then((isEnabled) => {
                if (isEnabled) {
                    this._isEnabled = true;
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            }, () => {
                return Promise.resolve(false);
            });
        }
        return Promise.resolve(true);
    }

    disableTracking() {
        if (this._isEnabled) {
            while (this._watchIDs.length) {
                StopTracking(this._watchIDs.pop());
            }
            this._isEnabled = false;
        }
    }

    isTrackingEnabled() {
        return this._isEnabled;
    }

    startTracking(cbFunc, cbParam = undefined, updateDistance = undefined) {
        let watchID = StartTracking(cbFunc, cbParam, updateDistance);
        if (watchID !== -1) {
            this._watchIDs.push(watchID);
        }
        return watchID;
    }

    stopTracking(watchID) {
        const pos = this._watchIDs.indexOf(watchID);
        if (pos) {
            StopTracking(watchID);
            this._watchIDs.splice(pos, 1);
        }
    }

    getCurrentLocation() {
        if (this._isEnabled) {
            return GetCurrentLocation();
        }
        return Promise.resolve();
    }
}
