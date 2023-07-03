import readLinks from '../PhysicalInventory/PhysicalInventoryDocumentReadLink';
import libCom from '../../Common/Library/CommonLibrary';

/**
 * User is cancelling from the PI Items list during create PI doc process, so remove the header and parent inventory object
 * @param {*} context 
 * @returns 
 */
export default function RemovePhysicalInventoryDoc(context) {
    return readLinks(context, true).then((results) => {
        libCom.setStateVariable(context, 'PI_ReadLink_Header', results[0]);
        if (results.length > 1) {
            libCom.setStateVariable(context, 'PI_ReadLink_Parent', results[1]);
        }
        return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryMyInventoryObjectDelete.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDocHeadersDelete.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        });
    });
}
