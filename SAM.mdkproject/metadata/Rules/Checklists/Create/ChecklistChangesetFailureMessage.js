import libCom from '../../Common/Library/CommonLibrary';

export default function ChecklistChangesetFailureMessage(context) {

    libCom.clearFromClientData(context, ['Checklist-Question','Checklist-AssessmentId','Checklist-FormId','Checklist-TemplateId','Checklist-Rows'], undefined, true);
    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action');
    
}
