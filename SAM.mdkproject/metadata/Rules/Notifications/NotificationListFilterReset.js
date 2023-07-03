
import FilterReset from '../Filter/FilterReset';
import phaseFilterReset from '../PhaseModel/PhaseModelFilterPickerReset';

export default function NotificationListFilterReset(context) {
    phaseFilterReset(context, 'PhaseFilter');

    let clientData = context.evaluateTargetPath('#Page:NotificationsListViewPage/#ClientData');

    if (clientData && clientData.creationDateSwitch !== undefined) {
        clientData.creationDateSwitch = undefined;
        clientData.startDate = '';
        clientData.endDate = '';
    }

    FilterReset(context);
}
