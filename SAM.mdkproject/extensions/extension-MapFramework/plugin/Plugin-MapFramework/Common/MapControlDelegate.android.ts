declare var com;

@NativeClass()
@Interfaces([com.sap.sam.android.plugin.map.IMapExtensionDelegate])
class MapControlDelegate extends java.lang.Object {

    public static initWithDataServiceAndBridge(dataService, bridge, controlExtension): MapControlDelegate {
        let controlDelegate = new MapControlDelegate();
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

    public getObjects(params, type) {
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

    public getObjectActions(params, filter) {
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

    public runAction(actionInfoJsonString, type) {
        let actionInfoJson = JSON.parse(actionInfoJsonString);
        if (this._controlExtension) {
            this._controlExtension.runActionWithInfoAndService(actionInfoJson, type);
        }
    }

    public leaveEditMode(editModeInfo, callBackInfo) {
        if (this._controlExtension) {
            this._controlExtension.leaveEditMode(editModeInfo, callBackInfo);
        }
    }

    public resetPaging() {
        if (this._controlExtension) {
            this._controlExtension.resetPaging();
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
                this._controlExtension.sendCallback(responseJson, type);
                this._controlExtension.cacheConfigParams(undefined);

            }).catch((error) => {
                this._controlExtension.cacheConfigParams(params);
                console.log(error);
            });
        }
    }

    protected getLocalizedValue(key, params): any {
        return this._controlExtension.getExtensionLocalizedValue(key, params);
    }
};

export { MapControlDelegate }
