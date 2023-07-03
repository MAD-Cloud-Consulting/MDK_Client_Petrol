import createOrUpdate from '../Create/CharacteristicCreateOrUpdate';
import createOrDelete from '../Create/CharacteristicCreateOrDelete';
import libCom from '../../../Common/Library/CommonLibrary';
import cleanUpOnSuccess from '../CharacteristicCleanUpOnSuccess';
/**
 * This function will have the initial index of loop, the number of 
 * items selected by the users and if it's either a multi or single/free form
 * control. Based on this information it will call appropraite actions.
 * @param {*} context 
 */
export default function CharacteristicCRUD(context) {
    // keep count of where are we in the loop when creating/deleting/updating
    let loopIndex = libCom.getStateVariable(context,'ListPickerLoopIndex');
    // how many total items are there in the "SELECTED" list aka list picker. This is the list which user picked
    // and set by CharacterisitcUpdateOrCreateLoop function
    let loopCounter = libCom.getStateVariable(context,'ListPickerLoop');
    // Flag if it's a multiple list picker or not
    let isMultiListPicker = libCom.getStateVariable(context,'MultiListPicker');
    if (loopIndex === loopCounter) {
        return cleanUpOnSuccess(context);
    } else {
        if (isMultiListPicker) {
            // if it's multiple list picker we have to delete all the chars first
            // and then create new
            return createOrDelete(context);
        } else {
            loopIndex++;
            libCom.setStateVariable(context,'ListPickerLoopIndex', loopIndex);
            // For Single/Free Form control, we just have to either create or update
            return createOrUpdate(context);
        }
    }
}
