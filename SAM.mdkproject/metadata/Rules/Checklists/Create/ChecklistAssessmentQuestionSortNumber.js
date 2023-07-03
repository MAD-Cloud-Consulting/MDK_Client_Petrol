import { ChecklistLibrary as libChecklist } from '../ChecklistLibrary';

export default function ChecklistAssessmentQuestionSortNumber(pageClientAPI) {

    return libChecklist.ChecklistAssessmentQuestionCreateSetODataValue(pageClientAPI, 'SortNumber');
}
