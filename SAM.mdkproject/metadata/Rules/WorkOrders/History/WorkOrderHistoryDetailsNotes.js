import { NoteLibrary as NoteLib, TransactionNoteType} from '../../Notes/NoteLibrary';

/**
 * Rule to get the Work Order History notes if any exist.
 * @param {*} pageClientAPI Could be SectionProxy, PageProxy, ControlProxy, etc.
 * @returns {String} Work Order History notes.
 */
export default function WorkOrderHistoryDetailsNotes(pageClientAPI) {
    
    //Set the global NoteType variable to WorkOrder History
    NoteLib.setNoteTypeTransactionFlag(pageClientAPI, TransactionNoteType.workOrderHistory());

    //Download the existing note and display the text
    return NoteLib.noteDownloadValue(pageClientAPI);
}
