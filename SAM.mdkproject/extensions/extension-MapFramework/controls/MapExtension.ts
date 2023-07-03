import { BaseExtension } from './BaseExtension';
import { MapBridge } from 'extension-MapFramework';
import { MapParser } from './MapParser';
import { Utils } from './Utils';
import { ValueResolver} from 'mdk-core/utils/ValueResolver';
import { Device } from '@nativescript/core';

export class MapExtension extends BaseExtension {

    // Hold reference to the delegate so it isn't immediately collected by ARC
    protected _delegate: any;
    protected _objectSchemeMap: any;
    protected _editModeInfo: any;
    protected _configParams: any;

    public initialize(props) {
        this._parser = new MapParser();
        this._editModeInfo = {};
        this._configParams = undefined;
        super.initialize(props);
        let map = new MapBridge();
        let mapViewController = map.create(this.getParams(), this.getDataService(), this);
        this._delegate = map.getDelegate();
        this.setViewController(mapViewController);
    }

    public getExtensionLocalizedValue(key, params): any {
        return this._parser.getExtensionLocalizedValue(key, params, this.context);
    }

    public parseParameters(params, context) {
        super.parseParameters(params, context);

        let businessObjects = params.BusinessObjects;
        if (businessObjects !== undefined && Array.isArray(businessObjects)) {
            this._objectSchemeMap = {};
            businessObjects.forEach(element => {
                // Copy the object scheme into a map for formatting objects
                if (element.Target === undefined || //
                    element.Type === undefined || //
                    element.ObjectScheme === undefined) {
                    // Not configured properly, continue
                    return;
                }
                this._objectSchemeMap[element.Type] = Utils.clone(element.ObjectScheme);
            });
        }
    }

    public getObjectSchema(type) {
        return this._objectSchemeMap[type];
    }

    public getObjects(params): any {
        return super.getObjects(params).then(objects => {
            let editParams = this.getParams().EditMode;
            if (objects && this.readFromContext() && editParams && editParams.InitialParams &&
                editParams.InitialParams.EntitySet === params.Target.EntitySet) {
                return this.runAction(editParams.InitialParams.GeometryValue, null).then(result => {
                    if (result && result.length > 0) {
                        objects[0].Geometry = result;
                    }
                    return objects;
                });
            } else {
                return objects;
            }
        });
    }

    public getObjectActions(jsonDictionary: any, filter: any): any {
        const type = jsonDictionary.Type;
        const objectSchema = this.getObjectSchema(type);

        if (objectSchema && filter) {
            const target = jsonDictionary.Target;
            target.QueryOptions = filter.QueryOptions;
            objectSchema.Actions = jsonDictionary.Actions;

            return this.getUpdatedObjectFromService(objectSchema, jsonDictionary).then((objects) => {
                delete objectSchema.Actions;
                return objects;
            });
        }
    }

    public onPageLoaded(pageExists: boolean) {
        if (Device.os === 'Android') {
            this.sendCallback('', 'Resume')
        }
    }

    /**
     * Called when the parent page is unloaded.
     * @param pageExists Whether or not the page still exists on the stack after unload
     */
    public onPageUnloaded(pageExists: boolean) {

        if (!pageExists) {
            // Page is being unloaded and does not exists on the back stack
            // It should be told to drop extra resources
            this.sendCallback({}, 'Reset')
            this._delegate.setControlExtension(undefined);
            this._delegate = undefined;
            this.setViewController(undefined);
            this._bridge = undefined;
        } else {
            if (Device.os === 'Android') {
                // When navigating from Overview
                this.sendCallback('', 'Pause')
            }
        }
    }

    public onNavigatedTo(pageExists: boolean) {
        if (Device.os === 'Android') {
            this.sendCallback('', 'NavigatedTo')
        }
    }

    public onDisplayingModal(isFullPage: boolean) {
        // to be implemented
    }

    get isBindable(): boolean {
        return true;
    }

    public bind(): Promise<any> {
        return this.observable().bindValue(this.definition().getValue());
    }

    public onDataChanged(action: any, result: any) {
        if (this._bridge !== null && result !== null) {
            const woArr = ['OrderId', 'Job', 'WOGeometries'];
            const noArr = ['NotificationNumber', 'Notification', 'NotifGeometries'];
            const eqArr = ['EquipId', 'Equipment', 'EquipGeometries'];
            const flArr = ['FuncLocIdIntern', 'FunctionalLocation', 'FuncLocGeometries'];
            const geoMap = {
                'ORH': woArr, 'NO1': noArr, 'IEQ': eqArr, 'IFL': flArr
            };
            const objMap = {
                '#sap_mobile.MarkedJob': woArr,
                '#sap_mobile.MyWorkOrderHeader': woArr,
                '#sap_mobile.MyNotificationHeader': noArr,
                '#sap_mobile.MyEquipment': eqArr,
                '#sap_mobile.MyFunctionalLocation': flArr
            }
            const json = JSON.parse(result);
            const type = json['@odata.type'];

            if (type === '#sap_mobile.Geometry') {
                const tag = geoMap[json.ObjectType][0];
                const val = geoMap[json.ObjectType][1];
                const nav = geoMap[json.ObjectType][2];

                if (json.SpacialId) { // downloaded
                    this.getDataService().read({
                        entitySet: 'Geometries', keyProperties: [], offlineEnabled: true, properties: [],
                        queryOptions: '$filter=SpacialId eq \'' + json.SpacialId + '\'&$expand=' + nav,
                        serviceUrl: this._serviceURL, uniqueIdType: 0,
                    }).then(objects => {
                        if (objects && objects.length > 0) {
                            this.updateObject(tag, objects.getItem(0)[nav][0][tag], val);
                        }
                    });
                } else { // local
                    this.updateObject(tag, json.ObjectKey, val);
                }
            } else if (type === '#sap_mobile.PMMobileStatus' && json.OrderId) {
                this.updateObject(woArr[0], json.OrderId, woArr[1]);
            } else {
                this.updateObject(objMap[type][0], json[objMap[type][0]], objMap[type][1]);
            }
        }
    }

    /**
     * If the extension is not added to the view controller heirarchy,
     * this method is used to manually trigger a map update
     */
    public update() {
        this.sendCallback({}, 'Update')
    }

    /**
     * Tell the map to perform a user action update.
     * This means update the objects without resetting view bounds
     * as well as updating details menu (if needed)
     */
    public userActionUpdate() {
        this.sendCallback({}, 'UserActionUpdate')
    }

    public clearUserDefaults() {
        this.sendCallback({}, 'ClearUserDefaults')
    }

    public clearRouteCache() {
        this.sendCallback({}, 'ClearRouteCache')
    }

    public resetPaging() {
        super.resetPaging();
    }

    public cacheConfigParams(configParams) {
        this._configParams = configParams;
    }

    public isInitialized() {
        return this._configParams === undefined;
    }

    public fetchConfig() {
        if (!this.isInitialized()) {
            this._delegate.fetchConfig(this._configParams, 'Config');
        }
    }

    public enterEditMode(editModeConfig: any) {
        this._editModeInfo = {};
        this.sendCallback(editModeConfig, 'EnterEditMode');
    }

    public leaveEditMode(editModeInfo: any, callBackInfo: any) {
        this.page().editModeInfo = JSON.parse(editModeInfo);
        this._editModeInfo = JSON.parse(editModeInfo);
        if (callBackInfo && callBackInfo.length > 0) {
            this.runActionWithDataService(JSON.parse(callBackInfo));
        }
    }

    public getEditModeInfo() {
        return this._editModeInfo;
    }

    protected runActionWithDataService(object: any) {
        let action = object.Action;
        let targetService = this.getTargetService(object.Target);
        return this.read(targetService).then(result => {
            if (result.length === 1) {
                let item = result.getItem(0);
                return this.runAction(action, item);
            }
            return this.runAction(action, null);
        });
    }

    protected updateObject(name: String, value: String, type: String) {
        const cachedBOs = this.getParams().BusinessObjects;
        if (cachedBOs) {
            cachedBOs.forEach(bo => {
                if (bo.Type === type || (bo.Type === 'RouteStop' && type === 'Job')) {
                    // deep copy for no updating cached params
                    const clonedBO = JSON.parse(JSON.stringify(bo));
                    let schema = this.getObjectSchema(clonedBO.Type);
                    if (Object.keys(schema).length > 0) {
                        // cache old queryOptions
                        const queryOptions = clonedBO.Target.QueryOptions;
                        // compose spcific query
                        if (queryOptions.includes('.js')) {
                            this.executeActionOrRule(queryOptions, this.context).then(result => {
                                if (result && result.length > 0) {
                                    clonedBO.Target.QueryOptions = result + ' and '  + name + ' eq \'' + value + '\'';
                                    this.searchDatabase(clonedBO, schema, value, bo.Type, queryOptions);
                                }
                            });
                        } else {
                            clonedBO.Target.QueryOptions += ' and '  + name + ' eq \'' + value + '\'';
                            this.searchDatabase(clonedBO, schema, value, bo.Type, queryOptions);
                        }
                    }
                }
            });
        }
    }

    private searchDatabase(clonedBO, schema, value, type, queryOptions) {
        this.getUpdatedObjectFromService(schema, clonedBO).then(newBOs => {
            // recover old queryOptions
            clonedBO.Target.QueryOptions = queryOptions;
            if (newBOs) {
                // delete old object
                if (newBOs.length === 0) {
                    // lite version of business objects
                    clonedBO.Objects = [{'Layer': `${type}`, 'Properties': {'ID': `${value}`}}];
                    this.sendCallback(clonedBO, 'BusinessObjectDelete');
                } else { // update new objects
                    clonedBO.Objects = newBOs;
                    this.sendCallback(clonedBO, 'BusinessObjectUpdate');
                }
            }
        });
    }
};
