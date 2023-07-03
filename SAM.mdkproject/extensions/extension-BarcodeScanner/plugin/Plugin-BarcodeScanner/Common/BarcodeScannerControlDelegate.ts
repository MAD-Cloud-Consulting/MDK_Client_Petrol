export class BarcodeScannerControlDelegate {

    public static initWithDataServiceAndBridge(dataService, bridge, controlExtension): BarcodeScannerControlDelegate {
        let controlDelegate = new BarcodeScannerControlDelegate();
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
    
    public runAction(actionInfoJsonString, type) {
        // intentional no-op
    }

    protected fetchBusinessObjects(dictionary, type) {
        // intentional no-op
    }

    protected fetchConfig(dictionary, type) {
        // intentional no-op
    }
}
