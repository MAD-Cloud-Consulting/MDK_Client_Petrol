declare var com;

@NativeClass()
@Interfaces([com.sap.sam.android.plugin.hierarchy.IHierarchyDelegate])
class HierarchyControlDelegate extends java.lang.Object {
    
    public static initWithDataServiceAndBridge(dataService, bridge, controlExtension): HierarchyControlDelegate {
        let controlDelegate = new HierarchyControlDelegate();
        controlDelegate._dataService = dataService;
        controlDelegate._bridge = bridge;
        controlDelegate._controlExtension = controlExtension;
        return controlDelegate;
    }

    private _dataService: any;
    private _bridge: any;
    private _controlExtension: any;

    /**
     * Explicitly set reference to control extension
     * @param controlExtension 
     */
    public setControlExtension(controlExtension) {
        this._controlExtension = controlExtension;
    }

    public getObjects(dictionary, type) {
        try {
            this.fetchBusinessObjects(dictionary, type);
        } catch (e) {
            console.log(e);
        }
    }
    
    public runAction(actionInfoJsonString, type) {
        let actionInfoJson = JSON.parse(actionInfoJsonString);
        this._controlExtension.runActionWithInfoAndService(actionInfoJson, type, this._dataService);
    }

    public updateReturnValue(value) {
        this._controlExtension.updateReturnValue(value);
    }

    public updateReturnValues(values) {
        this._controlExtension.updateReturnValues(values);
    }
    public setReturnValues(values) {
        this._controlExtension.setReturnValue(values); // Set Return Value
    }
    public getLocalizedValue(key, params): any {
        return this._controlExtension.getExtensionLocalizedValue(key, params);
    }

    public loadMoreItems(queryParam, currentPage, itemsPerPage) {
        this._controlExtension.loadMoreItems(queryParam, currentPage, itemsPerPage);
    }

    public searchUpdated(queryParam, searchText, currentPage, itemsPerPage) {
        this._controlExtension.searchUpdated(queryParam, searchText, currentPage, itemsPerPage);
    }

    protected fetchBusinessObjects(dictionary, type) {
        if (this._controlExtension) {
            this._controlExtension.getObjects(dictionary, type);
        }
    }
}

export { HierarchyControlDelegate }
