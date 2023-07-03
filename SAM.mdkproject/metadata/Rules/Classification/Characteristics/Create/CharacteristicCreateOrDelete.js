import libCom from '../../../Common/Library/CommonLibrary';
import deleteEntity from '../Delete/CharacteristicDelete';
import charCreateAction from '../CharacteristicCreateAction';
/**
 * This function will hold how many total chars are there in the list
 * and how many of them are deleted. After deleting, it will create
 * new chars.
 * @param {*} context 
 */
export default function CharacteristicCreateOrDelete(context) {
    // Number of characteristics already exist before user change anything
    let charCount = libCom.getStateVariable(context,'ClassCharValues');
    // Keep count on how many items are deleted from the delete index
    let deleteIndex = libCom.getStateVariable(context,'ListPickerDeleteIndex');
    let loopIndex = libCom.getStateVariable(context,'ListPickerLoopIndex');
    // Flag to reset when we are done deleting
    let isDeleting = libCom.getStateVariable(context,'isDeleting');
    if (deleteIndex < charCount) {
        libCom.setStateVariable(context,'isDeleting', true) ;
        deleteIndex++;
        libCom.setStateVariable(context,'ListPickerDeleteIndex', deleteIndex);
        return deleteEntity(context);
    } else {
        if (isDeleting) {
            libCom.setStateVariable(context,'isDeleting', false) ;
            // Set the index to the last CharValCounter that was deleted so we can create the new char starting from that
            libCom.setStateVariable(context,'CharValCountIndex', libCom.getStateVariable(context,'HighestCounter'));
        }
        loopIndex++;
        libCom.setStateVariable(context,'ListPickerLoopIndex', loopIndex);
        return charCreateAction(context);
    }
        
}
