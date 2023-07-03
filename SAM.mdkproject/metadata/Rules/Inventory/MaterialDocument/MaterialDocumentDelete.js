import libCom from '../../Common/Library/CommonLibrary';
import updateItem from '../MaterialDocumentItem/UpdateInventoryDuringMatDocItemDelete';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

// in some cases we can't set context.binding, so we can use alternative solution
// we can push binding in the params and work with it using 'matDocTemp' field
// default functionality is not broken
export default function MaterialDocumentDelete(context, matDocTemp) {
    let binding = context.binding;
    if (matDocTemp) {
        binding = matDocTemp;
    }
    if (!context.binding) {
        context.getPageProxy().setActionBinding(binding);
    }
    libCom.setStateVariable(context, 'TempInventoryMaterialDocumentDelete', true);
    //Read all lines that are able to be received
    let query = "$filter=MaterialDocNumber eq '" + binding.MaterialDocNumber + "' and MaterialDocYear eq '" + binding.MaterialDocYear + "'";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', ['MatDocItem'], query).then(function(results) {
        // in some cases we could have document without attached items
        // in previous functionality we couldn't delete such doc, fixed it there
        var itemArray = [];
        if (results && results.length > 0) {
            results.forEach(function(row) {
                itemArray.push(row);
            });
        }
        return ProcessItemLoop(context, itemArray, binding).then(() => {
            libCom.removeStateVariable(context, 'TempInventoryMaterialDocumentDelete');
            binding.TempHeader_MatDocReadLink = binding['@odata.readLink'];
            context.getPageProxy().setActionBinding(binding);
            //Delete material document header
            // put finally, because we trying to delete errors after deleting a doc, guarateet close of the page if there somehow would appear an error 
            return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDeleteDuringItemDelete.action').finally(() => {
                //Close mat doc edit, mat doc details screens
                const closePageCount = libCom.getStateVariable(context, 'ClosePageCount');
                libCom.removeStateVariable(context, 'ClosePageCount');
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                    if (closePageCount === 3) {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
                        });
                    }
                    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
                });
            });
        });
    });
}

//Loop over material document items and update the inventory quantities
export function ProcessItemLoop(context, items, binding) {
    // if there is not items, connected to the document
    if (items.length === 0) return Promise.resolve(true); 
    let row = items[0];

    //Update the inventory item counts tied to this mat doc item
    return updateItem(context, row, binding).then(() => {  
        //Continue looping
        items.shift(); //Drop the first row in the array
        if (items.length > 0) {
            return ProcessItemLoop(context, items, binding); //Recursively process the next item
        }
        return Promise.resolve(true); //No more items
    });
}
