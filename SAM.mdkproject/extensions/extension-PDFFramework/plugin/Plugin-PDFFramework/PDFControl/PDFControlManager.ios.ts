declare var PDFBridge: any;

import {PDFControlDelegate} from '../Common/PDFControlDelegate';

export class PDFControl {

    protected _delegate: any;

    public create(dataService, extension):any {
        let bridge = PDFBridge.new();
        extension._bridge = bridge;
        this._delegate = PDFControlDelegate.initWithDataServiceAndBridge(dataService, bridge, extension);
        return bridge.createWithDelegate(this._delegate);
    }
    public getDelegate(): any {
        return this._delegate;
    }

    public setDelegate(delegate) {
        this._delegate = delegate;
    }
};
