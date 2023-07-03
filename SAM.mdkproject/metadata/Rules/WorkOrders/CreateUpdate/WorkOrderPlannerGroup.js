import libCommon from '../../Common/Library/CommonLibrary';
import { GlobalVar } from '../../Common/Library/GlobalCommon';

export default function WorkOrderPlannerGroup(context) {
    let assignmentType = libCommon.getWorkOrderAssignmentType(context);
    if (assignmentType === '5' && GlobalVar.getUserSystemInfo().get('USER_PARAM.IHG')) {
        return GlobalVar.getUserSystemInfo().get('USER_PARAM.IHG');
    } else {
        return '';
    }
}
