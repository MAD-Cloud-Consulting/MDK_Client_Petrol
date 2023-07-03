
import AllowIssueForSTO from '../StockTransportOrder/AllowIssueForSTO';

export default function GetTags(clientAPI) {
    
    var tags = [];
    var sto = clientAPI.binding;

    tags.push(sto.DocumentType);

    var documentStatus = sto.DocumentStatus;

    if (documentStatus === 'B' || !documentStatus) { //Ignore partial for now, and use open if not set
        documentStatus = 'A';
    }
    let issue = AllowIssueForSTO(sto);
    switch (documentStatus) {
        case 'A':
            tags.push(clientAPI.localizeText('open'));
            break;
        case 'B':
            if (issue) {
                tags.push(clientAPI.localizeText('outbound_document_partial'));
            } else {
                tags.push(clientAPI.localizeText('inbound_document_partial'));
            }
            break;
        case 'C':
            if (issue) {
                tags.push(clientAPI.localizeText('outbound_document_completed'));
            } else {
                tags.push(clientAPI.localizeText('inbound_document_completed'));
            }
            break;
    }
    return tags;

    /**
    var status = '';
    var binding = clientAPI.getBindingObject();
    var poItemsQueryOptions = "$filter=StockTransportOrderId eq '" + binding.StockTransportOrderId +"'";
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'StockTransportOrderItems', [], poItemsQueryOptions).then((poItemsResult) => {
        var isRecieved = true;
        var isPartiallyRecived = false;
        if ( poItemsResult.length > 0) {
            poItemsResult.forEach((item) => {
                if ((item.OrderQuantity - item.ReceivedQuantity) > 0) {
                    isRecieved = false;
                    if (item.ReceivedQuantity > 0) {
                        isPartiallyRecived = true;
                    }
                } else {
                    isPartiallyRecived = true;
                }
            });
            if (isRecieved) {
                status = clientAPI.localizeText('inbound_document_completed');
            } else {
                if (isPartiallyRecived) {
                    status = clientAPI.localizeText('inbound_document_partial');
                } else {
                    status = clientAPI.localizeText('open');
                }
            }
        } else {
            status = clientAPI.localizeText('open');
        }
        return [binding.DocumentType, status];
    });
    */
}
