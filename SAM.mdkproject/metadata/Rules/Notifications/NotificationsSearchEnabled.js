import notificationCount from './NotificationsCountOnOverviewPage';
import libVal from './../Common/Library/ValidationLibrary';
export default function NotificationsSearchEnabled(context) {
    var queryOptions = '';
    if (!libVal.evalIsEmpty(context.binding.binding) && context.binding.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        let equipment = context.binding.binding.EquipId;
        queryOptions = `$filter=HeaderEquipment eq '${equipment}'`;
    }

    return notificationCount(context, queryOptions).then(count => {
        return count !==0;
    });
}
