export default function GetFormattedTags(clientAPI) {
    var tags = [];
    var purchaseOrder = clientAPI.binding;

    if (purchaseOrder['@odata.readLink'] && purchaseOrder['@odata.readLink'].includes('MaterialDocuments')) {
        const tabs = [];
        let item = purchaseOrder.RelatedItem[0];
        if (item) {
            let movType = item.MovementType;
            tabs.push(movType);
        } else {
            // need this read because MDK clears all expanded data on return to the page
            return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocuments', [], `$filter=MaterialDocNumber eq '${purchaseOrder.MaterialDocNumber}'&$expand=RelatedItem`).then(data => {
                let document = data.getItem(0);
                if (document.RelatedItem && document.RelatedItem.length && document.RelatedItem[0]) {
                    return [document.RelatedItem[0].MovementType];
                }
                return [];
            });
        }
        return tabs;
    }

    tags.push(purchaseOrder.DocumentType);

    var documentStatus = purchaseOrder.DocumentStatus;

    if (documentStatus === 'B' || !documentStatus) { //Ignore partial for now, and use open if not set
        documentStatus = 'A';
    }
    switch (documentStatus) {
        case 'A':
            tags.push(clientAPI.localizeText('open'));
            break;
        case 'B':
            tags.push(clientAPI.localizeText('inbound_document_partial'));
            break;
        case 'C':
            tags.push(clientAPI.localizeText('inbound_document_completed'));
            break;
    }
    
    return tags;
}
