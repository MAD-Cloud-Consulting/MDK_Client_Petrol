import libCom from '../../Common/Library/CommonLibrary';

export default function OutboundDeliveryItemUpdateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}`, [], '$expand=OutboundDeliverySerial_Nav,MaterialPlant_Nav,OutboundDelivery_Nav').then(result => { 
        if (result && result.length > 0) {
            let item = result.getItem(0);
            context.setActionBinding(item);
            libCom.setStateVariable(context, 'IMObjectType', 'OB'); //PO/STO/RES/IB/OUT/ADHOC
            libCom.setStateVariable(context, 'IMMovementType', 'I'); //I/R
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateUpdateNav.action');
        }
        return true;
    });
}
