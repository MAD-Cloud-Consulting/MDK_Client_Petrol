import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function PreviousReadingDate(context) {
    let equipment = context.evaluateTargetPathForAPI('#Page:-Previous').binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc, MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {
            if (result.getItem(0).PreviousReadingDate && result.getItem(0).PreviousReadingTime) {
                let odataDate = OffsetODataDate(context, result.getItem(0).PreviousReadingDate, result.getItem(0).PreviousReadingTime);
                return context.formatDate(odataDate.date());
            }
        } 
        return '-';
    });
}
