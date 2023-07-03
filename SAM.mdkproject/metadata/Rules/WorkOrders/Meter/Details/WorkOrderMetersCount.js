import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function WorkOrderMetersCount(context) {
    let isuLink = context.getPageProxy().binding.OrderISULinks[0];
    if (isuLink.ISUProcess === 'DISCONNECT' || isuLink.ISUProcess === 'RECONNECT') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding['@odata.readLink'] + '/DisconnectActivity_Nav', [], '').then(function(result) {
            if (result && result.length > 0) {
                return CommonLibrary.getEntitySetCount(context, result.getItem(0)['@odata.readLink'] + '/DisconnectObject_Nav', '');
            } else {
                return '0';
            }
        });
    } else {
        return CommonLibrary.getEntitySetCount(context, context.getPageProxy().binding['@odata.readLink'] + '/OrderISULinks', '$filter=sap.entityexists(Device_Nav)');
    }
}
