import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import phaseModelExpand from '../../PhaseModel/PhaseModelListViewQueryOptionExpand';

export default function NotificationDetailsNavQueryOptions(context) {

    let queryOptions = '$expand=WorkOrder,NotifPriority,NotifMobileStatus_Nav,NotifDocuments,NotifDocuments/Document,HeaderLongText,FunctionalLocation,Equipment,NotifMobileStatus_Nav/OverallStatusCfg_Nav';

    if (IsPhaseModelEnabled(context)) {
        queryOptions += ',' + phaseModelExpand('QMI');
    }

    return queryOptions;
}
