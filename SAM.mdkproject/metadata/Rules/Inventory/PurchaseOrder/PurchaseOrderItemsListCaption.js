import ComLib from '../../Common/Library/CommonLibrary';

export default function PurchaseOrderItemsListCaption(clientAPI) {
    const queryOptions = "$filter=(PurchaseOrderId eq '" + clientAPI.getPageProxy().binding.PurchaseOrderId + "')";
    return ComLib.getEntitySetCount(clientAPI, 'PurchaseOrderItems', queryOptions).then(totalCount => {
        const count = clientAPI.evaluateTargetPath('#Count');
        if (totalCount && totalCount !== count) {
            return clientAPI.localizeText('ibd_open_items') + ' (' + count + '/' + totalCount + ')';
        }
        return clientAPI.localizeText('ibd_open_items') + ' (' + count + ')';
    });
}
