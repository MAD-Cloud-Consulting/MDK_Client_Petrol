import libVal from '../Common/Library/ValidationLibrary';
import notificationCount from './NotificationsCountOnOverviewPage';

export default function NotificationsTotalCount(context, serviceNotifFilter = '') {
    var queryOptions = '';
    if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        let equipment = context.binding.EquipId;
        queryOptions = `$filter=HeaderEquipment eq '${equipment}'`;
    }

    if (serviceNotifFilter) {
        if (queryOptions) {
            queryOptions += ' and ' + serviceNotifFilter;
        } else {
            queryOptions = '$filter=' + serviceNotifFilter;
        }
    }

    return notificationCount(context, queryOptions).then(count => {
        return count;
    });
}
