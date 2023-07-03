// On a Local WO, make the Follow On switch invisible and set the flag value
import {WorkOrderLibrary} from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateFollowOnVisible(context) {
    let followup = WorkOrderLibrary.getFollowUpFlag(context);
    if (followup) {
        if (context.binding.OrderId.substring(0,5) === 'LOCAL') {
            WorkOrderLibrary.setFollowOnFlag(context, false);
            return false;
        } else {
            WorkOrderLibrary.setFollowOnFlag(context, true);
            return true;
        }
    } else {
        return false;
    }
}
