import MobileStatusCompleted from '../../MobileStatus/MobileStatusCompleted';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import { GlobalVar as globals } from '../../Common/Library/GlobalCommon';

/**
* Disable creating confirmations if order is in Complete status
*/
export default function ConfirmationCreateIsEnabled(context) {
    let completedStatus = MobileStatusCompleted(context);
    let mobileStatus = libMobile.getMobileStatus(context.binding, context);
    // If autorelease is off, or we can't do local MobileStatuses or workorder is completed disable confirmations
    if (globals.getAppParam().WORKORDER.AutoRelease !== 'Y' || globals.getAppParam().MOBILESTATUS.EnableOnLocalBusinessObjects !== 'Y' || mobileStatus === completedStatus) {
        return false;
    } else {
        return true;
    }
}
