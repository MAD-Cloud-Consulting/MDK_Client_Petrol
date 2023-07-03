import { OperationConstants as Constants } from './WorkOrderOperationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import phaseModelExpand from '../../PhaseModel/PhaseModelListViewQueryOptionExpand';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function WorkOrderOperationsListViewQueryOption(context) {
    let filter = '';
    let filters = [];
    let queryBuilder;
    let searchString = context.searchString;
    let clockedInString = context.localizeText('clocked_in');
    let meterQueryOptions = 'WOHeader/DisconnectActivity_Nav,WOHeader/OrderISULinks/Device_Nav/RegisterGroup_Nav,WOHeader/OrderISULinks/Device_Nav/DeviceCategory_Nav,WOHeader/OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,WOHeader/OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,WOHeader/OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,WOHeader/OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav';

    if ((searchString) && (searchString.toLowerCase() === clockedInString.toLowerCase())) {
        queryBuilder = context.dataQueryBuilder();
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserTimeEntries', ['PreferenceGroup','OrderId','OperationNo','WOHeader_Nav/ObjectKey','WOOperation_Nav/ObjectKey'], '$orderby=PreferenceValue desc&$top=1&$expand=WOHeader_Nav,WOOperation_Nav').then(function(results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                if (row.PreferenceGroup === 'CLOCK_IN') {
                    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
                        queryBuilder.expand(meterQueryOptions); 
                    }
                    let expands = 'WOObjectList_Nav,Tools,OperationMobileStatus_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav,WOOprDocuments_Nav/Document';
                    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
                        expands = 'InspectionPoint_Nav,' + expands;
                    }
                    queryBuilder.expand(expands);
                    queryBuilder.filter(`OrderId eq '${row.OrderId}' and OperationNo eq '${row.OperationNo}'`);
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
        //Standard operation filters (required when using a dataQueryBuilder)
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(OrderId))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(OperationNo))`);
        filters.push(`substringof('${searchString.toLowerCase()}', tolower(OperationShortText))`);
        if (libSuper.isSupervisorFeatureEnabled(context)) {
            //Supervisor assigned to filters
            filters.push(`substringof('${searchString.toLowerCase()}', tolower(Employee_Nav/LastName))`);
            filters.push(`substringof('${searchString.toLowerCase()}', tolower(Employee_Nav/FirstName))`);
        }
        filter = '(' + filters.join(' or ') + ')';
    }
    if (CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding['@odata.type']) && context.binding['@odata.type'] === '#sap_mobile.InspectionLot') {
        queryBuilder = context.dataQueryBuilder();
        queryBuilder.expand('WOHeader/InspectionLot_Nav,WOObjectList_Nav,Tools,OperationMobileStatus_Nav,OperationLongText,WOHeader,WOHeader/OrderMobileStatus_Nav,WOHeader/UserTimeEntry_Nav,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav');
        queryBuilder.filter("(OrderId eq '" + context.getPageProxy().getBindingObject().OrderId + "' and sap.entityexists(InspectionPoint_Nav))");
        queryBuilder.orderBy('OperationNo,OrderId,ObjectKey,OperationMobileStatus_Nav/MobileStatus');
        if (filter) {
            queryBuilder.filter().and(filter);
        }
        return queryBuilder;
    } else if (CommonLibrary.getStateVariable(context, 'FromOperationsList')) { // if we are coming from the side menu
        queryBuilder = Constants.FromWOrkOrderOperationListQueryOptions(context);
    } else if ((libSuper.isSupervisorFeatureEnabled(context)) && CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isSupervisorOperationsList)) {
        queryBuilder = libSuper.getFilterForOperationPendingReview(context);
    } else if ((libSuper.isSupervisorFeatureEnabled(context)) && CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isTechnicianOperationsList)) {
        queryBuilder = libSuper.getFilterForSubmittedOperation(context);
    }

    if (queryBuilder) {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
            queryBuilder.expand(meterQueryOptions);
        }
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue()) && CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding['@odata.type']) && context.binding['@odata.type'] === '#sap_mobile.InspectionLot') {
            queryBuilder.expand('WOHeader/InspectionLot_Nav,WOObjectList_Nav,Tools,OperationMobileStatus_Nav,OperationLongText,WOHeader,WOHeader/OrderMobileStatus_Nav,WOHeader/UserTimeEntry_Nav,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav');
            queryBuilder.filter("(OrderId eq '" + context.getPageProxy().getBindingObject().OrderId + "' and sap.entityexists(InspectionPoint_Nav))");
            queryBuilder.orderBy('OperationNo,OrderId,ObjectKey,OperationMobileStatus_Nav/MobileStatus');
            if (filter) {
                queryBuilder.filter().and(filter);
            }
            return queryBuilder;
        }
        if (IsPhaseModelEnabled(context)) {
            queryBuilder.expand(phaseModelExpand('OVG'));
        }
        if (filter) {
            queryBuilder.filter(filter);
        }
        return queryBuilder;
    } else {
        let queryOptions = Constants.OperationListQueryOptions(context);

        if (CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isInitialFilterNeeded)) { // initial filter for the list of operations for a particular date
            queryOptions += '&' + CommonLibrary.getStateVariable(context,'OPERATIONS_FILTER').query;
        } 
        return queryOptions;
    }
}
