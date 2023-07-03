import noteCreate from '../../Notes/NoteCreateNav';
import libCom from '../../Common/Library/CommonLibrary';

/**
 * Add notes during supervisor flow when a technician sets a work order or operation to review
 * @param {*} context 
 * @param {*} proceed - Does this work order or operation require a review?
 */
export default function NoteWrapper(context, proceed) {
    if (proceed) {
        libCom.setStateVariable(context, 'SupervisorNote', true);
        return noteCreate(context);
    }
    return Promise.resolve(true);
}
