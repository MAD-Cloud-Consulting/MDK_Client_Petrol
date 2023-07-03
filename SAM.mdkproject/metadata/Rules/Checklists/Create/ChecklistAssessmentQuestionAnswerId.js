import { ChecklistLibrary as libChecklist } from '../ChecklistLibrary';

export default function ChecklistAssessmentQuestionAnswerId(pageClientAPI) {

    return libChecklist.ChecklistAssessmentQuestionCreateSetODataValue(pageClientAPI, 'AnswerId');
}
