import WorkCenterControl from '../../../Common/Controls/WorkCenterControl';
import WorkCenterPlant from '../../../Common/Controls/WorkCenterPlantControl';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import EquipFLocIsAllowed from '../WorkOrderOperationIsEquipFuncLocAllowed';
import { PrivateMethodLibrary as libPrivate } from '../WorkOrderOperationLibrary';

export default function WorkOrderOperationCreateUpdateDefault(control) {
    let controlName = control.getName();
    let binding = control.getPageProxy().binding;
    let isOnEdit = !CommonLibrary.IsOnCreate(control.getPageProxy());

    switch (controlName) {
        case 'EquipHierarchyExtensionControl': {
            let extension = control.getPageProxy().getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl')._control._extension;
            // Based on some backend config a notification sometimes is auto-created when creating a work order. 
            // Typically it is linked to WO header only, but with Objects List Assignment setting being 3, the notification is also linked to the first operation.
            // For that reason we need to check the Notification associated with the operation first.
            if (CommonLibrary.isDefined(binding.NotifNum)) {
                return setHierarchyListPickerValue(control, binding, extension, 'Equipment', 'EquipId');
            } else {
                return EquipFLocIsAllowed(control.getPageProxy()).then(result => {
                    if (!result && isOnEdit) {
                        extension.setEditable(false);
                    }
                    if (result === true || isOnEdit) {
                        /// Set the Equipment picker using the Header or Operation Functional Location
                        if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                            extension.setData(control.getPageProxy().binding.HeaderEquipment);
                        } else if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                            extension.setData(control.getPageProxy().binding.OperationEquipment);
                        } else { //Default operation during WO add                    
                            let parentWorkOrderPromise = libPrivate._getParentWorkOrder(control.getPageProxy(), true);
                            return parentWorkOrderPromise.then(parentWorkOrder => {
                                if (parentWorkOrder && parentWorkOrder.Equipment) {
                                    extension.setData(parentWorkOrder.Equipment);
                                }
                                return true;
                            });
                        }
                    } else {
                        extension.setEditable(false);
                    }
                    return true;
                });
            }
        }
        case 'FuncLocHierarchyExtensionControl': {
            let extension = control.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl')._control._extension;
            // Based on some backend config a notification sometimes is auto-created when creating a work order. 
            // Typically it is linked to WO header only, but with Objects List Assignment setting being 3, the notification is also linked to the first operation.
            // For that reason we need to check the Notification associated with the operation first.
            if (CommonLibrary.isDefined(binding.NotifNum)) {
                return setHierarchyListPickerValue(control, binding, extension, 'FunctionalLocation', 'FuncLocId');
            } else {
                return EquipFLocIsAllowed(control.getPageProxy()).then(result => {
                    if (!result && isOnEdit) {
                        extension.setEditable(false);
                    }
                    if (result === true || isOnEdit) {
                        /// Set the FLOC picker using the Header or Operation Functional Location
                        if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                            extension.setData(control.getPageProxy().binding.HeaderFunctionLocation);
                        } else if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                            extension.setData(control.getPageProxy().binding.OperationFunctionLocation);
                        } else { //Default operation during WO add                    
                            let parentWorkOrderPromise = libPrivate._getParentWorkOrder(control.getPageProxy(), true);
                            return parentWorkOrderPromise.then(parentWorkOrder => {
                                if (parentWorkOrder && parentWorkOrder.FunctionalLocation) {
                                    extension.setData(parentWorkOrder.FunctionalLocation);
                                }
                                return Promise.resolve(true);
                            });
                        }
                    } else {
                        extension.setEditable(false);
                    }
                    return Promise.resolve(true);
                });
            }
        }
        case 'WorkCenterLstPkr':
            return WorkCenterControl.getOperationPageDefaultValue(control);
        case 'WorkCenterPlantLstPkr':
            return WorkCenterPlant.getOperationPageDefaultValue(control);
        case 'DescriptionNote': {
            const isOnWOChangeset = CommonLibrary.isOnWOChangeset(control.getPageProxy());
            
            //Default description from parent work order or operation
            if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' && !isOnWOChangeset) {
                return control.getPageProxy().binding.OrderDescription;
            } else if (control.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                return control.getPageProxy().binding.OperationShortText;
            } else { //Default operation during WO add                    
                let parentWorkOrderPromise = libPrivate._getParentWorkOrder(control.getPageProxy(), true);                        
                return parentWorkOrderPromise.then(parentWorkOrder => {
                    if (parentWorkOrder && parentWorkOrder.Description) {
                        return parentWorkOrder.Description;
                    }
                    return '';                                    
                });
            }
        }
        default:
            return '';
    }
}

function setHierarchyListPickerValue(control, binding, extension, readEntity, writeEntity) {
    return control.getPageProxy()
        .read('/SAPAssetManager/Services/AssetManager.service',
            `MyNotificationHeaders('${binding.NotifNum}')/${readEntity}`, [], '')
        .then(function setExtentionData(equipmentArray) {
            let equipment = equipmentArray.getItem(0);
            extension.setData(equipment[writeEntity]);
            return Promise.resolve(true);
        })
        .catch(function processError(error) {
            Logger.error('Error in setHierarchyListPickerValue: ' + error);
            extension.setData('');
            return Promise.resolve(false);
        });
}
