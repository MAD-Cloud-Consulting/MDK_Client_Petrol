import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function NotificationDetailsKeyValueSectionQueryOptions(context) {
    let queryoptions = '';

    if (IsPhaseModelEnabled(context)) {
        queryoptions = '$expand=Effect_Nav,DetectionGroup_Nav,DetectionCode_Nav';
    }
    return queryoptions;
}
