import CommonLibrary from '../../Common/Library/CommonLibrary';
import FSMFormPageNav from './FSMFormPageNav';
import libForms from './FSMSmartFormsLibrary';

/**
* Decrement the current page counter
* @param {IClientAPI} clientAPI
*/
export default function FSMPreviousPage(clientAPI) {
    let chaptersArray = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceChapters');
    let currentChapterIndex = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let value;

    if (currentChapterIndex > 0) { //Find the previous visible chapter
        for (let i = currentChapterIndex - 1; i >= 0; i--) {
            if (chaptersArray[i].isVisible) {
                value = i;
                break;
            }
        }
    }
    if (chaptersArray[currentChapterIndex].state === 3) { //Error state = 3
        libForms.ValidateCurrentPageValues(clientAPI, true);
    }
    CommonLibrary.setStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex', value);
    return libForms.saveCurrentPageValues(clientAPI).then(() => {
        return FSMFormPageNav(clientAPI);
    }); 
}
