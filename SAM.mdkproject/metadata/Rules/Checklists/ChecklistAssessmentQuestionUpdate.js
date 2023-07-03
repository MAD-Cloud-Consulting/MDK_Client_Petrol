import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function ChecklistAssessmentQuestionUpdate(context) {

    let controls = libCom.getControlDictionaryFromPage(context);
    let actionArray = [];
    let answerLstPkrName = Object.keys(controls).find(control => control.includes('AnswerLstPkr'));

    //Do not post questions that have not been answered
    if (!libVal.evalIsEmpty(libCom.getControlValue(controls[answerLstPkrName]))) {
        actionArray.push('/SAPAssetManager/Actions/Checklists/ChecklistAssessmentQuestionUpdate.action');
    }
    return actionArray;
}
