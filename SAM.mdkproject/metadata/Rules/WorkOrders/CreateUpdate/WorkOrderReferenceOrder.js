import libEval from '../../Common/Library/ValidationLibrary';
import {WorkOrderLibrary} from '../WorkOrderLibrary';

export default function WorkOrderReferenceOrder(context) {
    let onFollowOn = WorkOrderLibrary.getFollowOnFlag(context);
    if (onFollowOn) {
        return libEval.evalIsEmpty(context.binding.OrderId) ? '' : context.binding.OrderId;
    } else {
        return '';
    }
}
