import EnableInspectionLotSetUsage from './SetUsage/EnableInspectionLotSetUsage';

export default function InspectionLotDetailsOnReturning(context) {

    if (context.binding['@odata.type'] === '#sap_mobile.InspectionLot') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=InspectionPoints_Nav').then ((inspectionLotObject) => {
            if (inspectionLotObject.length > 0) {
                context._context.binding = inspectionLotObject.getItem(0);
                return context.setActionBarItemVisible(0, EnableInspectionLotSetUsage(context));
            } else {
                return context.setActionBarItemVisible(0, false);
            }
        });
    }
}
