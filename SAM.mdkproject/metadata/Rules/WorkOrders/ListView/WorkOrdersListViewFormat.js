import { WorkOrderEventLibrary as WoEventLib } from '../WorkOrderLibrary';

/**
 * Rule lets you format the work order list view row any which way you want.
 */
export default function WorkOrdersListViewFormat(context) {
    return WoEventLib.WorkOrdersListViewFormat(context);
}
