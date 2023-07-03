import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import IsOnCreate from '../../Common/IsOnCreate';

export default function NotificationCreateMinorSwitchVisible(context) {
    return IsPhaseModelEnabled(context) && IsOnCreate(context);
}
