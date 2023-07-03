export default function MRNoteDetailsText(context) {
    let MRNotes = context.binding.ConnectionObject_Nav.ConnectionObjectMRNote_Nav;
    if (MRNotes && MRNotes.length > 0) {
        let promises = [];
        for (let i = 0; i < MRNotes.length; i ++) {
            promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', `MeterReaderNotes('${MRNotes[i].NoteID}')`, [], ''));
        }

        return Promise.all(promises).then(function(values) {
            values.forEach(function(value, idx) {
                values[idx] = value.getItem(0).NoteText;
            });

            return values.join('\n-----------\n');
        });
    } else {
        return '-';
    }
}
