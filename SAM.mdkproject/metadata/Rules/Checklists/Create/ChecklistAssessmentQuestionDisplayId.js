import { ChecklistLibrary as libChecklist } from '../ChecklistLibrary';

export default function ChecklistAssessmentQuestionDisplayId(pageClientAPI) {

    return libChecklist.ChecklistAssessmentQuestionCreateSetODataValue(pageClientAPI, 'DisplayId');
}
