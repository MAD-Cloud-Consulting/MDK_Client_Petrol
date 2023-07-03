import CommonLibrary from '../Common/Library/CommonLibrary';
/* 
Disable Customer signature if one already exists on the order/operation
*/

export default function PDFViewIsCustomerSignatureEnabled(context) {
    let binding = context.binding || CommonLibrary.getStateVariable(context, 'ServiceReportData');
    let operationOdataType = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeOperation.global').getValue();
    let queryOptions = `$filter=OrderId eq '${binding.OrderId}'`;

    if (binding['@odata.type'] === operationOdataType) {
        queryOptions += ` and OperationNo eq '${binding.OperationNo}'`;
    } else {
        queryOptions += " and (OperationNo eq '' or OperationNo eq null)";
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderDocuments', [], `${queryOptions}&$expand=Document`).then(attachments => {
        let customerSignatureIndex = -1;
        
        if (attachments.length > 0) {
            let customerSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentCustomerSignaturePrefix.global').getValue();
            customerSignatureIndex = attachments.findIndex(attachment => attachment.Document && attachment.Document.FileName.startsWith(customerSignaturePrefix));
        }

        return customerSignatureIndex === -1;
        
    });
}
