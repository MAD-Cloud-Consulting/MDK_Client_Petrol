import CommonLibrary from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function WorkOrderSubOperationListViewCaption(context) {
    var entitySet;
    var queryOption;
    var localizeText;
    var localizeText_x_x;

    if (CommonLibrary.isDefined(context.binding['@odata.readLink'])) {
            entitySet = context.binding['@odata.readLink'] + '/SubOperations';
            queryOption = '';
            localizeText = 'suboperations_x';    
            
            return context.count('/SAPAssetManager/Services/AssetManager.service',entitySet,queryOption).then(count => {
                let params=[count];
                return context.setCaption(context.localizeText(localizeText, params));
            }); 
        } else {
			if (CommonLibrary.getWorkOrderAssignmentType(context) === '3') {
                entitySet = 'MyWorkOrderSubOperations';
            } else {
                entitySet = context.binding['@odata.readLink'] + '/SubOperations';
            }
            queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
            localizeText = 'suboperations_x';
            localizeText_x_x = 'suboperations_x_x'; 

            var params = [];
            let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet, '');
            let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet,queryOption);
    
            return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
                let totalCount = resultsArray[0];
                let count = resultsArray[1];
                params.push(count);
                params.push(totalCount);
                if (count === totalCount) {
                    return context.setCaption(context.localizeText(localizeText, [totalCount]));
                }
                return context.setCaption(context.localizeText(localizeText_x_x, params));
            }); 
        }
}
