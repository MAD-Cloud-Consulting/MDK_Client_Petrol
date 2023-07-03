import FSMMapQueryOptions from '../Maps/FSMMapQueryOptions';

export default function WorkOrderRouteQueryOptions(context) {
   return FSMMapQueryOptions(context).then((options) => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], options).then(function(results) {
            let scheduleStartDate = [];
            let orderId = [];
            let query = '$top=1';
            for (var i = 0; i < results.length; i++) {
                if (!scheduleStartDate.includes(results.getItem(i).ScheduledStartDate)) {
                    scheduleStartDate.push(results.getItem(i).ScheduledStartDate);
                    orderId.push(results.getItem(i).OrderId);
                }
            }
            if (orderId.length > 0) {
                query = '$filter=';
            }
            for (var j = 0; j < orderId.length; j++) {
                if (j === 0) {
                    query = query + `OrderId eq '${orderId[j]}' `;
                } else {
                    query = query + ` or OrderId eq '${orderId[j]}' `;
                }
            }
            return query;
        });
    }).catch(() => {
        return '$top=1';
    });
}
