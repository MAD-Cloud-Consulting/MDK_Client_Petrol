import { ChecklistLibrary as libChecklist } from '../ChecklistLibrary';

export default function formCreatedOn(pageClientAPI) {

    return libChecklist.formCreateSetODataValue(pageClientAPI, 'CreatedOn');
}
