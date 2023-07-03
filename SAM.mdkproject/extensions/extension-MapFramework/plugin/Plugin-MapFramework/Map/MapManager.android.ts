import { MapControlDelegate } from '../Common/MapControlDelegate';
import { View } from '@nativescript/core';
declare var com;

export class Map extends View {
    // These Tags are needs to be the same as in MapManager in native code
    private static MAP_FRAGMENT_TAG = 'MAP_FRAGMENT';
    private static FULL_SCREEN_MAP_FRAGMENT_TAG = 'MAP_FRAGMENT_FULL';
    private static FULL_SCREEN_MAP_MODAL_FRAGMENT_TAG = 'MAP_FRAGMENT_FULL_MODAL';
    private static FULL_SCREEN_MAP_SIDE_MENU_FRAGMENT_TAG = 'MAP_FRAGMENT_FULL_SIDE_MENU';

    public nativeView: any;

    private _delegate: any;
    private _params: any;
    private _dataService: any;
    private _mapExtension: any;
    private _mapManager: any;
    private _fragmentTag: any;

    public createNativeView(): Object {
        try {
            this._delegate = MapControlDelegate.initWithDataServiceAndBridge(
                this._dataService,
                this._mapManager,
                this._mapExtension);
            this._mapExtension._delegate = this._delegate;
            return this._mapManager.createMapView(
                this._fragmentTag,
                this._context,
                JSON.stringify(this._params),
                this._delegate,
                this.parent.android);
        } catch (error) {
            console.log(error);
        }
    }

    public initNativeView(): void {
        if (this.nativeView) {
            (<any> this.nativeView).owner = this;
        }
        super.initNativeView();
    }

    public disposeNativeView(): void {
        if (this.nativeView) {
            // Remove reference from native view to this instance.
            (<any> this.nativeView).owner = null;
        }

        // If you want to recycle nativeView and have modified the nativeView 
        // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
        // you have to reset it to its initial state here.
        super.disposeNativeView();
    }

    public create(params, dataService, mapExtension): any {
        let mapManager = new com.sap.sam.android.plugin.map.MapManager();
        mapExtension._bridge = mapManager;
        if (mapExtension.definition().data._Type === 'Control.Type.Extension') { // Map used as a ExtensionControl
            if (!mapExtension.readFromContext()) {
                if (params.LifeCycleEntrance && params.LifeCycleEntrance === 'SideMenu') {
                    this._fragmentTag = Map.FULL_SCREEN_MAP_SIDE_MENU_FRAGMENT_TAG;
                } else {
                    this._fragmentTag = Map.FULL_SCREEN_MAP_FRAGMENT_TAG;
                }
            } else {
                this._fragmentTag = Map.FULL_SCREEN_MAP_MODAL_FRAGMENT_TAG;
            }
            this._params = params;
            this._dataService = dataService;
            this._mapExtension = mapExtension;
            this._mapManager = mapManager;
            return this;
        } else { // Map used as a SectionExtension
            this._delegate = MapControlDelegate.initWithDataServiceAndBridge(dataService, mapManager, mapExtension);
            mapExtension._delegate = this._delegate;
            return mapManager.createMapView(
                Map.MAP_FRAGMENT_TAG,
                mapExtension.androidContext(),
                JSON.stringify(params),
                this._delegate,
                null);
        }
    }

    public getDelegate(): any {
        return this._delegate;
    }

    public setDelegate(delegate) {
        this._delegate = delegate;
    }
};
