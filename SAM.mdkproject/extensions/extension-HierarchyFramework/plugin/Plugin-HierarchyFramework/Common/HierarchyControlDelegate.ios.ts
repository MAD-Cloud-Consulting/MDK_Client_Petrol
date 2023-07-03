@NativeClass()
class HierarchyControlDelegate extends NSObject {
    // selector will be exposed so it can be called from native.
    /* tslint:disable */
    public static ObjCExposedMethods = {
        getObjects: { params: [NSString, NSString], returns: interop.types.void },
        runAction: { params: [NSString, NSString], returns: interop.types.void },
        loadMoreItems: { params: [NSString, NSString], returns: interop.types.void },
        searchUpdated: { params: [NSString, NSString], returns: interop.types.void },
        updateReturnValues: { params: [NSArray], returns: interop.types.void },
        getLocalizedValue: { params: [NSString, NSString], returns: NSString },
        setReturnValues: { params: [NSArray], returns: interop.types.void }


    };
    /* tslint:enable */

    public static initWithDataServiceAndBridge(dataService, bridge, controlExtension): HierarchyControlDelegate {
        let controlDelegate = <HierarchyControlDelegate> HierarchyControlDelegate.new();
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
    public loadMoreItems(queryParams, pagingParams) {
        let pagingParam = JSON.parse(pagingParams);
        this._controlExtension.loadMoreItems(queryParams, pagingParam.currentPage, pagingParam.itemsPerPage);
    }
    public searchUpdated(queryParam, searchParams) {
        let params = JSON.parse(searchParams);
        this._controlExtension.searchUpdated(queryParam, params.searchString, params.currentPage, 
            params.itemsPerPage);
    }
    public updateReturnValues(ids) {
        let valueArray = JSON.parse(ids);
        if (valueArray.length > 1) {
            this._controlExtension.updateReturnValues(valueArray);
        } else  if (valueArray.length === 1) {
            this._controlExtension.updateReturnValue(valueArray[0]);
        } else {
            this._controlExtension.updateReturnValue(''); // Send empty string
        }
    }
    public setReturnValues(ids) {
        let valueArray = JSON.parse(ids);
        if (valueArray.length > 1) {
            this._controlExtension.setReturnValue(valueArray);
        } else  if (valueArray.length === 1) {
            this._controlExtension.setReturnValue(valueArray[0]);
        }
    }
    public getLocalizedValue(key, params): any {
        return this._controlExtension.getExtensionLocalizedValue(key, JSON.parse(params));
    }

    protected fetchBusinessObjects(dictionary, type) {
        if (this._controlExtension) {
            this._controlExtension.getObjects(dictionary, type);
        }
    }
}

export { HierarchyControlDelegate }
