import { ChecklistLibrary as libChecklist } from '../ChecklistLibrary';

export default function formFormId(pageClientAPI) {

    return libChecklist.formCreateSetODataValue(pageClientAPI, 'FormId');
}
