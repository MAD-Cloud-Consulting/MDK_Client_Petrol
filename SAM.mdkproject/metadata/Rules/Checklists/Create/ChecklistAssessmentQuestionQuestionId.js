import { ChecklistLibrary as libChecklist } from '../ChecklistLibrary';

export default function ChecklistAssessmentQuestionQuestionId(pageClientAPI) {

    return libChecklist.ChecklistAssessmentQuestionCreateSetODataValue(pageClientAPI, 'QuestionId');
}
