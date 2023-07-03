import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import ExecuteActionWithAutoSync from '../../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function InspectionPointsChangeSetOnSuccess(context) {

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointsUpdateSuccess.action');
        });
    }

    let readlink = `InspectionLots('${context.binding.InspectionLot}')` + '/InspectionPoints_Nav';
    let filter = "$filter=ValuationStatus eq ''";
    let lotReadlink = `InspectionLots('${context.binding.InspectionLot}')`;
    let lotFilter = '$expand=InspectionCode_Nav,WOHeader_Nav,InspValuation_Nav';
    let actionBindingContext = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');

    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        readlink = `InspectionLots('${context.binding.InspectionPoint_Nav[0].InspectionLot}')` + '/InspectionPoints_Nav';
        lotReadlink = `InspectionLots('${context.binding.InspectionPoint_Nav[0].InspectionLot}')`;
    }

    return context.count('/SAPAssetManager/Services/AssetManager.service', readlink, filter).then(function(count) {
        if (count === 0) { //get the count for points
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                //proceed to set usage
                return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointsUpdateSuccess.action').then(() => {
                    let value = libCom.getSetUsage(context);
                    return context.read('/SAPAssetManager/Services/AssetManager.service', lotReadlink, [], lotFilter).then(function(results) {
                        if (results && results.length > 0) {
                            let binding = results.getItem(0);
                            if (value === 'Y' && (libVal.evalIsEmpty(binding.UDCode) || binding['@sap.isLocal'])) { //UDCode is empty or the change is still local
                                actionBindingContext.setActionBinding(binding);
                                return actionBindingContext.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsageNav.action');
                            }
                        }
                        return true;
                    });
                });
                //return context.executeAction('/SAPQMAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointsUpdateSuccess.action');
            });
        }
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointsUpdateSuccess.action');
        });
    }); 
}
