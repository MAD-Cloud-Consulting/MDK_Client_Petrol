import {BarcodeScannerControlDelegate} from '../Common/BarcodeScannerControlDelegate';
import { View } from '@nativescript/core';
declare var com;

export class BarcodeScanner extends View {

    public nativeView: any;
    private _delegate: any;
    private _params: any;
    private _dataService: any;
    private _barcodeManager: any;

    public createNativeView(): Object {
        try {
            // the native BarcodeManager invokes the barcode scanner activity so we just return the empty nativeView
            this._barcodeManager.create(this._context, JSON.stringify(this._params), this._delegate);
            return this.nativeView;
            // return this._barcodeManager.create(this._context, JSON.stringify(this._params), this._delegate);
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

    public create(params, dataService, barcodeExtension): any {
        this._params = params;
        this._dataService = dataService;
        this._barcodeManager = new com.sap.sam.android.plugin.barcodescanner.BarcodeScannerManager();
        barcodeExtension._bridge = this._barcodeManager;
        this._delegate = BarcodeScannerControlDelegate.initWithDataServiceAndBridge(
            this._dataService,
            this._barcodeManager,
            barcodeExtension);
        return this;
    }
};
