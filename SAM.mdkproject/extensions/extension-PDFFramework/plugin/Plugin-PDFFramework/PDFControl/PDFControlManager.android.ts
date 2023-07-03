import {PDFControlDelegate} from '../Common/PDFControlDelegate';
import { View } from '@nativescript/core';
declare var com;

export class PDFControl extends View {

    public nativeView: any;
    private _delegate: any;
    private _dataService: any;
    private _pdfManager: any;
    private _pdfExtension: any;

    public createNativeView(): Object {
        try {
            this._delegate = PDFControlDelegate.initWithDataServiceAndBridge(
                this._dataService, this._pdfManager, this._pdfExtension);
                this._pdfExtension._delegate = this._delegate;
                return this._pdfManager.createPDFView(
                    this._context, this._delegate);
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

    public create(dataService, pdfExtension): any {
        let pdfManager = new com.sap.sam.framework.pdf.PDFManager();
        pdfExtension._bridge = pdfManager;

        if (pdfExtension.androidContext() == null) { // PDF used as a ExtensionControl
            this._dataService = dataService;
            this._pdfExtension = pdfExtension;
            this._pdfManager = pdfManager;
            return this;
        } else { // PDF used as a SectionExtension
            this._delegate = PDFControlDelegate.initWithDataServiceAndBridge(
                dataService, pdfManager, pdfExtension);
                pdfExtension._delegate = this._delegate;
            return pdfManager.createPDFView(
                pdfExtension.androidContext(), this._delegate);
        }
    }
};
