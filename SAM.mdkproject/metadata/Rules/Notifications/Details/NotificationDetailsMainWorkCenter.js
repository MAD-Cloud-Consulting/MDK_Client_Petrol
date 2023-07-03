import libVal from '../../Common/Library/ValidationLibrary';

export default function NotificationDetailsMainWorkCenter(context) {
    var binding = context.binding;
    if (libVal.evalIsEmpty(binding.ExternalWorkCenterId) || libVal.evalIsEmpty(binding.MainWorkCenter)) {
        return '-';
    }

    let id = binding.ExternalWorkCenterId;
    let filterQuery = `$filter=WorkCenterId eq '${binding.MainWorkCenter}' and ObjectType eq 'A'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], filterQuery).then(function(result) {
        if (result && result.length > 0) {
            return id + ' - ' + result.getItem(0).WorkCenterDescr;
        }
        return id;
    });
}
