import IsPhaseModelEnabled from '../../../../Common/IsPhaseModelEnabled';
import IsNotificationMinor from '../../../MobileStatus/IsNotificationMinor';
import MobileStatusLibrary from '../../../../MobileStatus/MobileStatusLibrary';

export default function EnableNotificationItemTaskCreate(context) {
    if (IsPhaseModelEnabled(context) && IsNotificationMinor(context, MobileStatusLibrary.getMobileStatus(context.binding.Notification, context))) {
        return false;
    } else {
        return true;
    }
}
