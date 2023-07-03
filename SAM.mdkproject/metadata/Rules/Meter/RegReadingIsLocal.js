export default function RegReadingIsLocal(context) {
    let equipment = context.getPageProxy().binding.EquipmentNum;
    if (context.getPageProxy().binding.BatchEquipmentNum) {
        equipment = context.getPageProxy().binding.BatchEquipmentNum;
    }
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', ['MeterReadingRecorded'], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc, MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {
            if (result.getItem(0)['@sap.isLocal']) {              
                return '/SAPAssetManager/Images/grid_sync.png';
            }
            return '/SAPAssetManager/Images/no_grid_icon.png';
        } else {
            return '/SAPAssetManager/Images/no_grid_icon.png';
        }
    });
}
