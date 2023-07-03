export class PDFControlDelegate {

    public static initWithDataServiceAndBridge(dataService, bridge, controlExtension): PDFControlDelegate {
        let controlDelegate = new PDFControlDelegate();
        controlDelegate._dataService = dataService;
        controlDelegate._bridge = bridge;
        controlDelegate._controlExtension = controlExtension;
        return controlDelegate;
    }

    private _dataService: any;
    private _bridge: any;
    private _controlExtension: any;

    protected getLocalizedValue(key, params): any {
        // intentional no-op
    }
}
