export default function MapFuncLocWorkCenter(context) {
    let workCenterObjId = context.binding.WorkCenterObjId;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], "$filter=WorkCenterId eq '" + workCenterObjId + "'")
			.then(function(result) {
                if (result === undefined || !Array.isArray(result) || result.length === 0) {
                    return '';
                }
    let obj = result.getItem(0);
    return context.localizeText('work_center_plant')+': ' + obj.PlantId + ' - ' + obj.WorkCenterName;
});
}
