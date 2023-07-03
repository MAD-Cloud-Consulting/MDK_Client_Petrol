import { ChecklistLibrary as libChecklist } from '../ChecklistLibrary';

export default function ChecklistBusObjectTemplateId(pageClientAPI) {

    return libChecklist.ChecklistBusObjectCreateSetODataValue(pageClientAPI, 'TemplateId');
}
