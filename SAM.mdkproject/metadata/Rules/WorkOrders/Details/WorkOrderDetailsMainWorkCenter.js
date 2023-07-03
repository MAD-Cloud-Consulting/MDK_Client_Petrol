export default function WorkOrderDetailsMainWorkCenter(context) {
    var binding = context.binding;
    var id = binding.MainWorkCenter;
    let filterQuery = `$filter=ExternalWorkCenterId eq '${binding.MainWorkCenter}'`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], filterQuery).then(function(result) {
        if (result && result.length > 0) {
            return id + ' - ' + result.getItem(0).WorkCenterDescr; 
        }
        return '-';
    });
}
