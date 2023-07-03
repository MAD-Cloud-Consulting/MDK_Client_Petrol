import libWOStatus from '../MobileStatus/WorkOrderMobileStatusLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function WorkOrderDetailsOnPageLoad(context) {
    libCom.removeStateVariable(context,'IgnoreToolbarUpdate');
    // Hide the action bar based if order is complete and set the flag indicating if action items are visible or not
    return libWOStatus.isOrderComplete(context).then(status => {
        if (status) {
            context.setActionBarItemVisible(0, false);
            return true;
        }
        return false;
    });
}
