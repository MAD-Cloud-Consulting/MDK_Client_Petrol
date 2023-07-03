import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function InspectionLotQueryOptions(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue())) {
        return '$expand=InspectionPoints_Nav,InspectionChars_Nav,InspValuation_Nav,InspectionCode_Nav,WOHeader_Nav/OrderMobileStatus_Nav,WOHeader_Nav/EAMChecklist_Nav';
    } else {
        return '$expand=InspectionPoints_Nav,InspectionChars_Nav,InspValuation_Nav,InspectionCode_Nav,WOHeader_Nav/OrderMobileStatus_Nav';
    }
    
}
