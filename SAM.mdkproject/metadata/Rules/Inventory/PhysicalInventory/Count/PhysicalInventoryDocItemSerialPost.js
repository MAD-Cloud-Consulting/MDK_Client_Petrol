import serialItem from '../../Validation/ShowAutoSerialNumberField';
import libCom from '../../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocItemSerialPost(context) {
    let isCreate = libCom.IsOnCreate(context);

    return serialItem(context).then(function(serialized) { //Check if serialized material
        if (serialized) {
            let serialMap = libCom.getStateVariable(context, 'NewSerialMap'); //State of rows after user added/deleted on screen
            let serialArray = Array.from(serialMap.values());
            let oldRows = libCom.getStateVariable(context, 'OldSerialRows'); //Current rows in entity for this item

            if (context.binding) {
                let binding = context.binding;
                let counted = binding.ItemCounted;

                if (!counted) {
                    counted = '';
                }
                binding.TempHeader_Key = binding.PhysInvDoc + binding.FiscalYear + counted; //Used for transactionID in action
                binding.TempHeader_ReadLink = binding['@odata.readLink']; //Used for linking related entity action
            }
            
            return DeleteOldSerialLoop(context, oldRows, serialMap).then(() => { //Delete obsolete numbers
                return AddNewSerialLoop(context, serialArray, isCreate); //Add new numbers
            });
        }
        return Promise.resolve(true);
    });
}

//Loop over old serial numbers and delete them if they are not in the latest changes from user
export function DeleteOldSerialLoop(context, oldSerialNumbers, serialMap) {

    if (oldSerialNumbers && oldSerialNumbers.length > 0) {
        let row = oldSerialNumbers.getItem(0);

        if (!serialMap.has(row.SerialNumber)) { //User deleted this serial number on screen, so we need to delete from entity now
            libCom.setStateVariable(context, 'TempSerial_ReadLink', row['@odata.readLink']);

            return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDocItemSerialsDelete.action').then(() => {
                oldSerialNumbers.shift(); //Drop the first row in the array
                return DeleteOldSerialLoop(context, oldSerialNumbers, serialMap); //Recursively process the next item
            });
        }
        //Continue looping
        oldSerialNumbers.shift(); //Drop the first row in the array
        return DeleteOldSerialLoop(context, oldSerialNumbers, serialMap); //Recursively process the next item
    }
    return Promise.resolve(true); //No more serial numbers
}

//Loop over current serial number cache and add new ones to the entity
export function AddNewSerialLoop(context, serialArray, isCreate) {
    if (serialArray.length > 0) {
        let row = serialArray[0];
        let binding = context.binding;
        let action = '/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDocItemSerialsCreateRelated.action';

        if (isCreate) {
            action = '/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalIventorySerialCreateRelatedOnItemCreate.action';
        }
        if (row.IsNew) { //Newly added serial number from user
            if (!libCom.IsOnCreate(context)) {
                binding.TempSerial_FiscalYear = binding.FiscalYear;
                binding.TempSerial_Item = binding.Item;
                binding.TempSerial_PhysInvDoc = binding.PhysInvDoc;
                binding.TempSerial_SerialNumber = row.SerialNumber;
            } else {
                libCom.setStateVariable(context, 'TempSerial_SerialNumber', row.SerialNumber);
            }
            return context.executeAction(action).then(() => {
                serialArray.shift();
                return AddNewSerialLoop(context, serialArray, isCreate);
            });
        }
        //Continue looping
        serialArray.shift();
        return AddNewSerialLoop(context, serialArray, isCreate);
    }
    return Promise.resolve(true); //No more serial numbers
}
