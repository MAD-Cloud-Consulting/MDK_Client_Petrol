export default function SerialPartsIssueFixScreen(context) {
    let readLink = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject.ReadLink;
    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '').then(result => {
        context.getPageProxy().setActionBinding(result.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/Common/ErrorArchiveDiscard.action');
    });
}
