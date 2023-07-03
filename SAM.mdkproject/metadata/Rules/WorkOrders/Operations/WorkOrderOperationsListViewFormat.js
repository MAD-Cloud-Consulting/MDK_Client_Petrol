import { WorkOrderEventLibrary as WoEventLib } from '../WorkOrderLibrary';

/**
 * Rule lets you format the operations list view row any which way you want.
 */
export default function WorkOrderOperationsListViewFormat(context) {
    return WoEventLib.WorkOrderOperationsListViewFormat(context);
}
