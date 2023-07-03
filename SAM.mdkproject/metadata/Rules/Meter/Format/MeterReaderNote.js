import {ValueIfExists} from './Formatter';

export default function MeterReaderNote(context) {
    let equipment = context.evaluateTargetPathForAPI('#Page:-Previous').binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc`).then(function(result) {
        if (result && result.length > 0) {
            return ValueIfExists(result.getItem(0).MeterReaderNote, '-', function(value) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadingNotes', [], `$top=1&$filter=NoteID eq '${value}'`).then(function(readVal) {
                    if (readVal && readVal.length === 1) {
                        return readVal.getItem(0).Description;
                    } else {
                        return '-';
                    }
                });
            });
        } else {
            return '-';
        }
    });
}
