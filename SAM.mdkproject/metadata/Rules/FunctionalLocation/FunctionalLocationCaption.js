import count  from '../FunctionalLocation/FunctionalLocationCount';
import libVal from '../Common/Library/ValidationLibrary';

export default function FunctionalLocationCaption(context) {
    return count(context).then(result => {
        let queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
           
        if (queryOption && queryOption !== '$filter=') {
            if (context.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                queryOption += ` and (WorkOrderHeader/any( wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' ) or WorkOrderOperation/WOHeader/any(wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' ) or WorkOrderSubOperation/WorkOrderOperation/WOHeader/any( wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' ))`;
            } 

            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations',queryOption).then(function(filteredCount) {
                if (filteredCount === result) {
                    return context.localizeText('functional_location_x', [result]);
                }
                return context.localizeText('functional_location_x_x', [filteredCount, result]);
            });
        } else {
            return context.localizeText('function_location_caption', [result]);
        } 
    });
}
