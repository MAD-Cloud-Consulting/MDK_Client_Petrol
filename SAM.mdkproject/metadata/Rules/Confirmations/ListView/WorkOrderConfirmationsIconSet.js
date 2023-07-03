import QueryBuilder from '../../Common/Query/QueryBuilder';
import FetchRequest from '../../Common/Query/FetchRequest';
import isAndroid from '../../Common/IsAndroid';

export default function WorkOrderConfirmationsIconSet(context) {

    let queryBuilder = new QueryBuilder();
    let binding = context.getBindingObject();

    // Check all the confirmations that roll up into this Work Order
    queryBuilder.addFilter(`OrderID eq '${binding.OrderId}'`);
    queryBuilder.addFilter('sap.islocal()');

    return new FetchRequest('Confirmations', queryBuilder.build()).count(context).then(count => {
        if (count > 0) {
            return [isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png'];
        }
        return [];
    });
}
