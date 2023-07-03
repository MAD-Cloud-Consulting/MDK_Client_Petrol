import QueryBuilder from '../../Common/Query/QueryBuilder';
import FetchRequest from '../../Common/Query/FetchRequest';


export default function DeleteUnusedOverviewEntities(context) {

    let queryBuilder = new QueryBuilder();
    queryBuilder.addFilter('Hours eq 0.00');

    let fetchRequest = new FetchRequest('CatsTimesheetOverviewRows', queryBuilder.build());

    return fetchRequest.execute(context).then(results => {
        if (results === undefined) {
            return Promise.resolve(true);
        }
        return executeDeleteChain(context, results);
    });
}

function executeDeleteChain(context, entities) {
    if (entities.length === 0) {
        return Promise.resolve(true);
    }
    return deleteOverview(context, entities.pop()).then(() => {
        return executeDeleteChain(context, entities);
    });
}

function deleteOverview(context, overview) {
    if (!overview['@sap.isLocal']) {
        return Promise.resolve(true);
    }

    context.getClientData().TimesheetOverviewRowReadlink = overview['@odata.readLink'];
    return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetOverviewRowDiscard.action');
}
