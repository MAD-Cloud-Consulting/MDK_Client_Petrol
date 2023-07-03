import libCom from '../../Common/Library/CommonLibrary';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';

export default function IsCompleteAction(context) {
    let flagName = WorkOrderCompletionLibrary.getInstance().getCompleteFlagName(context);
    return !!libCom.getStateVariable(context, flagName);
}
