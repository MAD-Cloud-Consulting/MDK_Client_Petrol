import libCom from '../../Common/Library/CommonLibrary';

export default function OutboundDeliveryUpdateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OutboundDeliveryItems', [], `$filter=DeliveryNum eq '${context.binding.DeliveryNum}'&$expand=OutboundDeliverySerial_Nav,MaterialPlant_Nav,OutboundDelivery_Nav&$orderby=Item&$top=1`).then(result => { 
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
