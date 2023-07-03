export default function FormatPlanningPlant(context) {
    // Taking around 0.8 seconds
    return context.read('/SAPAssetManager/Services/AssetManager.service', `Plants('${context.binding.PlanningPlant}')`, [], '$select=PlantDescription').then(function(result) {
        if (result && result.getItem(0)) {
            return context.binding.PlanningPlant + ' - ' + result.getItem(0).PlantDescription;
        } else {
            return '-';
        }
    });
}
