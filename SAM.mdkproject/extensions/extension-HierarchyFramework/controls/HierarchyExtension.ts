import { BaseExtension } from './BaseExtension';
import { HierarchyControl } from 'extension-HierarchyFramework';
import { HierarchyParser } from './HierarchyParser';
import { Utils } from './Utils';
import { Device } from '@nativescript/core';
import { Context } from 'mdk-core/context/Context';

export class HierarchyExtension extends BaseExtension {
    public selectedId: any;
    protected _root: any;
    protected HORIZONTAL_ALIGNMENT_DELAY = 250; // time in ms
    protected _returnValues: any;
    protected _isEditable: boolean;
    public initialize(props) {
        this._parser = new HierarchyParser();
        super.initialize(props); 
        if (!this.getParams().IsPicker) {
            this.addRootObjectToParams();
        }

        if (this.getParams().PickerProperties) {
            let isEditable = this.getParams().PickerProperties.IsEditable;
            if (typeof(isEditable) == 'string' && isEditable.indexOf('/Rules/') >= 0) {
                this.executeActionOrRule(isEditable, this.page().context).then(result => {
                    this.setEditable(result)
                })
            }
        }

        let hc: HierarchyControl = new HierarchyControl();
        let vc = hc.create(this.getParams(), this.getDataService(), this);
        this.setViewController(vc);
    }

    get isBindable(): boolean {
        return true;
    }

    public bind(): Promise<any> {
        return this.observable().bindValue(this.definition().getValue());
    }

    public onDataChanged(action: any, result: any) {
        this.runCallback({}, 'DataChanged');
    }

    public getObjectSync(schema, item): any {
        let object = Utils.clone(schema);
        let boundObject = this.bindParametersSync(item, object);
        return boundObject;
     }

    public bindParametersSync(object, params): any {
        let context: Context = new Context(object);
        if (params) {
            Object.keys(params).forEach(sKey => {
                let value = params[sKey];
                if (value) {
                    if (typeof (value) !== 'object') {
                        // if rule, then skip
                        if (typeof(value) !== 'string' || value.indexOf('/Rules/') < 0) {
                            params[sKey] = this._parser.parseValue(value, context);
                        }
                    } else {
                        params[sKey] = this.bindParametersSync(object, value);
                    }
                }
            });
        }
        return params;
    }

    public getObjects(entityId, type) {
        let targets = [];
        const jsonDictionary = JSON.parse(entityId);
        const eid = jsonDictionary.ID;
        switch (type) {
            case 'Children':
                targets = jsonDictionary.Children;
                break;
            case 'ChildCount':
                let rule = jsonDictionary.ChildCountQuery;
                this.executeActionOrRule(rule, new Context(jsonDictionary)).then(result => {
                    this.runCallback({ChildCount: result, ID: eid}, type);
                });
                return;
            case 'Parent':
                targets = jsonDictionary.Parent;
                break;
            case 'FetchObject':
                targets.push(jsonDictionary);
                break;
            default:
                console.log('no object available of type ' + type);
                return;
        }
        this.processTargets(targets).then(() => {
            // eslint-disable-next-line no-unused-vars
            this.processQueries(targets, eid, type).then(result => {
                if (   type === 'Parent' 
                    && result 
                    && result.length > 0 
                    && result[0].Properties.ChildCount === -1 
                    && result[0].Properties.ChildCountQuery) {
                    // for parent objects that would normally defer their childcounts, retrieve them instead
                    this.executeActionOrRule(result[0].Properties.ChildCountQuery, 
                                            new Context(result[0].Properties)).then(childCount => {
                        result[0].Properties.ChildCount = childCount;
                        this.runCallback({Objects: result, ID: eid}, type);
                    });
                } else {
                    // initial parent call, small delay to ensure horizontal alignment is correct
                    if (type === 'Parent') {
                        setTimeout(() => {
                            this.runCallback({Objects: result, ID: eid}, type);
                        }, this.HORIZONTAL_ALIGNMENT_DELAY);
                    } else {
                        this.runCallback({Objects: result, ID: eid}, type);
                    }
                }
            });
        });
    }

    public processTargets(targets): Promise<any> {
        if (targets.length > 0) {
            let aPromises: Promise<any>[] = [];
            return new Promise((resolve, reject) => {
                targets.forEach(item => {
                    if (item.Target.QueryOptions.includes('.js')) {
                        // tslint:disable-next-line:max-line-length
                        aPromises.push(this.executeActionOrRule(item.Target.QueryOptions, new Context(this.context)).then(result => {
                            item.Target.QueryOptions = result;
                        }));
                    }
                });
                return Promise.all(aPromises).then(alltargets => {
                    resolve(alltargets);
                });
            });
        } else {
            return Promise.resolve(targets);
        }
    }

    public processQueries(queries: Object[], eid: string, type: string): Promise<any> {
        return this.runQueries(queries, eid, type).then(results => {
            let arrObjects = [];
            if (results.length > 0) {
                results.forEach(result => {
                    if (result.length > 0) {
                        result.forEach(item => {
                            arrObjects.push(item);
                        });
                    }
               });
            }
            return arrObjects;
        });
    }

    public runCallback(json: any, type: string) {
        if (json.ID != null) {
            console.log(json.ID + ' ' + type);
        }
        if (Device.os === 'Android') {
            this._bridge.callback(JSON.stringify(json), type);
        } else {
            this._bridge.callback(json, type);
        }
    }

    public runQueries(targets, eid, type): Promise<any> {
        if (targets.length > 0) {
            let aPromises: Promise<any>[] = [];
            return new Promise((resolve, reject) => {
                targets.forEach(item => {
                    let schema = this.getObjectSchema(item.Target.EntitySet);
                    // for fetch object, we need to update the entityset to the ID, 
                    // so that only that object is returned.
                    if (type === 'FetchObject') {
                        item.Target.EntitySet = eid;
                    }
                    aPromises.push(this.getObjectsFromService(schema, item, ''));
                });
                return Promise.all(aPromises).then(results => {
                    resolve(results);
                });
            });
        } else {
            return Promise.resolve([]);
        }
    }

    public getExtensionLocalizedValue(key, params): any {
        let result = this._parser.getExtensionLocalizedValue(key, params, this.context);
        return result;
    }

    // extension will update the return values and notify the registered object for the 'OnValueChange' event
    // when the new value is different with last one.
    public updateReturnValue(value) {
        let onValueChange = this.getParams().PickerProperties.OnValueChange;
        let ifChange = (this._returnValues !== value);
        this._returnValues = value;
        if (ifChange && onValueChange) {
            return this.executeActionOrRule(onValueChange, this.context);
        }
    }
    public updateReturnValues(values) {
        this._returnValues = JSON.parse(values);
    }
    public setReturnValue(value) {
        this._returnValues = value
    }

    public getValue(): any {
        return this._returnValues;
    }

    // extension will load specific items (configured in extension properties e.g. 50) from metadata
    // when user scroll down to the specific position (configured in extension properties e.g. 20)
    // to the last cached item in list
    public loadMoreItems(queryParam, currentPage, itemsPerPage) {
        let params = JSON.parse(queryParam);
        let targets = params.BusinessObjects;
        let onLoaded = this.getParams().PickerProperties.OnLoaded;
        let onLoadPromise = currentPage === 0 && onLoaded ?
                this.executeActionOrRule(onLoaded, this.context) : Promise.resolve();

        return onLoadPromise.then(() => {
            this.processTargets(targets).then(() => {
                targets[0].Target.QueryOptions += '&$top=' + itemsPerPage;
                if (currentPage > 0) {
                    targets[0].Target.QueryOptions += '&$skip=' + currentPage * itemsPerPage;
                }
                this.parseHierarchyList(targets).then(result => {
                    this.runCallback({HierarchyList: result}, 'HierarchyList');
                });
            });
        });
    }

    // extension will display the search result from data cached in metadata
    public searchUpdated(queryParam, searchText, currentPage, itemsPerPage) {
        let params = JSON.parse(queryParam);
        let targets = params.BusinessObjects;
        if (targets[0].Target.QueryOptions.includes('.js')) {
            this.executeActionOrRule(targets[0].Target.QueryOptions, this.context).then(result => {
                if (result && result.length > 0) {
                    this.searchDatabase(params, searchText.toLowerCase(), currentPage, itemsPerPage, targets, result);
                }
            });
        } else {
            this.searchDatabase(params, searchText.toLowerCase(), currentPage, itemsPerPage, targets, targets[0].Target.QueryOptions);
        }
    }
    public setEditable(bool: boolean) {
        this._isEditable = bool
        this.runCallback({IsEditable: bool}, 'Editable');
    }
    public getEditable() {
        return this._isEditable;
    }
    // extension will reload page with updated QueryOptions
    public reload(): Promise<any> {
        this.runCallback({}, 'Reload');
        this._returnValues = undefined;
        return Promise.resolve();
    }

    // extension will set date in the return value / display value fields
    public setData(value: any): Promise<any> {
        let params = JSON.parse(JSON.stringify(this.getParams()));
        let targets = params.BusinessObjects;
        let filter: string;

        switch (params.PickerProperties.ListFilter) {
            case 'MyFunctionalLocations':
                filter = 'FuncLocIdIntern eq \'' + value + '\'';
                break;
            case 'MyEquipments':
                filter = 'EquipId eq \'' + value + '\'';
                break;
            case 'TechnicalObjects': // SMA
                filter = value;
                break;
            default:
                console.log('no object available of listPicker ' + params.PickerProperties.ListFilter);
                break;
        }

        if (filter) {
            this.processTargets(targets).then(() => {
                if (filter.toString().includes('TechnicalObject')) {
                    targets[0].Target.QueryOptions += '&$filter=' + filter;
                } else {
                    targets[0].Target.QueryOptions += ' and ' + filter;
                }
                this.parseHierarchyList(targets).then(result => {
                    this.runCallback({HierarchyList: result}, 'HierarchyList');
                    this.runCallback({HierarchyList: result}, 'SetData');
                    return Promise.resolve();
                });
            });
        }
        return Promise.resolve();
    }

    private addRootObjectToParams() {
        this._root = this.context.binding;
        let schema = this.getObjectSchema(this.getEntitySetNameFromEntity(this._root['@odata.readLink']));
        let rootBusinessObject = this.getObjectSync(schema, this._root);
        rootBusinessObject.Properties.ChildCount = this.context.binding.HC_ROOT_CHILDCOUNT;
        let params = this.getParams();
        params.Root = rootBusinessObject;
        this._params = params;
    } 

    private getEntitySetNameFromEntity(entity) {
        let match = entity.match(/(.*)(\()/);
        let entitySeName = match[1];
        return entitySeName;
    }

    private parseHierarchyList(targets: Object[]) {
        let roots = [];

        return this.processQueries(targets, null, 'BusinessObjects').then(result => {
            result.forEach(item => {
                let root = {Root: item};
                roots.push(root);
            });
            return roots;
        });
    }

    private searchDatabase(params, searchText, currentPage, itemsPerPage, targets, queryOptions) {
        let filter: string;
        switch (params.PickerProperties.ListFilter) {
            case 'MyFunctionalLocations':
                filter = '(substringof(\'' + searchText + '\', tolower(FuncLocId)) eq true or ' +
                          'substringof(\'' + searchText + '\', tolower(FuncLocDesc)) eq true)';
                targets[0].Target.QueryOptions = queryOptions + ' and ' + filter + '&$top=' + itemsPerPage;
                break;
            case 'MyEquipments':
                filter = '(substringof(\'' + searchText + '\', tolower(EquipId)) eq true or ' +
                          'substringof(\'' + searchText + '\', tolower(EquipDesc)) eq true)';
                targets[0].Target.QueryOptions = queryOptions + ' and ' + filter + '&$top=' + itemsPerPage;
                break;
            case 'TechnicalObjects':
                filter = '(substringof(\'' + searchText + '\', tolower(MyEquipment_Nav/EquipId)) eq true or ' +
                          'substringof(\'' + searchText + '\', tolower(MyEquipment_Nav/EquipDesc)) eq true or ' +
                          'substringof(\'' + searchText + '\', tolower(MyFunctionalLocation_Nav/FuncLocId)) eq true or ' +
                          'substringof(\'' + searchText + '\', tolower(MyFunctionalLocation_Nav/FuncLocDesc)) eq true)';
                targets[0].Target.QueryOptions = queryOptions + '&$filter=' + filter + '&$top=' + itemsPerPage;
                break;
            default:
                console.log('no object available of listPicker ' + params.PickerProperties.ListFilter);
                break;
        }

        if (filter) {
            this.processTargets(targets).then(() => {
                if (currentPage > 0) {
                    targets[0].Target.QueryOptions += '&$skip=' + currentPage * itemsPerPage;  
                }
                this.parseHierarchyList(targets).then(result => {
                    this.runCallback({HierarchyList: result}, 'SearchResult');
                    return Promise.resolve();
                });
            });
        }
    }
};

