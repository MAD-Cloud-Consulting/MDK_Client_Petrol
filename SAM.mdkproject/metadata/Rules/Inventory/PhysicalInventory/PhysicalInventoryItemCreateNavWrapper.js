import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryItemCreateNavWrapper(context) {
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => { //Close the items list
        //Reset serial number state variables
        libCom.setStateVariable(context, 'NewSerialMap', new Map());
        libCom.removeStateVariable(context, 'OldSerialRows');
        return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryItemCreateNav.action');
    });
}
