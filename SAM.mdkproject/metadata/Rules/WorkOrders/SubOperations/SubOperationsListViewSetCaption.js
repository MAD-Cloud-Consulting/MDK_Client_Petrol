import CommonLibrary from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
export default function SubOperationsListViewSetCaption(context) {

    var entitySet;
    var queryOption;

    var parameters = CommonLibrary.getStateVariable(context,'SUBOPERATIONS_FILTER');
    if (!libVal.evalIsEmpty(parameters)) {
        entitySet = parameters.entity;
        queryOption = parameters.query;
    } else {
        if (CommonLibrary.isDefined(context.binding['@odata.readLink'])) {
            if (context.binding['@odata.readLink'].split('(')[0] === 'MyWorkOrderOperations') {
                    entitySet = context.binding['@odata.readLink'] + '/SubOperations';
            }
        } else {
            if (CommonLibrary.getWorkOrderAssignmentType(context) === '3') {
                entitySet = 'MyWorkOrderSubOperations';
                queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
            }
        }
    }

    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet, '');
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet,queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
        let totalCount = resultsArray[0];
        let count = resultsArray[1];
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            return context.setCaption(context.localizeText('suboperations_x', [totalCount]));
        }
        return context.setCaption(context.localizeText('suboperations_x_x', params));
    });
}
