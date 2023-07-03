declare var com;

@NativeClass()
@Interfaces([com.sap.sam.framework.pdf.IPDFDelegate])
class PDFControlDelegate extends java.lang.Object {
    
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

    /**
     * Explicitly set reference to control extension
     * @param controlExtension 
     */
    public setControlExtension(controlExtension) {
        this._controlExtension = controlExtension;
    }
    
    public getLocalizedValueParams(key, params): any {
        return this._controlExtension.getExtensionLocalizedValue(key, params);
    }

}

export { PDFControlDelegate }
