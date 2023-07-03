import { WorkOrderLibrary as libWo} from '../WorkOrderLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import phaseModelExpand from '../../PhaseModel/PhaseModelListViewQueryOptionExpand';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function WorkOrdersListViewQueryOption(context) {
    let filter = '';
    let filters = [];
    let queryBuilder;
    let searchString = context.searchString;
    let clockedInString = context.localizeText('clocked_in').toLowerCase();
    let meterQueryOptions = 'OrderISULinks/Device_Nav/RegisterGroup_Nav,OrderISULinks/Device_Nav/DeviceCategory_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav';

    searchString = searchString.toLowerCase();
    if ((searchString) && (searchString === clockedInString)) {
        queryBuilder = libWo.getWorkOrdersListViewQueryOptions(context);
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserTimeEntries', ['PreferenceGroup','OrderId', 'WOHeader_Nav/ObjectKey'], '$orderby=PreferenceValue desc&$top=1&$expand=WOHeader_Nav').then(function(results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                if (row.PreferenceGroup === 'CLOCK_IN') {
                    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                        queryBuilder.expand(meterQueryOptions); 
                    }
                    queryBuilder.filter(`OrderId eq '${row.OrderId}'`);
                    return queryBuilder;
                }
                return queryBuilder(''); 
            }
            return queryBuilder(''); 
        }).catch(() => {
            return queryBuilder(''); //Read failure so return a blank string
        });
    }
    if (searchString) {
        //Standard order filters (required when using a dataQueryBuilder)
        filters.push(`substringof('${searchString}', tolower(OrderId))`);
        filters.push(`substringof('${searchString}', tolower(WOPriority/PriorityDescription))`);
        filters.push(`substringof('${searchString}', tolower(OrderDescription))`);
        if (libSuper.isSupervisorFeatureEnabled(context)) {
            //Supervisor assigned to filters
            filters.push(`WOPartners/any(wp : wp/PartnerFunction eq 'VW' and (substringof('${searchString}', tolower(wp/Employee_Nav/FirstName)) or substringof('${searchString}', tolower(wp/Employee_Nav/LastName))))`);
        }
        filter = '(' + filters.join(' or ') + ')';
    }
    if (libCommon.isDefined(context.binding)) {
        if (libCommon.isDefined(context.binding.isHighPriorityList)) {
            queryBuilder = libWo.getHighPriorityWorkOrdersQueryOptions(context);  
        } else if ((libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isSupervisorWorkOrdersList)) {
            queryBuilder = libSuper.getFilterForWOPendingReview(context);  
        } else if ((libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isTechnicianWorkOrdersList)) {
            queryBuilder = libSuper.getFilterForSubmittedWO(context);
        }
        if (queryBuilder) {
            if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                queryBuilder.expand(meterQueryOptions);
            }
            if (IsPhaseModelEnabled(context)) {
                queryBuilder.expand(phaseModelExpand('ORI'));
            }
            if (filter) {
                queryBuilder.filter().and(filter);
            }
            return queryBuilder;
        }
    }
    queryBuilder = libWo.getWorkOrdersListViewQueryOptions(context);
    if (IsPhaseModelEnabled(context)) {
        queryBuilder.expand(phaseModelExpand('ORI'));
    }
    if (filter) {
        queryBuilder.filter(filter);
    }
    if (libCommon.isDefined(context.binding) && libCommon.isDefined(context.binding.isInitialFilterNeeded)) {
        // getting filter values from state variable - slice(8) is need to remove '$filter='
        queryBuilder.filter(libCommon.getStateVariable(context,'WORKORDER_FILTER').slice(8));
    } 
    return queryBuilder;
}
