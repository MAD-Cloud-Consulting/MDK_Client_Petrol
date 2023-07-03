import {ValueIfExists} from '../Formatter';

export default function MeterReaderNote(context) {
    return ValueIfExists(context.binding.MeterReaderNote, '-', function(value) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadingNotes', [], `$top=1&$filter=NoteID eq '${value}'`).then(function(readVal) {
            if (readVal && readVal.length === 1) {
                return readVal.getItem(0).Description;
            } else {
                return '-';
            }
        });
    });
}
