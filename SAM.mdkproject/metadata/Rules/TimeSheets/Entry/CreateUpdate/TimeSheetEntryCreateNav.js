import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import libCrew from '../../../Crew/CrewLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';

export default function TimeSheetEntryCreateNav(clientAPI) {
    //Set the global TransactionType variable to CREATE
    libCom.setOnCreateUpdateFlag(clientAPI, 'CREATE');
    if (userFeaturesLib.isFeatureEnabled(clientAPI, clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        let pageProxy = clientAPI;
        if (typeof pageProxy.getPageProxy === 'function') {
            pageProxy = clientAPI.getPageProxy();
        }
        let actionContext = pageProxy.getActionBinding();
        if (libVal.evalIsEmpty(actionContext)) {
            actionContext = clientAPI.binding;
        }
        let personnelNumber = '';
        if (!libVal.evalIsEmpty(actionContext) && actionContext.hasOwnProperty('Employee')) {
            personnelNumber = actionContext.Employee.PersonnelNumber;
        }
        let date;
        if (!libVal.evalIsEmpty(actionContext) && actionContext.hasOwnProperty('Date')) {
            date = actionContext.Date;
        } else if (!libVal.evalIsEmpty(actionContext) && actionContext.hasOwnProperty('WorkDate')) {
            date = actionContext.WorkDate;
        }
        return libCrew.initializeCrewHeader(clientAPI).then( function() { //Initialize today's crew
            let binding = {
                'TimeSheetEmployee': personnelNumber,
                'Date': date,
            };
            clientAPI.setActionBinding(binding);
            return clientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateNav.action');
        });

    }
    return clientAPI.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateNav.action');
}
