import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import ListViewSetCaption from './SubOperationsListViewSetCaption';

export default function SubOperationsListViewFilter(context) {
    var entitySet = '';
    var filterText = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;

    if (CommonLibrary.isDefined(context.binding['@odata.readLink'])) {
        if (context.binding['@odata.readLink'].split('(')[0] === 'MyWorkOrderOperations') {
                entitySet = context.binding['@odata.readLink'] + '/SubOperations';
        } 
    } else {
        if (CommonLibrary.getWorkOrderAssignmentType(context) === '3') {
            entitySet = 'MyWorkOrderSubOperations';
            filterText = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
        }
    }

    CommonLibrary.setStateVariable(context,'SUBOPERATIONS_FILTER', {entity: entitySet, query: filterText});
    return ListViewSetCaption(context);
}
