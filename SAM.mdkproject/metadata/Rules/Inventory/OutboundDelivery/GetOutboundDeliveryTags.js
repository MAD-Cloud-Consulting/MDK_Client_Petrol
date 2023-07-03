/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetOutboundDeliveryTags(clientAPI) {
    const binding = clientAPI.binding;
    let tags = [binding.DeliveryType, binding.DocumentCategory, binding.DeliveryPriority];
    switch (binding.GoodsMvtStatus) {
        case 'A':
            tags.push(clientAPI.localizeText('open'));
            break;
        //case 'B':
        //    tags.push(clientAPI.localizeText('outbound_document_partial'));
        //    break;
        case 'C':
            tags.push(clientAPI.localizeText('outbound_document_completed'));
            break;
        default:
            tags.push(clientAPI.localizeText('open'));
    }

    if (binding.NumPackages > 0) {
        if (binding.NumPackages === 1) {
            tags.push(clientAPI.localizeText('number_of_packages_1_package'));
        } else {
            tags.push(clientAPI.localizeText('number_of_packages',[binding.NumPackages]));
        }
    }

    return tags;
}
