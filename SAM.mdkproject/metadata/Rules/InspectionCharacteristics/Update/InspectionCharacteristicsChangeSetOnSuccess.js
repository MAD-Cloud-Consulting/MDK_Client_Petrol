import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function InspectionCharacteristicsChangeSetOnSuccess(context) {

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateSuccess.action');
        });
    }
    
    let readlink = `InspectionLots('${context.binding.InspectionLot}')` + '/InspectionChars_Nav';
    let filter = "$filter=CharCategory eq 'X' and Valuation eq ''";

    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        readlink = context.binding.InspectionPoint_Nav[0]['@odata.readLink'] + '/InspectionChars_Nav';
    } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
        readlink = context.binding['@odata.readLink'] + '/InspectionChars_Nav';
    }

    return context.count('/SAPAssetManager/Services/AssetManager.service', readlink, filter).then(function(count) {
        if (count === 0) { //get the count for required Characteristics
            let actionBindingContext = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                //proceed to Inspection Points
                return context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateSuccess.action').then(() => {
                    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
                        var woInfo = context.binding.WOHeader_Nav;
                        if (!userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) || (woInfo && !woInfo.EAMChecklist_Nav.length > 0)) {
                            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointsUpdateNav.action');
                        } 
                        if (libCom.getSetUsage(context)) {
                            actionBindingContext.setActionBinding(context.binding.InspectionLot_Nav);
                            return actionBindingContext.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsageNav.action');
                        }
                        return Promise.resolve();
                    } else {
                        if (libCom.getSetUsage(context)) {
                            actionBindingContext.setActionBinding(context.binding.InspectionLot_Nav);
                            return actionBindingContext.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsageNav.action');
                        } else {
                            return Promise.resolve();
                        }
                    }
                });
            });
        }
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateSuccess.action');
        });
    });
}
