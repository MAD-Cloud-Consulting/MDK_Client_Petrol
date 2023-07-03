import { ChecklistLibrary as libChecklist } from '../ChecklistLibrary';
import libCom from '../../Common/Library/CommonLibrary';

 export default function ChecklistCreateNav(context) {

    return context.executeAction('/SAPAssetManager/Actions/Checklists/Create/ChecklistCreateChangeset.action').then(() => {
        return libChecklist.ChecklistAssessmentQuestionsCreateSave(context).then(() => {
            //If the changeset was created without error, continue processing non-changeset creates
            if (libCom.isDefined(libCom.getStateVariable(context,'Checklist-AssessmentId'))) {
                libCom.clearFromClientData(context, ['Checklist-Question','Checklist-AssessmentId','Checklist-FormId','Checklist-TemplateId','Checklist-Rows'], undefined, true);
                libCom.redrawPageSection(context, 'ChecklistsListViewPage', 'SectionedTable');  //Redraw the screen - subscriptions bug
                return Promise.resolve(true);
            } else {
                libCom.clearFromClientData(context, ['Checklist-Question','Checklist-AssessmentId','Checklist-FormId','Checklist-TemplateId','Checklist-Rows'], undefined, true);
                return Promise.resolve(true);
            }
        }); 
    });
}
