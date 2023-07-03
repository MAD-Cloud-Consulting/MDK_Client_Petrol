import libCom from '../../Common/Library/CommonLibrary';

export default function checklistCreateOnLoaded(context) {
    //Clear all checklist related create variables
    libCom.clearFromClientData(context, ['Checklist-Question','Checklist-AssessmentId','Checklist-FormId','Checklist-TemplateId','Checklist-Rows'], undefined, true);
    libCom.saveInitialValues(context);
}
