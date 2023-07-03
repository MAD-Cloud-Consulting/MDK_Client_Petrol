@NativeClass()
class PDFControlDelegate extends NSObject {
    
    public static initWithDataServiceAndBridge(dataService, bridge, controlExtension): PDFControlDelegate {
        let controlDelegate = <PDFControlDelegate> PDFControlDelegate.new();
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
    public getLocalizedValueParams(key: string, params: string): string {
        return this._controlExtension.getExtensionLocalizedValue(key, JSON.parse(params));
    }
}

export { PDFControlDelegate }
