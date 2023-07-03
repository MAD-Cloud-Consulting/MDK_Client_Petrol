export class HierarchyControlDelegate {

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

    public setControlExtension(controlExtension) {
        // intentional no-op
    }

    public getObjects(dictionary, type) {
        // intentional no-op
    }

    public getLocalizedValue(key, params): any {
        // intentional no-op
    }

    public runAction(actionInfoJsonString, type) {
        // intentional no-op
    }

    public updateReturnValue(value) {
        // intentional no-op
    }

    public updateReturnValues(values) {
        // intentional no-op
    }
    public setReturnValues(values) {
    // intentional no-op
    }
    protected fetchBusinessObjects(dictionary, type) {
        // intentional no-op
    }

    protected fetchConfig(dictionary, type) {
        // intentional no-op
    }

    protected loadMoreItems(queryParam, currentPage, itemsPerPage) {
        // intentional no-op
    }

    protected searchUpdated(queryParam, searchText) {
        // intentional no-op
    }
}
