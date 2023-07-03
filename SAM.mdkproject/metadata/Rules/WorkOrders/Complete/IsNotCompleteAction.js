import libCom from '../../Common/Library/CommonLibrary';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';

export default function IsNotCompleteAction(context) {
    let flagName = WorkOrderCompletionLibrary.getInstance().getCompleteFlagName(context);
    return !libCom.getStateVariable(context, flagName);
}
