import libMeter from '../../Meter/Common/MeterLibrary';

export default function ReadingNoteValues(context) {
    let procType = '';
    switch (libMeter.getMeterTransactionType(context)) {
        case 'INSTALL':
            procType = 'I';
            break;
        case 'REMOVE':
            procType = 'R';
            break;
        default:
            break;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadingNotes', [], `$filter=ProcessType eq '*' or ProcessType eq '${procType}'&$orderby=NoteID`).then(function(results) {
        let pickerValues = [];

        // Throw the results into a Values Hash table, eliminating duplicates. Keys are the NoteID
        let valuesHash = {};
        for (let i = 0; i < results.length; i ++) {
            let currValue = results.getItem(i);
            valuesHash[currValue.NoteID] = currValue.Description;
        }

        // Run through Values Hash and put it into Picker Values

        for (let noteID in valuesHash) {
            pickerValues.push({'DisplayValue' : `${noteID} - ${valuesHash[noteID]}`, 'ReturnValue': noteID});
        }

        return pickerValues;
    });
}
