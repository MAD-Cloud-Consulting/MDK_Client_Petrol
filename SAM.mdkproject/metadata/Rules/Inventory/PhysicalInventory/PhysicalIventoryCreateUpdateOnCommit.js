import commonLib from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import postSerial from '../PhysicalInventory/Count/PhysicalInventoryDocItemSerialPost';
import validateData from '../Validation/ValidatePhysicalInventoryCount';

export default function PhysicalIventoryCreateUpdateOnCommit(context) {
    let onCreate = commonLib.IsOnCreate(context);
    
    return validateData(context).then(valid => {
        if (valid) {
            if (onCreate) {
                let plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantLstPkr').getValue()[0].ReturnValue;
                commonLib.setStateVariable(context, 'PhysicalInventoryItemPlant', plant);
                let storageLocation = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker').getValue()[0].ReturnValue;
                commonLib.setStateVariable(context, 'PhysicalInventoryItemStorageLocation', storageLocation);
                let stockType = context.getPageProxy().getControl('FormCellContainer').getControl('StockTypePicker').getValue()[0].ReturnValue;
                commonLib.setStateVariable(context, 'PhysicalInventoryItemStockType', stockType);
                
                return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreate.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryMyInventoryObjectCreate.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryItemCreateRelated.action').then(() => {
                            return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDocItemUpdateLinks.action').then(() => {
                                return postSerial(context).then(() => {
                                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                                        return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreateListNav.action');
                                    });
                                });
                            });
                        });
                    });
                }).catch((error)=>{
                    Logger.error('PhysicalInventory', `PhysicalInventory.create error: ${error}`);
                });
            } else {
            //Update
            }
        }
        return false; //Validation failed
    });
}
