import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Check if the next button should be enabled using total chapters
* @param {IClientAPI} clientAPI
*/
export default function FSMNextButtonEnabled(clientAPI) {
    let chaptersArray = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceChapters');
    let currentChapterIndex = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let value = false;

    if (currentChapterIndex < chaptersArray.length) { //Check to see if there are any more visible chapters 
        for (let i = currentChapterIndex + 1; i < chaptersArray.length; i++) {
            if (chaptersArray[i].isVisible) {
                value = true;
                break;
            }
        }
    }
    return value;
}
