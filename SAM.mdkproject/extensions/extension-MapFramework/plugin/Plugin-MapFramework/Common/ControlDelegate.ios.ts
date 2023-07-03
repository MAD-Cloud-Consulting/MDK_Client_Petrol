interface MapDelegate extends NSObjectProtocol { // tslint:disable-line
    getObjectsType?(jsonString: string, type: string): void;
    getObjectActionsFilter?(params: string, filter: string): void;
    runActionType?(jsonString: string, type: string): void;
    getLocalizedValueParams?(key: string, params: string): string;
    resetPaging?(): void;
    leaveEditModeCallBackInfo?(editModeInfo: string, callBackInfo: string): void;
}

declare var MapDelegate: {
    prototype: MapDelegate;
};

@NativeClass()
class ControlDelegate extends NSObject implements MapDelegate {

    public static ObjCProtocols = [MapDelegate]; // tslint:disable-line

    public static initWithExtension(controlExtension): ControlDelegate {
        let controlDelegate = <ControlDelegate> ControlDelegate.new();
        controlDelegate._controlExtension = controlExtension;
        return controlDelegate;
    }

    private _controlExtension: any;

    /**
     * Explicitly set reference to control extension
     * @param controlExtension
     */
    public setControlExtension(controlExtension) {
        this._controlExtension = controlExtension;
    }

    public getObjectsType(params: string, type: string) {
        try {
            if (type === 'Config') {
                this.fetchConfig(params, type);
            } else {
                this.fetchBusinessObjects(params, type);
            }
        } catch (e) {
            console.log(e);
        }
    }

    public getObjectActionsFilter(params: string, filter: string) {
        try {
            let jsonParams = JSON.parse(params);
            let jsonFilter = JSON.parse(filter);
            if (this._controlExtension) {
                this._controlExtension.getObjectActions(jsonParams, jsonFilter).then(objects => {
                    if (objects) {
                        jsonParams.Objects = objects;
                    }
                    this._controlExtension.sendCallback(jsonParams, 'ObjectActionsUpdate');
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    public runActionType(jsonString: string, type: string) {
        let actionInfoJson = JSON.parse(jsonString);
        if (this._controlExtension) {
            this._controlExtension.runActionWithInfoAndService(actionInfoJson, type);
        }
    }

    public getLocalizedValueParams(key: string, params: string): string {
        return this._controlExtension.getExtensionLocalizedValue(key, JSON.parse(params));
    }

    public resetPaging(): void {
        if (this._controlExtension) {
            this._controlExtension.resetPaging();
        }
    }

    public leaveEditModeCallBackInfo(editModeInfo: string, callBackInfo: string) {
        if (this._controlExtension) {
            this._controlExtension.leaveEditMode(editModeInfo, callBackInfo);
        }
    }

    protected fetchBusinessObjects(params, type) {
        let jsonParams = JSON.parse(params);
        if (this._controlExtension) {
            this._controlExtension.getObjects(jsonParams).then(objects => {
                if (objects) {
                    jsonParams.Objects = objects;
                }
                this._controlExtension.sendCallback(jsonParams, type);
            });
        }
    }

    protected fetchConfig(params, type) {
        let json = JSON.parse(params);
        if (this._controlExtension) {
            let targetService = this._controlExtension.getTargetService(json.Target);
            this._controlExtension.read(targetService).then(result => {
                let mapConfigurations = {};
                let baseMapConfig = {};
                let baseMapArray = [];
                let featureLayerConfig = {};
                let featureLayerArray = [];
                let authConfig = {};
                let authConfigRule = null;
                for (let i = 0; i < result.length; i++) {
                    let item = result.getItem(i);
                    let paramName = item.ParameterName; // key
                    let paramValue = item.ParameterValue; // value
                    let paramGroup = item.ParameterGroup; // index
                    let paramParentGroup = item.ParentParemeterGroup; // parent group
                    if (paramGroup === 'ESRI') {
                        mapConfigurations[paramName] = paramValue;
                    } else if (paramGroup === 'CONFIG') {
                        let _paramValue = paramValue.toLowerCase();
                        if (_paramValue === 'true') {
                            // Convert to boolean true
                            mapConfigurations[paramName] = true;
                        } else if (_paramValue === 'false') {
                            // Convert to boolean false
                            mapConfigurations[paramName] = false;
                        } else {
                            // Keep value as is
                            mapConfigurations[paramName] = paramValue;
                        }
                    } else if (paramParentGroup === 'BASEMAP') {
                        if (!baseMapConfig.hasOwnProperty(paramGroup)) {
                            baseMapConfig[paramGroup] = {};
                        }
                        baseMapConfig[paramGroup][paramName] = paramValue;
                    } else if (paramParentGroup === 'FEATURELAYER') {
                        if (!featureLayerConfig.hasOwnProperty(paramGroup)) {
                            featureLayerConfig[paramGroup] = {};
                        }
                        if (paramName === 'Properties' || paramName === 'Actions') {
                            featureLayerConfig[paramGroup][paramName] = JSON.parse(paramValue);
                        } else {
                            featureLayerConfig[paramGroup][paramName] = paramValue;
                        }
                    } else if (paramGroup === 'AUTHENTICATION') {
                        if (paramName === 'ConfigRule') {
                            authConfigRule = paramValue;
                            continue;
                        }
                        authConfig[paramName] = paramValue;
                    }
                }
                for (let key in baseMapConfig) {
                    if (baseMapConfig.hasOwnProperty(key)) {
                        baseMapArray.push(baseMapConfig[key]);
                    }
                }
                for (let key in featureLayerConfig) {
                    if (featureLayerConfig.hasOwnProperty(key)) {
                        featureLayerArray.push(featureLayerConfig[key]);
                    }
                }
                let responseJson = {
                    BaseMaps: baseMapArray,
                    FeatureLayers: featureLayerArray,
                    ViewConfig: mapConfigurations,
                };
                const authConfigKey = 'AuthenticationConfig';
                if (Object.keys(authConfig).length > 0) {
                    responseJson[authConfigKey] = authConfig;
                }
                if (authConfigRule) {
                    this._controlExtension.executeActionOrRule(authConfigRule).then((authResult) => {
                        Object.keys(authResult).forEach((key) => {
                            authConfig[key] = authResult[key];
                        });
                        if (Object.keys(authConfig).length > 0) {
                            responseJson[authConfigKey] = authConfig;
                        }
                        this._controlExtension.sendCallback(responseJson, type);
                    }).catch((error) => {
                        this._controlExtension.sendCallback(responseJson, type);
                    });
                } else {
                    this._controlExtension.sendCallback(responseJson, type);
                }
                this._controlExtension.cacheConfigParams(undefined);
            }).catch((error) => {
                this._controlExtension.cacheConfigParams(params);
                console.log(error);
            });
        }
    }
}

export { ControlDelegate }
