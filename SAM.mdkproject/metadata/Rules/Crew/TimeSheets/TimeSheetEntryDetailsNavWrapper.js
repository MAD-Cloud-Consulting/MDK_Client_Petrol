import libCrew from '../CrewLibrary';

export default function TimeSheetEntryDetailsNavWrapper(context) {

    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    let pageProxy = context;
    if (typeof pageProxy.getPageProxy === 'function') {
        pageProxy = context.getPageProxy();
    }
    let actionContext = pageProxy.getActionBinding();

    libCrew.initializeCrewHeader(context).then( function() { //Initialize today's crew
        pageProxy.setActionBinding(actionContext);
        let queryOptions = `$filter=PersonnelNumber eq '${actionContext.CrewItemKey}' and Date eq datetime'${context.binding.Date}'`;
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheets', queryOptions).then(results => {
            if (results  > 0) {
                return pageProxy.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryDetailsNav.action');
            } else {
                return Promise.resolve();
            }
        });
    });
}
