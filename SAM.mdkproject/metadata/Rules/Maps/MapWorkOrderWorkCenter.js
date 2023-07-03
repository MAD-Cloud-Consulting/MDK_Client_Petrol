export default function MapWorkOrderWorkCenter(context) {
    let mainWorkCenter = context.binding.MainWorkCenter;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], "$filter=ExternalWorkCenterId eq '" + mainWorkCenter + "'")
			.then(function(result) {
                if (result === undefined || !Array.isArray(result) || result.length === 0) {
                    return '';
                }
    let obj = result.getItem(0);
    return context.getGlobalDefinition('/SAPAssetManager/Globals/Maps/WorkCenterPlantText.global').getValue() + obj.PlantId + ' - ' + obj.WorkCenterName;
});
}
