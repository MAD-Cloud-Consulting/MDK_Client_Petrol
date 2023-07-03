import CommonLibrary from '../../Common/Library/CommonLibrary';
import FSMFormPageNav from './FSMFormPageNav';
import libForms from './FSMSmartFormsLibrary';

export default function ProgressTrackerOnStepSelected(context) {
    let extension = libForms.getProgressExtensionControl(context);
    let currIndex = extension.getCurrSelection(); 

    //Find the actual chapter index for this extension index
    let chapters = CommonLibrary.getStateVariable(context, 'FSMFormInstanceChapters');
    let chapter = chapters[chapters.findIndex((row) => row.extensionIndex === currIndex)];
    let currentChapterIndex = CommonLibrary.getStateVariable(context, 'FSMFormInstanceCurrentChapterIndex') || 0;

    if (chapters[currentChapterIndex].state === 3) { //Error state = 3
        libForms.ValidateCurrentPageValues(context, true);
    }
    CommonLibrary.setStateVariable(context, 'FSMFormInstanceCurrentChapterIndex', chapter.index);
    return libForms.saveCurrentPageValues(context).then(() => {
        return FSMFormPageNav(context);
    });
}
