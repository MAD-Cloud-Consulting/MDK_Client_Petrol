import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import postSerial from '../PhysicalInventory/Count/PhysicalInventoryDocItemSerialPost';
import validateData from '../Validation/ValidatePhysicalInventoryCount';

export default function PhysicalIventoryItemCreateUpdateOnCommit(context) {
    let onCreate = libCom.IsOnCreate(context);
    let navToList = libCom.getStateVariable(context, 'PhysicalInventoryReturnToList');
    
    return validateData(context).then(valid => {
        if (valid) {
            if (onCreate) {
                libCom.setStateVariable(context, 'RedrawPIItemsCounted', true); 
                return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryItemCreateRelated.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDocItemUpdateLinks.action').then(() => {
                        return postSerial(context).then(() => {
                            return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCloseModal.action').then(() => {
                                if (navToList) { //Only return to items modal if we are adding from there
                                    return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreateListNav.action');
                                }
                                return true;
                            });
                        });
                    });
                }).catch((error)=>{
                    Logger.error('PhysicalIventory', `PhysicalIventoryItem.create error: ${error}`);
                });
            } else {
                //Edit
            }
        }
        return false; //Validation failed
    });
}
