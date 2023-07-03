export default function GetFormattedTags(clientAPI) {
    const inboundDeliveryDoc = clientAPI.binding;
    let tags = [inboundDeliveryDoc.DeliveryType, inboundDeliveryDoc.DocumentCategory, inboundDeliveryDoc.DeliveryPriority];
    
    const goodsMvtStatus = inboundDeliveryDoc.GoodsMvtStatus;
    switch (goodsMvtStatus) {
        case 'A','B':
            tags.push(clientAPI.localizeText('open'));
            break;
        //case 'B':
        //    tags.push(clientAPI.localizeText('inbound_document_partial'));
        //    break;
        case 'C':
            tags.push(clientAPI.localizeText('inbound_document_completed'));
            break;
    }

    if (inboundDeliveryDoc.NumPackages > 0) {
        if (inboundDeliveryDoc.NumPackages === 1) {
            tags.push(clientAPI.localizeText('number_of_packages_1_package'));
        } else {
            tags.push(clientAPI.localizeText('number_of_packages',[inboundDeliveryDoc.NumPackages]));
        }
    }

    return tags;
}
