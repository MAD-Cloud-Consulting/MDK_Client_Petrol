export default function InspectionLotSetUsageNav(context) {
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=InspectionPoints_Nav,InspectionChars_Nav,InspValuation_Nav,InspectionCode_Nav,WOHeader_Nav/OrderMobileStatus_Nav').then((result) => {
        if (result && result.length > 0) {
            context.setActionBinding(result.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLot/InspectionLotSetUsageNav.action');
        }
        return true;
    });
}
