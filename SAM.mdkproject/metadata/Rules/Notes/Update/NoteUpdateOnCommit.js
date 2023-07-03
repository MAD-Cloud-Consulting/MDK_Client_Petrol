import {NoteLibrary as NoteLib} from '../NoteLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import Constants from '../../Common/Library/ConstantsLibrary';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function NoteUpdateOnCommit(clientAPI) {
    let type = NoteLib.getNoteTypeTransactionFlag(clientAPI);
    if (type && type.noteUpdateAction) {
        if (IsCompleteAction(clientAPI)) {
            let updatedLocalNote = libCommon.getFieldValue(clientAPI, 'LongTextNote', '', null, true);
            let note = libCommon.getStateVariable(clientAPI, Constants.noteStateVariable);
            note.NewTextString = updatedLocalNote.trim();
            
            WorkOrderCompletionLibrary.updateStepState(clientAPI, 'note', {
                data: JSON.stringify(note),
                link: note['@odata.editLink'],
                value: clientAPI.localizeText('done'),
            });
        }

        libCommon.setStateVariable(clientAPI, Constants.stripNoteNewTextKey, true);        
        return clientAPI.executeAction(type.noteUpdateAction);
    }
}
