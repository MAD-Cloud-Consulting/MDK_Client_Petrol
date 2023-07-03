import libCommon from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import libControlDescription from '../Common/Controls/DescriptionNoteControl';
import { SubOperationControlLibrary as libSubOpControl, PrivateMethodLibrary as libPrivate } from './SubOperationLibrary';
import Logger from '../Log/Logger';

export class SubOperationLibrary {

    /**
     * get the SubOperation Long Text string
     * @param {*} pageProxy 
     */
    static getSubOperationLongText(pageProxy) {
        return libCommon.getLongText(pageProxy.binding.SubOperationLongText);
    }

    /**
     * Dynamically set the CreateLinks of the WorkOrder
     * @param {IPageProxy} 
     * @return {Array} array of create update links
     */
    static getCreateUpdateLinks(pageProxy) {
        var links = [];
        let onCreate = libCommon.IsOnCreate(pageProxy);

        return libPrivate._getParentOperation(pageProxy).then(parentOperation => {
            // if on create, we will need to add the folllowing link to link it to parent
            if (onCreate) {
                let opReadLink = parentOperation['@odata.readLink'];
                if (opReadLink === undefined) {
                    opReadLink = libSubOpControl.getOperation(pageProxy);
                }
                let woLink = pageProxy.createLinkSpecifierProxy(
                    'WorkOrderOperation',
                    'MyWorkOrderOperations',
                    '',
                    opReadLink
                );
                links.push(woLink.getSpecifier());
            }

            //check Equipment ListPicker, if value is set, add Equipment link
            let equipment = libSubOpControl.getEquipment(pageProxy);
            if (equipment && equipment !== '' && !libCommon.isCurrentReadLinkLocal(equipment)) {
                let equipmentLink = pageProxy.createLinkSpecifierProxy(
                    'EquipmentSubOperation',
                    'MyEquipments',
                    `$filter=EquipId eq '${equipment}'`
                );
                links.push(equipmentLink.getSpecifier());
            }

            //check Functional Location ListPicker, if value is set, add Func Loc link
            let funcLoc = libSubOpControl.getFunctionalLocation(pageProxy);
            if (funcLoc && funcLoc !== '' && !libCommon.isCurrentReadLinkLocal(funcLoc)) {
                funcLoc = decodeURIComponent(funcLoc); //ICMTANGOAMF10-16403 - bug fix
                let funcLocLink = pageProxy.createLinkSpecifierProxy(
                    'FunctionalLocationSubOperation',
                    'MyFunctionalLocations',
                    `$filter=FuncLocIdIntern eq '${funcLoc}'`
                );
                links.push(funcLocLink.getSpecifier());
            }

            let linkPromises = [];
            if (equipment && equipment !== '' && libCommon.isCurrentReadLinkLocal(equipment)) {
                linkPromises.push(
                    libCommon.getEntityProperty(pageProxy, `MyEquipments(${equipment})`, 'EquipId').then(equipmentId => {
                        let equipmentLink = pageProxy.createLinkSpecifierProxy(
                            'EquipmentSubOperation',
                            'MyEquipments',
                            `$filter=EquipId eq '${equipmentId}'`
                        );
                        links.push(equipmentLink.getSpecifier());
                        return links;
                    })
                );
            }
            if (funcLoc && funcLoc !== '' && libCommon.isCurrentReadLinkLocal(funcLoc)) {
                linkPromises.push(
                    libCommon.getEntityProperty(pageProxy, `MyFunctionalLocations(${funcLoc})`, 'FuncLocIdIntern').then(funcLocId => {
                        let flocLink = pageProxy.createLinkSpecifierProxy(
                            'FunctionalLocationOperation',
                            'MyFunctionalLocations',
                            `$filter=FuncLocIdIntern eq '${funcLocId}'`
                        );
                        links.push(flocLink.getSpecifier());
                        return links;
                    })
                );
            }
            if (linkPromises.length > 0) {
                return Promise.all(linkPromises).then(() => {
                    return links;
                });
            }

            return links;
        });
    }

    /**
     * Dynamically set the delete of the WorkOrder
     * @param {IPageProxy} 
     * @return {Array} array of create update links
     */
    static getDeleteLinks(pageProxy) {
        var links = [];

        //check Equipment ListPicker, if value is set, add Equipment link
        let equipment = libSubOpControl.getEquipment(pageProxy);
        if (!equipment && pageProxy.binding.EquipmentSubOperation) {
            let equipmentLink = pageProxy.createLinkSpecifierProxy(
                'EquipmentSubOperation',
                'MyEquipments',
                '',
                pageProxy.binding.EquipmentSubOperation['@odata.readLink']
            );
            links.push(equipmentLink.getSpecifier());
        }

        //check Functional Location ListPicker, if value is set, add Func Loc link
        let funcLoc = libSubOpControl.getFunctionalLocation(pageProxy);
        if (!funcLoc && pageProxy.binding.FunctionalLocationSubOperation) {
            let funcLocLink = pageProxy.createLinkSpecifierProxy(
                'FunctionalLocationSubOperation',
                'MyFunctionalLocations',
                '',
                pageProxy.binding.FunctionalLocationSubOperation['@odata.readLink']
            );
            links.push(funcLocLink.getSpecifier());
        }

        return links;
    }
}

export class SubOperationEventLibrary {

    /**
     * Trigger during PageLoad
     * @param {IPageProxy} pageProxy 
     */
    static createUpdateOnPageLoad(pageProxy) {
        if (!pageProxy.getClientData().LOADED) {
            //Determine if we are on edit vs. create
            let onCreate = libCommon.IsOnCreate(pageProxy);
            this.createUpdateVisibility(pageProxy, onCreate);

            if (onCreate) {
                //Get title
                let title = pageProxy.localizeText('add_suboperation');
                pageProxy.setCaption(title);

                this.setDefaultValues(pageProxy, onCreate);
            } else {
                let title = pageProxy.localizeText('edit_suboperation');
                pageProxy.setCaption(title);
            }
        } 

        pageProxy.getClientData().LOADED = true;
        return true;
    }

    /**
     * validation rule of Operation Create/Update action
     * 
     * @static
     * @param {IPageProxy} pageProxy 
     * @return {Boolean}
     * 
     * @memberof WorkOrderEventLibrary
     */
    static createUpdateValidationRule(pageProxy) {
        let valPromises = [];

        // get all of the validation promises
        valPromises.push(libControlDescription.validationCharLimit(pageProxy));

        // check all validation promises;
        // if all resolved -> return true
        // if at least 1 rejected -> return false
        return Promise.all(valPromises).then(() => {
            return true;
        }).catch(() => {
            let container = pageProxy.getControl('FormCellContainer');
            container.redraw();
            return false;
        });
    }

    /**
     * Trigger during Page Unload
     * Note: unload actually triggered everytime you go back to the page from ListPicker
     * @param {IPageProxy} pageProxy 
     */
    static createUpdateOnPageUnloaded() {

    }

    /**
     * Trigger by control, when it has binding to the following OnChange method
     * @param {IControlProxy} controlProxy 
     */
    static createUpdateOnChange(controlProxy) {
        // TODO: Remove this workaround when we get the hierarchy list picker support from sdk.
        // If user select a child from a hierarchy, we are losing the pageProxy binding so have to check and re-assign it.
        if (libVal.evalIsEmpty(controlProxy.getPageProxy().binding)) {
            controlProxy.getPageProxy()._context.binding = controlProxy.binding;
        }
        if (controlProxy.getPageProxy().getClientData().LOADED && !controlProxy.getClientData().SetValueFromRule) {
            let name = controlProxy.getName();

            switch (name) {
                case 'FuncLocHierarchyExtensionControl':
                    return libSubOpControl.updateEquipment(controlProxy.getPageProxy());
                case 'EquipHierarchyExtensionControl':
                    return libSubOpControl.updateFloc(controlProxy.getPageProxy());
                case 'ControlKeyLstPkr':
                    break;
                case 'WorkCenterLstPkr':
                    break;
                case 'WorkCenterPlantLstPkr':
                    break;
                case 'OperationLstPkr': {
                    let formCellContainer = controlProxy.getPageProxy().getControl('FormCellContainer');
                    let workOrderLstPkrValue = libCommon.getListPickerValue(formCellContainer.getControl('WorkOrderLstPkr').getValue());
                    let operationValue = libCommon.getListPickerValue(formCellContainer.getControl('OperationLstPkr').getValue());
                    let params = {};
                    let pageProxy = controlProxy.getPageProxy();
        
                    params.funcLocControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control;
                    params.funcLocExtension = formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control._extension;
                    params.equipmentControl = formCellContainer.getControl('EquipHierarchyExtensionControl')._control;
                    params.equipmentExtension = formCellContainer.getControl('EquipHierarchyExtensionControl')._control._extension;
                    params.descriptionControl = formCellContainer.getControl('DescriptionNote');
                    params.workCenterControl = formCellContainer.getControl('WorkCenterLstPkr');
                    params.equipValue = '';
                    params.flocValue = '';
                    params.descriptionValue = '';
                    params.planningPlant = '';
                    params.enable = false;
                    params.pageProxy = pageProxy;

                    if (pageProxy.getClientData() && pageProxy.getClientData().TempEnable) { //Current chosen work order type allows enable for equip/floc controls
                        params.enable = true;
                    }
                    if (workOrderLstPkrValue) {
                        return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', operationValue, ['WOHeader/PlanningPlant', 'OperationShortText', 'OperationEquipment', 'OperationFunctionLocation', 'MainWorkCenter'], '$expand=WOHeader').then(result => {
                            if (result && result.length > 0) {
                                let woRow = result.getItem(0);
                                params.planningPlant = woRow.WOHeader.PlanningPlant;
                                params.equipValue = woRow.OperationEquipment;
                                params.flocValue = woRow.OperationFunctionLocation;
                                params.descriptionValue = woRow.OperationShortText;
                                params.workCenterValue = woRow.MainWorkCenter;
                                return libSubOpControl.updateEquipFuncLocAfterWorkOrderChange(params);
                            }
                            return libSubOpControl.updateEquipFuncLocAfterWorkOrderChange(params);
                        });
                    }
                    return libSubOpControl.updateEquipFuncLocAfterWorkOrderChange(params);
                }
                default:
                    break;
            }
        } else {
            controlProxy.getClientData().SetValueFromRule = false;
        }
        return Promise.resolve(true);
    }

    /**
     * Set the visible state of the fields
     * @param {IPageProxy} pageProxy 
     * @param {boolean} isOnCreate 
     */
    static createUpdateVisibility(pageProxy, isOnCreate) {
        let noteNoteControl = pageProxy.getControl('FormCellContainer').getControl('LongTextNote');
        noteNoteControl.setVisible(isOnCreate);
    }

    /**
     * Dynamically bind the queryoptions to the controls
     * @param {IControlProxy} controlProxy 
     */
    static createUpdateControlsQueryOptions(controlProxy) {
        try {
            let controlName;
            try {
                controlName = controlProxy.getName();
            } catch (err) {
                controlProxy = controlProxy.binding.clientAPI;
                controlName = controlProxy.getName();
            }
            var result = '';
            let onWoChangeSet = libCommon.isOnWOChangeset(controlProxy);
            var pageProxy = controlProxy.getPageProxy();
            let parentWorkOrderPromise = libPrivate._getParentWorkOrder(pageProxy, onWoChangeSet);
            
            return parentWorkOrderPromise.then(parentWorkOrder => {
                let planningPlant = '';
 
                if (parentWorkOrder && parentWorkOrder.PlanningPlant) {
                    planningPlant = parentWorkOrder.PlanningPlant;
                }
                let target = libCommon.getStateVariable(pageProxy, 'WODefaultPlanningPlant');
                if (target) {
                    planningPlant = target;
                }
                // Based on the control we are on, return the right query or list items accordingly
                switch (controlName) {
                    case 'FuncLocHierarchyExtensionControl':
                        result = `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
                        break;                
                    case 'EquipHierarchyExtensionControl': {                  
                        let funcLoc = pageProxy.getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue();
                        let reset = libCommon.getStateVariable(pageProxy, 'WODefaultReset');
                        if (!funcLoc && funcLoc !== '') {
                            funcLoc = libCommon.getTargetPathValue(pageProxy, '#Property:OperationFunctionLocation');
                        }
                        result = '$orderby=EquipId';
                        result += `&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
                        if (funcLoc && !reset) {
                            result += " and FuncLocIdIntern eq '" + funcLoc + "'";
                        }
                        break;
                    }
                    case 'ControlKeyLstPkr': 
                        result = '$orderby=ControlKeyDescription';
                        break; 
                    default:
                        break;
                }
                return result;
            });   
        } catch (err) {		
            /**Implementing our Logger class*/		
            Logger.error(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), err);		
        }
        return result;
    }


    static createUpdateControlsPickerItems(controlProxy) {
        try {
            let controlName = controlProxy.getName();
            var result = '';

            //var that tells if we are on create
            let assignmentType = libCommon.getWorkOrderAssignmentType(controlProxy.getPageProxy());
            return libPrivate._getParentOperation(controlProxy.getPageProxy()).then(() => {
                // Based on the control we are on, return the right query or list items accordingly
                switch (controlName) {
                    case 'WorkCenterPlantLstPkr':
                        {
                            let entityRead = null;
                            switch (assignmentType) {
                                case '1':
                                case '2':
                                case '3':
                                case '4':
                                case '5':
                                case '6':
                                case '7':
                                case '8':
                                    {
                                        entityRead = controlProxy.read(
                                            '/SAPAssetManager/Services/AssetManager.service',
                                            'WorkCenters',
                                            [],
                                            '');
                                        break;
                                    }
                                default:
                                    //default is assignmentType 8
                                    entityRead = controlProxy.read(
                                        '/SAPAssetManager/Services/AssetManager.service',
                                        'WorkCenters',
                                        [],
                                        '');
                                    break;
                            }
                            return entityRead.then(function(obArray) {
                                var jsonResult = [];
                                obArray.forEach(function(element) {
                                    jsonResult.push(
                                        {
                                            'DisplayValue': `${element.PlantId} - ${element.WorkCenterName}`,
                                            'ReturnValue': element.PlantId,
                                        });
                                });
                                const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
                                let finalResult = [...uniqueSet].map(item => JSON.parse(item));
                                return finalResult;
                            });
                        }
                    default:
                        return result;
                }
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), err);
        }
        return result;
    }

    /**
     * Trigger when user hit save button
     * @param {IPageProxy} pageProxy 
     */
    static createUpdateOnCommit(pageProxy) {
        if (libVal.evalIsEmpty(pageProxy.getPageProxy().binding)) { //Hierarchy picker breaks binding, so fix it here
            pageProxy.getPageProxy()._context.binding = pageProxy.getPageProxy().getControls()[0].binding;
        }
        //Determine if we are on edit vs. create
        let onCreate = libCommon.IsOnCreate(pageProxy);

        if (onCreate) {
            return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationCreate.action');
        } else {
            return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationUpdate.action');
        }
    }

    /**
     * Set the default value when its on create mode
     * @param {IPageProxy} pageProxy 
     * @param {boolean} onCreate
     */
    static setDefaultValues(pageProxy, onCreate) {
        try {
            //get controls
            let container = pageProxy.getControl('FormCellContainer');
            let controlKey = container.getControl('ControlKeyLstPkr');
            
            if (onCreate) {
                libPrivate._getParentOperation(pageProxy).then(parentOperation => {
                    controlKey.setValue(parentOperation.ControlKey);
                    controlKey.getClientData().SetValueFromRule = true;
                    pageProxy.getClientData().DefaultValuesLoaded = true;
                });
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), 'Error: setDefaultValues - ' + err);
        }
    }
}

export class SubOperationControlLibrary {

    /**
     * Handle setting enable state and default values for equipment/floc and description fields based on parent work order or operation
     */
    static updateEquipFuncLocAfterWorkOrderChange(params) {
        try {
            if (params.planningPlant) {
                params.pageProxy.getClientData().TempPlanningPlant = params.planningPlant;
            } else {
                params.pageProxy.getClientData().TempPlanningPlant = '';
            }
            params.pageProxy.getClientData().TempEnable = params.enable; //Save state for operation on change to use
            params.funcLocExtension.setEditable(params.enable);
            params.equipmentExtension.setEditable(params.enable);
            if (!params.enable) {
                params.funcLocExtension.reload();
                params.equipmentExtension.reload();
            }
            if (params.descriptionValue) {
                params.descriptionControl.setValue(params.descriptionValue);
            } else {
                params.descriptionControl.setValue('');
            }
            
            if (params.workCenterControl && params.workCenterValue) {
                params.workCenterControl.setValue(params.workCenterValue);
            }

            if (params.equipValue && params.enable) { //Set the equipment, which will also set the floc
                return libSubOpControl.updateFlocFilter(params.pageProxy, params.planningPlant).then(()=> { //Reset the floc picker filter
                    return libSubOpControl.updateEquipment(params.pageProxy, params.planningPlant, true).then(()=> { //Reset the equipment picker filter
                        params.equipmentExtension.setValue(params.equipValue);
                        return Promise.resolve(true);
                    });
                });
            } else if (params.flocValue && params.enable) { //Only set the floc
                return libSubOpControl.updateFlocFilter(params.pageProxy, params.planningPlant).then(()=> { //Reset the floc picker filter
                    params.funcLocExtension.setValue(params.flocValue);
                    params.equipmentExtension.setValue('');
                    return Promise.resolve(true);
                });
            } else {
                return libSubOpControl.updateFlocFilter(params.pageProxy, params.planningPlant).then(()=> { //Reset the floc picker filter
                    return libSubOpControl.updateEquipment(params.pageProxy, params.planningPlant, true).then(()=> { //Reset the equipment picker filter
                        params.equipmentExtension.setValue('');
                        params.funcLocExtension.setValue('');
                        return Promise.resolve(true);
                    });
                });
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(params.pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), `UpdateEquipFuncLocAfterWorkOrderChange Error: ${err}`);
        }
        return Promise.resolve(true);
    }

    static getPersonNum(pageProxy) {
        let assignmentType = libCommon.getWorkOrderAssignmentType(pageProxy);

        if (assignmentType === '3') {
            return libCommon.getPersonnelNumber();
        } else {
            return '';
        }
    }

    /**
     * Funcational Location getter
     * @param {IPageProxy} pageProxy 
     */
     static getFunctionalLocation(pageProxy) {
        let funcLocControl = pageProxy.evaluateTargetPath('#Page:SubOperationCreateUpdatePage/#Control:FuncLocHierarchyExtensionControl');
        if (funcLocControl !== undefined && funcLocControl.getValue() !== undefined) {
            return funcLocControl.getValue();
        }
        return '';
    }

    /**
     * Funcational Location getter
     * @param {IPageProxy} pageProxy 
     */
     static getFunctionalLocationValue(pageProxy) {
        let funcLocControl = pageProxy.evaluateTargetPath('#Page:SubOperationCreateUpdatePage/#Control:FuncLocHierarchyExtensionControl');
        if (funcLocControl !== undefined && funcLocControl.getValue() !== undefined) {
            let floc =  funcLocControl.getValue();
            if (libCommon.isCurrentReadLinkLocal(floc)) {
                return libCommon.getEntityProperty(pageProxy, `MyFunctionalLocations(${floc})`, 'FuncLocIdIntern').then(flocIdIntern => {
                    return flocIdIntern;
                });
            }
            return floc;
        }
        return '';
    }

    /**
     * Equipment getter
     * @param {IPageProxy} pageProxy 
     */
    static getEquipment(pageProxy) {
        let equipControl = pageProxy.evaluateTargetPath('#Page:SubOperationCreateUpdatePage/#Control:EquipHierarchyExtensionControl');
        if (equipControl !== undefined && equipControl.getValue() !== undefined) {
            return equipControl.getValue();
        }
        return '';
    }

    /**
     * Equipment getter
     * @param {IPageProxy} pageProxy 
     */
     static getEquipmentValue(pageProxy) {
        let equipControl = pageProxy.evaluateTargetPath('#Page:SubOperationCreateUpdatePage/#Control:EquipHierarchyExtensionControl');
        if (equipControl !== undefined && equipControl.getValue() !== undefined) {
            let equipment =  equipControl.getValue();
            if (libCommon.isCurrentReadLinkLocal(equipment)) {
                return libCommon.getEntityProperty(pageProxy, `MyEquipments(${equipment})`, 'EquipId').then(equipmentId => {
                    return equipmentId;
                });
            }
            return equipment;
        }
        return '';
    }

    /**
     * ControlKey getter
     * @param {IPageProxy} pageProxy 
     */
    static getControlKey(pageProxy) {
        let controlKey = libCommon.getTargetPathValue(pageProxy, '#Control:ControlKeyLstPkr/#Value');
        return libCommon.getListPickerValue(controlKey);
    }

    /**
     * WorkCenterPlant getter
     * @param {IPageProxy} pageProxy 
     */
    static getWorkCenterPlant(pageProxy) {
        let workCenterPlant = libCommon.getTargetPathValue(pageProxy, '#Control:WorkCenterPlantLstPkr/#Value');
        return libCommon.getListPickerValue(workCenterPlant);
    }

    /**
     * MainWorkCenter getter
     * @param {IPageProxy} pageProxy 
     */
    static getMainWorkCenter(pageProxy) {
        let workCenter = libCommon.getTargetPathValue(pageProxy, '#Control:WorkCenterLstPkr/#Value');
        return libCommon.getListPickerValue(workCenter);
    }

    /**
     * Update the equipment list picker choices based on functional location
     * @param {*} pageProxy 
     * @param {*} reset If true, reset filter to all equipment regardless of current func loc
     */
    static updateEquipment(pageProxy, planningPlant, reset=false) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let onWOChangeSet = libCommon.isOnWOChangeset(pageProxy);
            let parentWorkOrderPromise;

            if (planningPlant) {
                parentWorkOrderPromise = Promise.resolve({PlanningPlant: planningPlant});
            } else if (pageProxy.getClientData() && pageProxy.getClientData().TempPlanningPlant) { 
                parentWorkOrderPromise = Promise.resolve({PlanningPlant: pageProxy.getClientData().TempPlanningPlant});
            } else {
                parentWorkOrderPromise = libPrivate._getParentWorkOrder(pageProxy, onWOChangeSet);
            }
            return parentWorkOrderPromise.then(parentWorkOrder => {
                let newPlanningPlant = '';
                if (parentWorkOrder && parentWorkOrder.PlanningPlant) {
                    newPlanningPlant = parentWorkOrder.PlanningPlant;
                }
                libCommon.setStateVariable(pageProxy, 'WODefaultPlanningPlant', newPlanningPlant);
                libCommon.setStateVariable(pageProxy, 'WODefaultReset', reset);
                let extension = formCellContainer.getControl('EquipHierarchyExtensionControl')._control._extension;
                return extension.reload().then(() => {
                    return Promise.resolve(true);
                });
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), `UpdateEquipment Error: ${err}`);
        }
        return Promise.resolve(false);
    }

    /**
     * Update Functional Location control
     * @param {IPageProxy} pageProxy 
     */
    static updateFloc(pageProxy) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let funcLocControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control._extension;
            let equipmentControlValue = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();

            if (equipmentControlValue) {
                return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['FuncLocIdIntern'], `$filter=EquipId eq '${libCommon.getListPickerValue(equipmentControlValue)}'`).then( results => {
                    if (results.length > 0 && results.getItem(0).FuncLocIdIntern) {
                        funcLocControl.setValue(results.getItem(0).FuncLocIdIntern);
                    }
                    return Promise.resolve(true);
                });
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(),`UpdateFloc Error: ${err}`);
        }
        return Promise.resolve(false);
    }

   /**
     * Update the functional location list picker after a new work order is selected
     * @param {*} pageProxy 
     * @param {*} planningPlant 
     */
    static updateFlocFilter(pageProxy, planningPlant) {
        try {
            libCommon.setStateVariable(pageProxy, 'WODefaultPlanningPlant', planningPlant);
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let extension = formCellContainer.getControl('EquipHierarchyExtensionControl')._control._extension;
            return extension.reload().then(() => {
                return Promise.resolve(true);
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), `UpdateFlocFilter Error: ${err}`);
        }
        return Promise.resolve(false);
    }

    /**
     * Get OperatonNumber for SubOperation
     * from control, or parent, if necessary
     * @param {IPageProxy} pageProxy
     */
    static getOperationNo(pageProxy) {
        if (pageProxy.getClientData().ParentOperation) {
            let opNum = pageProxy.getClientData().ParentOperation.OperationNo;
            let woNum = pageProxy.getClientData().ParentOperation.OrderId;
            libCommon.setStateVariable(pageProxy, 'operationId', opNum);
            libCommon.setStateVariable(pageProxy, 'workOrderId', woNum);
            return opNum;
        } else {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let opControlValue = formCellContainer.getControl('OperationLstPkr').getValue();
            let operationReadLink = libCommon.getListPickerValue(opControlValue);
            return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', operationReadLink, [], '')
                .then(operation => {
                    let opNum = operation.getItem(0).OperationNo;
                    let woNum = operation.getItem(0).OrderId;
                    libCommon.setStateVariable(pageProxy, 'operationId', opNum);
                    libCommon.setStateVariable(pageProxy, 'workOrderId', woNum);
                    return operation.getItem(0).OperationNo;
                });
        }
    }

    /**
     * WorkOrderParent getter
     * @param {IPageProxy} pageProxy 
     */
    static getWorkOrder(pageProxy) {
        let wo = libCommon.getTargetPathValue(pageProxy, '#Control:WorkOrderLstPkr/#Value');
        return libCommon.getListPickerValue(wo);
    }


    /**
     * WorkOrderParent getter
     * @param {IPageProxy} pageProxy 
     */
    static getOperation(pageProxy) {
        let op = libCommon.getTargetPathValue(pageProxy, '#Control:OperationLstPkr/#Value');
        return libCommon.getListPickerValue(op);
    }    
}

export class PrivateMethodLibrary {

    static _getParentOperation(context) {
        try {
            if (context.getClientData().ParentOperation) {
                return Promise.resolve(context.getClientData().ParentOperation);
            } else {
                let operationReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
                if (operationReadLink !== '') {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', operationReadLink, [], '')
                        .then(parentOp => {
                            context.getClientData().ParentOperation = parentOp.getItem(0);
                            return parentOp.getItem(0);
                        });
                    } else {
                        return Promise.resolve('');
                    }
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), 'Error: _getParentOperation - ' + err);
            return Promise.reject(err);
        }

    }

    static _getParentWorkOrder(context) {
        if (context.getClientData().ParentWorkOrder) {
            return Promise.resolve(context.getClientData().ParentWorkOrder);
        } else {
            let woReadLink = '';
            let onCreate = libCommon.IsOnCreate(context);
            if (onCreate) {
                woReadLink = context.binding['@odata.readLink'] + '/WOHeader';
            } else {
                woReadLink = context.binding.WorkOrderOperation.WOHeader['@odata.readLink'];
            }
            
            if (context.binding['@odata.readLink'] !== undefined) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', woReadLink, [], '')
                    .then(workOrder => {
                        context.getClientData().ParentWorkOrder = workOrder.getItem(0);
                        return workOrder.getItem(0);
                    });
                } else {
                    return Promise.resolve('');
                }
            }
    }
}
