import libCom from '../../Common/Library/CommonLibrary';

export default function InboundDeliveryUpdateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'InboundDeliveryItems', [], `$filter=DeliveryNum eq '${context.binding.DeliveryNum}'&$expand=InboundDelivery_Nav,InboundDeliverySerial_Nav,MaterialPlant_Nav&$orderby=Item&$top=1`).then(result => { 
        if (result && result.length > 0) {
            let item = result.getItem(0);
            context.setActionBinding(item);
            libCom.setStateVariable(context, 'IMObjectType', 'IB'); //PO/STO/RES/IB/OUT/ADHOC
            libCom.setStateVariable(context, 'IMMovementType', 'R'); //I/R
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateUpdateNav.action');
        }
        return true;
    });
}
