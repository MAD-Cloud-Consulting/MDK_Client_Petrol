import { IControl } from 'mdk-core/controls/IControl';
import { BaseExtensionObservable } from './BaseExtensionObservable';
import { BaseExtensionParser } from './BaseExtensionParser';
import { IDataService } from 'mdk-core/data/IDataService';
import { IDefinitionProvider } from 'mdk-core/definitions/IDefinitionProvider';
import { Context } from 'mdk-core/context/Context';
import { EventHandler } from 'mdk-core/EventHandler';
import { ITargetServiceSpecifier } from 'mdk-core/data/ITargetSpecifier';
import { ClientAPI, PageProxy } from 'mdk-core/context/ClientAPI';
import { Utils } from './Utils';
import { Device } from '@nativescript/core';

export class BaseExtension extends IControl {
    protected _viewController: any;
    protected _observable: BaseExtensionObservable;
    protected _params: any;
    protected _serviceURL: any;
    protected _bridge: any;
    protected _parser: BaseExtensionParser;
    protected _contextData: any;
    protected _nextPageLinkDict: any;
    protected _itemsPerPageDict: any;

    public initialize(props) {
        super.initialize(props);

        if (!this.context) {
            // Create a new context that uses the provided binding.
            const binding = props.context ? props.context.binding : null;
            this.context = new Context(binding, this);
        }

        let params = this.getParams();
        this._params = params;
        this.parseParameters(params, this.context);
        this._params.IsDemoMode = this.isDemoMode();
        // paging feature
        this._nextPageLinkDict = {};
        this._itemsPerPageDict = {};
    }

    // TODO: Check Demo Mode from Snowblind
    public isDemoMode(): Boolean {
        return false;
    }

    public setContainer(container: IControl) {
        // do nothing
    }

    public setValue(value: any, notify: boolean): Promise<any> {
        return Promise.resolve();
    }

    public parseParameters(params, context) {
        if (params) {
            Object.keys(params).forEach(sKey => {

                if (sKey === 'ObjectScheme') {
                    // We don't want to dig into these before they have a context object
                    // In this first class function, this is the same as continue
                    return;
                }

                params[sKey] = this.replaceParam(sKey, params[sKey], context);
                if (params[sKey] !== null && typeof(params[sKey]) === 'object') {

                    this.parseParameters(params[sKey], context);
                } 
                if (sKey === 'Service') {
                    this._serviceURL = IDataService.instance().urlForServiceName(params[sKey]);
                } 
            }); 
        }
    }

    public getObjectSchema(entitySet) {
        let properties: any;
        Object.keys(this._params.BusinessObjects).forEach(sKey => {
            let object = Utils.clone(this._params.BusinessObjects[sKey]);
            Object.keys(object).forEach(key => {
                if (key === 'Target') {
                    let target = object[key];
                    Object.keys(target).forEach(targetKey => {
                        if (target[targetKey] === entitySet) {
                            properties = this._params.BusinessObjects[sKey];
                        }    
                    });
                }    
            });    
        });
        return properties;
    }

    public replaceParam(key, value, context) {
        if (typeof(value) === 'string') {
            if (value.indexOf('#Application') >= 0 && (value.indexOf('#ClientData') >= 0)) {
                //Application Data format is 
                //#Application/#ClientData/UserId
                let property = value.split("/").slice(-1).pop();
                let appData = context.clientAPI.getPageProxy().getAppClientData();
                if (appData.hasOwnProperty(property)) {
                    return context.clientAPI.getPageProxy().getAppClientData()[property];
                } else {
                    return false;
                }
            } else if (value.indexOf('#Property') >= 0 && value.indexOf('#ClientData') >= 0) {
                //Client Data format is 
                //#ClientData/#Property:Cats
                let property = value.split(":").slice(-1).pop();
                let clientData = context.clientAPI.getPageProxy().getClientData();
                if (clientData.hasOwnProperty(property)) {
                    return context.clientAPI.getPageProxy().getClientData()[property];
                } else {
                    return false;
                }
            }
            let valueAsString = String(value);	           
            if (valueAsString.includes('.global')) {	
                  // If this is a global, replace it with it's proper value	
                  return IDefinitionProvider.instance().getDefinition(value).getValue();	
            }	
            if (valueAsString.includes('$(L,')) {
                value = this._parser.localizeValue(context, valueAsString);
            }        
        }
 
        return value;
    }

    public setStyle() {
        // No op 
    }

    public setViewController(vc) {
        this._viewController = vc;
    }

    public getDataService() {
        return IDataService.instance();
    }

    public view() {
        return this._viewController;
    }

    public viewIsNative() {
        return true;
    }

    public getParams() {
        if (!this._params) {
            let definition = this.definition();
            if (definition && definition.data) {
                if (definition.data.hasOwnProperty('ExtensionProperties')) {
                    return definition.data.ExtensionProperties;
                } else if (definition.data.hasOwnProperty('Extension')) {
                    return definition.data.Extension.ExtensionProperties;
                }
            }
        }
        return this._params;
    }

    // By default we will try to bind to text.  Any control that wants to do otherwise needs to override.
    public observable() {
       let observable =  this._observable || this.createObservable() as BaseExtensionObservable;
       return observable;
    }

    public createObservable() {
        let o = new BaseExtensionObservable(this);
        this.setObservable(o);
        return o;
    }

    public setObservable(observable) {
        this._observable = observable;
    }

    /**
     *  Execute an action from the extension given information and access to a dataservice
     * 
     * @Parameter actionInfo: Key Value pairs providing specifics of the action
     * @Parameter type: Brief identifier for action. TODO: Remove this parameter
     * @Parameter dataService: Service used to make reads on the target object (if provided)
     */
    // TODO: Remove 'type' as it is no longer used. Keeping for now to avoid breaks elsewhere
    public runActionWithInfoAndService(actionInfo, type, dataService) {
        let action = actionInfo.Action;
        switch (type) {
            case 'ESRIToken':
                this.runAction(this._params.TokenAuthentication.Action, null).then((result) => {
                    if (Device.os === 'Android') {
                        this._bridge.callback(JSON.stringify(result), type);
                    } else {
                        this._bridge.callback(result, type);
                    }
                });
                break;
            default:
                if (actionInfo.Target) {
                    dataService.read(this.getTargetService(actionInfo)).then(result => {
                        if (result.length === 1) {
                            let item = result.getItem(0);
                            this.runAction(action, item);
                        } else {
                            this.runAction(action, null);
                        }
                    });
                } else {
                    this.runAction(action, null);
                }
        }
    }

    public runAction(actionName, object) {
        let context = this.page().context;
        let pageAPI = <PageProxy> ClientAPI.Create(context);
        // Set the action binding and context binding to object
        // Object may be null
        pageAPI.setActionBinding(object);
        context.binding = object;

        const eventHandler = new EventHandler();
        return eventHandler.executeActionOrRule(actionName, context);
    }

  public getTargetService(data): ITargetServiceSpecifier {
    if (data.Target) {
        return {
            entitySet: data.Target.EntitySet,
            keyProperties: data.Target.KeyProperties,
            offlineEnabled: true,
            properties: data.Target.Properties,
            queryOptions: data.Target.QueryOptions,
            serviceUrl: this._serviceURL,
            uniqueIdType: 0,
        };
    }
    return {
        entitySet: data.EntitySet,
        keyProperties: data.KeyProperties,
        offlineEnabled: true,
        properties: data.Properties,
        queryOptions: data.QueryOptions,
        serviceUrl: this._serviceURL,
        uniqueIdType: 0,
    };
  }

    public contextData() {
        if (!this._contextData) {
            let cd = this.context.binding;
            if (cd) {
                this._contextData = Utils.clone(cd);
            }
        }
        return this._contextData;

    }

    public getObjects(jsonDictionary, type): any {
        let entitySet = jsonDictionary.EntitySet; 
        let schema = this.getObjectSchema(entitySet);
        // If schema is empty, return immediately
        if (Object.keys(schema).length === 0) {
            return Promise.resolve();
        }
        if (this.readFromContext()) {
            return this.getObjectsFromContext(schema, entitySet);
        }
        return this.getObjectsFromPages(jsonDictionary, schema, entitySet);
    }

    public page() {
        return super.page();
    }

    public  ODataUpdate(params): Promise<any> {
       if (params) {
       return new Promise((resolve, reject) => {
        try {
            /**
             * Called to update an entity set from an ODataService.  Must be called on a service that is already open.
             * 
             * @param {service: ITargetServiceSpecifier} - The properties of the service as specified in the metadata.
             * This could be empty.
             * @[] {deleteLinks: ITargetLinkSpecifier[]} - The links that are associated with the update.
             * @[] {createLinks: ITargetLinkSpecifier[]} - The links that are associated with the update.
             * @[] {updateLinks: ITargetLinkSpecifier[]} - The links that are associated with the update.
             * @[] {headers: Object}  - headers
             */
            this.getDataService().update(this.getTargetService(params), [], [], [], []).then(result => {
                 resolve(result);
                });    
            } catch (error) {
                console.log(error);
                reject(error);
            }
        }); 
      } else {
          console.log('Dictionary is empty');
      }
    }
    public getObject(schema, item): Promise<any> {
       let object = Utils.clone(schema);
       return new Promise((resolve, reject) => {
            this.bindParameters(item, object).then(result => {
                resolve(this.setObjectVisibility(object));
            });
        });       
    }

    public bindParameters(object, params): Promise<any> {

        return new Promise((resolve, reject) => {
            let aPromises: Promise<any>[] = [];
            this._parser.setTarget(params.Target);
            aPromises.push(this._parser.bindParameters(object, params));
            return Promise.all(aPromises).then(results => {
                resolve(results);
            });
        });

    }

    public getValueFromTargetPaths(path: string, context: any): string {
        if (path) {
            let match;
            let regex = /{{(.+?)}}/g;
            let pageAPI = <PageProxy> ClientAPI.Create(context);
            for (match = regex.exec(path); match; match = regex.exec(path)) {
                let bindValue = pageAPI.evaluateTargetPath(match[1]);
                path = path.replace(match[0], bindValue.toString());
            }
            return path;
         } else {
            return '';
         }
    }

    public getPropertyValueFromMultipleBinding(value: string): any {
        let regex = /{(.+?)}/;
        let match;
        let results = [];
        for (match = regex.exec(value); match; match = regex.exec(value)) {
          let bindValue = this.getObjectsToBind(match[1]); // we expect this to return array of 1 element.
          value = value.replace(match[0], bindValue[0]);
        }
        return value; 
    }

    public executeActionOrRule(rule: string, context = this.context): Promise<any> {
        let eventHandler = new EventHandler();
        return eventHandler.executeActionOrRule(rule, context);
    }

    public resetPaging(): void {
        this._nextPageLinkDict = {};
        this._itemsPerPageDict = {};
    }

    protected readFromContext() {
        return false;
    }

    protected getObjectsFromService(schema, jsonDictionary, entitySet): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                if (this._nextPageLinkDict[entitySet] === undefined || this._nextPageLinkDict[entitySet] !== '') {
                    // Update queryOptions with paging parameters
                    this.updateQueryOptions(jsonDictionary, this._nextPageLinkDict[entitySet]);
                    this.getDataService().readWithPageSize(this.getTargetService(jsonDictionary),
                        this._itemsPerPageDict[entitySet]).then(result => {
                        this._nextPageLinkDict[entitySet] = this.getSkiptoken(result.nextLink);
                        // convert to a regular json array
                        let array = [];
                        for (let i = 0; i < result.Value.length; i++) {
                            array.push(result.Value.getItem(i));
                        }                                         
                        this.bindObjects(schema, array).then(objects => {
                            resolve(objects);
                        });
                    }); 
                } else {
                    this.bindObjects(schema, []).then(objects => {
                        resolve(objects);
                    });
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    protected getUpdatedObjectFromService(schema, json): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.getDataService().read(this.getTargetService(json)).then(result => {
                    // convert to a regular json array
                    let array = [];
                    for (let i = 0; i < result.length; i++) {
                        array.push(result.getItem(i));
                    }                                         
                    this.bindObjects(schema, array).then(objects => {
                        resolve(objects);
                    });
                });    
            } catch (error) {
                console.log(error);
            }
        });
    }

    protected getObjectsFromContext(schema, property): Promise<any> {
        let objects = this.getObjectsToBind(property);
        if (objects && objects.length === 0 && this.isDemoMode()) {
            objects = this.getMockData();
        }

        return this.bindObjects(schema, objects);
    }

    protected getMockData(): any {
        // Sub class must override this if necessary
        return [];
    }

    protected getObjectsToBind(property): any[] {
        let contextData = this.contextData();
        let parts = property.split('/');
        let data; 
        if (contextData) {
            data = Utils.clone(contextData);
        }
        let objects = [];
        if (data && parts) {
            parts.forEach((item, index) => {
                if (data && data.hasOwnProperty(item)) {
                    data = data[item];
                } 
                if (index === parts.length - 1) {
                    if (data instanceof Array) {
                        objects = data;
                    } else {
                        objects.push(data);
                    }
                } else if (data instanceof Array) {
                    data = data[0]; // Always pick first element for now. 
                }
            });
        }
        return objects;
    }

    protected bindProperty(property: string): any {
        if (property) {
            return this.getPropertyValueFromMultipleBinding(property);
        }
        return '';
    }

    protected bindObjects(schema, items): Promise<any> {
        return new Promise((resolve, reject) => {
            let aPromises: Promise<any>[] = [];
            for (let item of items) {
                aPromises.push(this.getObject(schema, item));
            } 

            return Promise.all(aPromises).then(results => {
                resolve(results);
            });
        });

    }
    // Delete Action Items from the array based on it's visibility
    private setObjectVisibility(object): any {
        if (object.Actions) {
            for (let schema of object.Actions) {
                if (schema.IsVisible !== undefined && schema.IsVisible === false) {
                    // Get the index of the object that needs to be deleted and delete 1 object
                    object.Actions.splice(object.Actions.indexOf(schema), 1);
                }
            }
        }
        return object;
    }

    private getObjectsFromPages(jsonDictionary, schema, entitySet) {
        // init dictionary map for different BO type
        if (this._itemsPerPageDict[entitySet] === undefined) {
            this._itemsPerPageDict[entitySet] = 0;

            // remove $top option for count()
            const targetService = this.getTargetService(jsonDictionary);
            targetService.queryOptions = Utils.filterQueryOptions(targetService.queryOptions, '$top');

            return this.getDataService().count(targetService, this.context).then(count => {
                if (count > 0) {
                    this._itemsPerPageDict[entitySet] = this.getItemsPerPage();
                    return this.getObjectsFromService(schema, jsonDictionary, entitySet).then(objects => {
                        return Promise.resolve(objects);
                    });
                }
                return Promise.resolve(null);
            });
        }

        return this.getObjectsFromService(schema, jsonDictionary, entitySet).then(objects => {
            return Promise.resolve(objects);
        });
    }

    private getItemsPerPage(): number {
        const itemsPerPage = this.getParams().ItemsPerPage;
        return itemsPerPage ? itemsPerPage : 100;
    }

    private getSkiptoken(data): string {
        if (data && data !== '') {
            let key = '$skiptoken=';
            let index = data.indexOf(key);
            if (index !== -1) {
                return data.substring(index + key.length);
            }
        }
        return '';
    }

    // Update queryOptions with paging parameters
    private updateQueryOptions(data, skipToken) {
        if (skipToken && skipToken !== '') {
            if (data.Target) {
                data.Target.QueryOptions += '&$skiptoken=' + skipToken;
            } else {
                data.QueryOptions += '&$skiptoken=' + skipToken;
            }
        }
    }
};
