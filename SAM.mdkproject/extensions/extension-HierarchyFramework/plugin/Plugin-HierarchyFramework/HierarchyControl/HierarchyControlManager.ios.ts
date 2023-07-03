declare var HierarchyBridge: any;

import {HierarchyControlDelegate} from '../Common/HierarchyControlDelegate';

export class HierarchyControl {

    protected _delegate: any;

    // Returns a view
    public create(params, dataService, extension): any {
        let bridge = HierarchyBridge.new();
        extension._bridge = bridge;
        this._delegate = HierarchyControlDelegate.initWithDataServiceAndBridge(dataService, bridge, extension);
        return bridge.createWithParamsAndDelegate(params, this._delegate);
    }

    public getDelegate(): any {
        return this._delegate;
    }

    public setDelegate(delegate) {
        this._delegate = delegate;
    }
};
