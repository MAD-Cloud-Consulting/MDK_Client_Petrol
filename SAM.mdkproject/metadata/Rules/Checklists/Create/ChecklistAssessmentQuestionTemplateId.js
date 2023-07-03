import { ChecklistLibrary as libChecklist } from '../ChecklistLibrary';

export default function ChecklistAssessmentQuestionTemplateId(pageClientAPI) {

    return libChecklist.ChecklistAssessmentQuestionCreateSetODataValue(pageClientAPI, 'TemplateId');
}
