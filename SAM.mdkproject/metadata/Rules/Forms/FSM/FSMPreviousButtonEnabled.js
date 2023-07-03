import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Determine if previous button should be enabled for the FSM form
* @param {IClientAPI} clientAPI
*/
export default function FSMPreviousButtonEnabled(clientAPI) {
    let chaptersArray = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceChapters');
    let currentChapterIndex = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let value = false;

    if (currentChapterIndex > 0) { //Check to see if there are any more visible chapters 
        for (let i = currentChapterIndex - 1; i >= 0; i--) {
            if (chaptersArray[i].isVisible) {
                value = true;
                break;
            }
        }
    }
    return value;
}
