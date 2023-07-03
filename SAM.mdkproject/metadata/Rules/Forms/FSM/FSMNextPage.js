import CommonLibrary from '../../Common/Library/CommonLibrary';
import FSMFormPageNav from './FSMFormPageNav';
import libForms from './FSMSmartFormsLibrary';

/**
* Increment the current page counter
* @param {IClientAPI} clientAPI
*/
export default function FSMNextPage(clientAPI) {
    let chaptersArray = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceChapters');
    let currentChapterIndex = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let value;
    let passedValidation;

    if (currentChapterIndex < chaptersArray.length) { //Find the next visible chapter
        for (let i = currentChapterIndex + 1; i < chaptersArray.length; i++) {
            if (chaptersArray[i].isVisible) {
                value = i;
                break;
            }
        }
    }
    passedValidation = libForms.ValidateCurrentPageValues(clientAPI);
    if (passedValidation) {
        CommonLibrary.setStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex', value);
        return libForms.saveCurrentPageValues(clientAPI).then(() => {
            return FSMFormPageNav(clientAPI);
        });
    } else {
        clientAPI.executeAction('/SAPAssetManager/Actions/Forms/FSM/FormValidationErrorBanner.action');
    }
}
