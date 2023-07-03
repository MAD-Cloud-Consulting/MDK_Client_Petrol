import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryCreateListNavAfterCancel(context) {

    let navToList = libCom.getStateVariable(context, 'PhysicalInventoryReturnToList');

    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => { //Close the PI Item create screen and navigate back to list
        if (navToList) { //Only go back to list if item was added from there
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreateListNav.action');
        }
        return true;
    });
}
