import deleteMessage from '../../Common/DeleteEntityOnSuccess';

export default function CheckRelatedWorkOrders(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkOrderHistories', [], `$filter=sap.islocal() and OrderId eq '${context.binding.OrderId}' and ReferenceType eq 'P'`).then(function(result) {
        if (result && result.length > 0) {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/RelatedWorkOrders/RelatedWorkOrderDiscard.action');
        } else {
            return deleteMessage(context);
        }
    });
}
