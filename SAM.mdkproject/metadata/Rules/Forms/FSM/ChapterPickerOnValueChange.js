import libCom from '../../Common/Library/CommonLibrary';
import FSMFormPageNav from './FSMFormPageNav';
import libForms from './FSMSmartFormsLibrary';

/**
* Chapter Picker On Value Change
* @param {IClientAPI} clientAPI
*/
export default function ChapterPickerOnValueChange(context) {
    let chapters = libCom.getStateVariable(context, 'FSMFormInstanceChapters');
    let chapterId =  libCom.getControlValue(context);
    let index = chapters[chapters.findIndex((row) => row.id === chapterId)].index;
    let currentChapterIndex = libCom.getStateVariable(context, 'FSMFormInstanceCurrentChapterIndex') || 0;
    
    if (chapters[currentChapterIndex].state === 3) { //Error state = 3
        libForms.ValidateCurrentPageValues(context, true);
    }
    libCom.setStateVariable(context, 'FSMFormInstanceCurrentChapterIndex', index);
    return libForms.saveCurrentPageValues(context).then(() => {
        return FSMFormPageNav(context);
    });
}
