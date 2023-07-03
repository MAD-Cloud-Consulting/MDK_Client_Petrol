export { Map as MapBridge} from './Map/MapManager';
import { Application as application } from '@nativescript/core';
import { LOCATION_SERVICE_CLASSNAME, LOCATION_SERVICE_INTENT } from './MapLocationService.android';
import { Utils as utils } from '@nativescript/core';

export class MapLocationServiceManager {
    private static _instance: MapLocationServiceManager;
    private _cbFunc: any;
    private _cbParam: any;
    private _intentFilter: any;

    private constructor() {
        this._intentFilter = new android.content.IntentFilter(LOCATION_SERVICE_INTENT);
    }

    public static getInstance(): MapLocationServiceManager {
        if (!MapLocationServiceManager._instance) {
            MapLocationServiceManager._instance = new MapLocationServiceManager();
        }
        return MapLocationServiceManager._instance;
    }

    public startTracking(cbFunc, cbParam, distance) {
        this._cbFunc = cbFunc;
        this._cbParam = cbParam;

        const context = application.android.context;
        const intent = new android.content.Intent();
        intent.putExtra('UPDATED_DISTANCE', distance);
        intent.setClassName(context, LOCATION_SERVICE_CLASSNAME);
        context.startService(intent);
        this.registerCallback(cbFunc, cbParam);
    }

    public stopTracking() {
        this.unregisterCallback();
        const context = application.android.context;
        const intent = new android.content.Intent();
        intent.setClassName(context, LOCATION_SERVICE_CLASSNAME);
        context.stopService(intent);
    }

    private registerCallback(cbFunc, cbParam) {
        const callbackImpl = (<any>android.content.BroadcastReceiver).extend({
            onReceive: (context, intent) => {
                const geoJson = intent.getStringExtra('GEO_JSON');
                if (geoJson && this._cbFunc && this._cbParam) {
                    this._cbFunc(JSON.parse(geoJson), this._cbParam);
                }
              }
            }
        );

        var callback = new callbackImpl();
        var broadcastManager = androidx.localbroadcastmanager.content.LocalBroadcastManager.getInstance(utils.ad.getApplicationContext());
        broadcastManager.registerReceiver(callback,  this._intentFilter);
    }

    private unregisterCallback() {
        application.android.unregisterBroadcastReceiver(this._intentFilter);
    }
}

