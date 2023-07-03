
import libForms from './FSMSmartFormsLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import FSMFormPageNav from './FSMFormPageNav';
import FSMFormClosePage from './FSMFormClosePage';

/**
* Validate entire form, then complete and submit to backend
* @param {IClientAPI} clientAPI
*/
export default function FSMFormSubmit(context) {
    let passedValidation;
    let errorFound = false;

    return libForms.saveCurrentPageValues(context).then(() => {
        //Loop over all chapters, looking for data entry errors
        let chapters = libCom.getStateVariable(context, 'FSMFormInstanceChapters');
        let fields = libCom.getStateVariable(context, 'FSMFormInstanceControls');

        for (let i = 0; i < chapters.length; i++) {
            if (chapters[i].isVisible) { //Skip non-visible chapters
                let chapterControls = Object.keys(fields).filter(function(row) { //Get an array of all fields for the current chapter
                    return fields[row].ChapterIndex === i;
                });
                passedValidation = libForms.ValidateChapterValuesDuringSubmit(context, chapterControls);
                if (!passedValidation) {
                    if (!errorFound) {
                        errorFound = true;
                        libCom.setStateVariable(context, 'FSMFormInstanceCurrentChapterIndex', i); //Return to this chapter that has errors
                    }
                    chapters[i].state = 3; //Error state
                } else { //Chapter was in error state, but isn't anymore
                    if (chapters[i].state === 3) {
                        chapters[i].state = 0;
                    }
                }
            }
        }
        if (errorFound) { //Navigate to error chapter
            return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FormValidationErrorToast.action').then(() => {
                return FSMFormPageNav(context);
            });
        }
        return FSMFormPageNav(context).then(() => { //Reload current page to fix MDK message bug (ICMTANGOAMF10-20650)
            return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FormConfirmSubmitMessage.action').then(function(result) {
                if (result.data === true) {
                    libCom.setStateVariable(context, 'FSMClosedFlag', true); //Set the closed flag for updating instance to backend
                    libCom.setStateVariable(context, 'FSMToastMessage', context.localizeText('forms_closed_toast'));
                    return FSMFormClosePage(context);
                }
                return Promise.resolve();
            });
        });
    });
}
