import { ChecklistLibrary as libChecklist } from '../ChecklistLibrary';

export default function ChecklistBusObjectObjectId(pageClientAPI) {

    return libChecklist.ChecklistBusObjectCreateSetODataValue(pageClientAPI, 'ObjectId');
}
