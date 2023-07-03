import ruleEvaluator from './FSMFormFieldOnValueChange';
import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';

export default function FSMFormOnPageLoad(context) {
    let currentChapterIndex = libCom.getStateVariable(context, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let chapters = libCom.getStateVariable(context, 'FSMFormInstanceChapters');

    ruleEvaluator(context, true); //Run all visibility rules when loading a new form chapter to set initial control states
    if (chapters[currentChapterIndex].state === 3) { //Validation caught errors during submit
        libForms.ValidateCurrentPageValues(context); //Highlight error fields
    }
}
