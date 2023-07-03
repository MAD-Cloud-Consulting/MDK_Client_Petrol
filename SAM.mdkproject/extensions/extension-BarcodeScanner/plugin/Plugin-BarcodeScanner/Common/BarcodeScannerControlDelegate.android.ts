declare var com;

@NativeClass()
@Interfaces([com.sap.sam.android.plugin.barcodescanner.IBarcodeScannerDelegate])
class BarcodeScannerControlDelegate extends java.lang.Object {

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

    /**
     * Explicitly set reference to control extension
     * @param controlExtension 
     */
    public setControlExtension(controlExtension) {
        this._controlExtension = controlExtension;
    }

    public getObjects(dictionary, type) {
        try {
            if (type === 'Config') {
                this.fetchConfig(dictionary, type);
            } else {
                this.fetchBusinessObjects(dictionary, type);
            }
        } catch (e) {
            console.log(e);
        }
    }

    public runAction(actionInfoJsonString, type) {
        let actionInfoJson = JSON.parse(actionInfoJsonString);
        this._controlExtension.runActionWithInfoAndService(actionInfoJson, type, this._dataService);
    }
    
    protected fetchBusinessObjects(dictionary, type) {
        let jsonDictionary = JSON.parse(dictionary);   
        if (this._controlExtension) {
            let objects = this._controlExtension.getObjects(jsonDictionary, type);
            if (objects) {
                jsonDictionary.Objects = objects;
                this._bridge.callback(JSON.stringify(jsonDictionary), type);
            }
        }
    }

    protected fetchConfig(dictionary, type) {
        let json = JSON.parse(dictionary);
        if (this._controlExtension) {
            this._dataService.read(this._controlExtension.getTargetService(json)).then(result => {
                let responseJson = {};
                for (let i = 0; i < result.length; i++) {
                    let item = result.getItem(i);
                    let key = item.ParameterName;
                    let value = item.ParameterValue;
                    if (key != null && value != null) {
                        responseJson[key] = value;
                    }
                }
                this._bridge.callback(JSON.stringify(responseJson), type);
            });
        }
    }
}

export { BarcodeScannerControlDelegate }
