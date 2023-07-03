import IsSupervisorSectionVisibleForWO from '../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForWO';

export default function WorkOrderListViewFilterVisible(context) {
    // Since SupervisorWorkOrderAddPopover (controlled by IsSupervisorSectionVisibleForWO) has a filter item,
    // we have to make this invisible when IsSupervisorSectionVisibleForWO is enabled.
    return IsSupervisorSectionVisibleForWO(context).then(result => {
        return !result;
    });
}
