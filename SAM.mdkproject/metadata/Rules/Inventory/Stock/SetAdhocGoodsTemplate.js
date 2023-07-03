import libCom from '../../Common/Library/CommonLibrary';

export default function SetAdhocGoodsTemplate(context, moveType) {
    let docId = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().ActualDocId;
    let created = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().IsAlreadyCreatedDoc;
    // if document is already created, then calling create modal with params
    // to add one more item to existing document instead of creating new one
    if (libCom.isDefined(docId)) {
        let query = `$filter=MaterialDocNumber eq '${docId}'`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocuments', [], query).then(function(results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink',row['@odata.readLink']);
            } else {
                libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink', '');
            }
            libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber', docId);
            libCom.setStateVariable(context, 'IMObjectType', 'ADHOC'); //PO/STO/RES/IN/OUT/ADHOC/MAT
            libCom.setStateVariable(context, 'IMMovementType', moveType); //I/R/T
            if (created) {
                context.getPageProxy().setActionBinding('');
            }
            return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateUpdateNav.action');
        });
    }
    libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink', '');
    libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber', '');
    libCom.setStateVariable(context, 'IMObjectType', 'ADHOC'); //PO/STO/RES/IN/OUT/ADHOC/MAT
    libCom.setStateVariable(context, 'IMMovementType', moveType); //I/R/T
    //return wrapper(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptCreateChangeset.action');
}
