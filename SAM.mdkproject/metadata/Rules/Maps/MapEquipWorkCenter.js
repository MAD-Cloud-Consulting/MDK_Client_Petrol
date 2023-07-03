export default function MapWorkOrderWorkCenter(context) {
    let workCenter = context.binding.WorkCenter;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], "$filter=WorkCenterId eq '" + workCenter + "'")
			.then(function(result) {
                if (result === undefined || !Array.isArray(result) || result.length === 0) {
                    return '';
                }
    let obj = result.getItem(0);
    return context.localizeText('work_center_plant') + ': ' + obj.PlantId + ' - ' + obj.WorkCenterName;
});
}
