import libVal from '../../Common/Library/ValidationLibrary';

export default function NotificationDetailsPlannerGroup(context) {
    var binding = context.binding;
    if (libVal.evalIsEmpty(binding.PlanningGroup)) {
        return '-';
    }

    let id = binding.PlanningGroup;
    if (libVal.evalIsEmpty(binding.PlanningPlant)) {
        return id;
    }

    let filterQuery = `$filter=PlannerGroup eq '${id}' and PlanningPlant eq '${binding.PlanningPlant}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'PlannerGroups', [], filterQuery).then(function(result) {
        if (result && result.length > 0) {
            return id + ' - ' + result.getItem(0).PlannerGroupName;
        }
        return id;
    });
}
