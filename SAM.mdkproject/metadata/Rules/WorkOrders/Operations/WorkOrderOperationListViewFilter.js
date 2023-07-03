import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import IsOperationLevelAssigmentType from './IsOperationLevelAssigmentType';
import ListViewSetCaption from './WorkOrderOperationListViewSetCaption';
import { OperationConstants as Constants } from './WorkOrderOperationLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';

export default function WorkOrderOperationListViewFilter(context) {
    var entitySet;
    var queryOption;
    var localizeText;
    var localizeText_x_x;
    var filterText = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;

    if (libCom.isDefined(context.binding['@odata.readLink'])) {
        switch (context.binding['@odata.readLink'].split('(')[0]) {
            case 'MyWorkOrderHeaders':
                entitySet = context.binding['@odata.readLink'] + '/Operations';
                queryOption = getQuery(context);
                localizeText = 'operations_x';
                localizeText_x_x = 'operations_x_x';
                break;
            default:
                break;

        } 
    } else {
        if (IsOperationLevelAssigmentType(context)) {
            entitySet = 'MyWorkOrderOperations';
            queryOption = getQuery(context);
            localizeText = 'operations_x';
            localizeText_x_x = 'operations_x_x';
        }
    }
    
    let customFilter = libCom.getStateVariable(context, 'CustomListFilter');
    if (customFilter) {
        if (filterText !== '$filter=') { //Combine mdk filter with custom filter
            queryOption = queryOption.replace('&$filter=' + customFilter,''); //Remove current custom filter        
            queryOption += '&' + filterText + ' and ' + customFilter; //Inject mdk filter combined with custom filter
        }
    } else {
        if (filterText !== '$filter=') {
            queryOption += '&' + filterText; //Inject mdk filter only
        }
    }
    libCom.setStateVariable(context,'OPERATIONS_FILTER', {entity: entitySet, query: queryOption, localizeTextX: localizeText, localizeTextXX: localizeText_x_x});
    return ListViewSetCaption(context);
}

/**
 * Return the appropriate operations query
 * @param {*} context 
 * @returns 
 */
function getQuery(context) {
    if ((libCom.isDefined(context.binding)) && libCom.isDefined(context.binding.isOperationsList)) {
        return Constants.FromWOrkOrderOperationListQueryOptions(context, false);
    } else if ((libSuper.isSupervisorFeatureEnabled(context)) && libCom.isDefined(context.binding.isSupervisorOperationsList)) {
        return libSuper.getFilterForOperationPendingReview(context, false);
    } else if ((libSuper.isSupervisorFeatureEnabled(context)) && libCom.isDefined(context.binding.isTechnicianOperationsList)) {
        return libSuper.getFilterForSubmittedOperation(context, false);
    } else {
        return Constants.OperationListQueryOptions(context);
    }
}
