import libCommon from '../../Common/Library/CommonLibrary';

export default function ItemSortNumber(context) {

    return context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}', PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}')`, [], '').then(result => {
        /*
        * NotificationReadLink is used if QM Notification + Item will be created
        * NotificationQueryOpts is used if only an Item will be created
        */
        let NotificationQueryOpts = '';
        let defaultSortNumber = '0001';

        if (libCommon.isOnChangeset(context)) {
            return defaultSortNumber;
        } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
            if (result.getItem(0).OneQNotifPerLotFlag === 'X') {
                NotificationQueryOpts = `$filter=Items/any(itm: itm/InspectionChar_Nav/InspectionLot eq '${context.binding.InspectionLot}')`;
            } else {
                NotificationQueryOpts = `$filter=Items/any(itm: itm/InspectionChar_Nav/InspectionLot eq '${context.binding.InspectionLot}' and itm/InspectionChar_Nav/InspectionNode eq '${context.binding.InspectionNode}' and itm/InspectionChar_Nav/SampleNum eq '${context.binding.SampleNum}')`;
            }
        }

        if (NotificationQueryOpts) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], NotificationQueryOpts).then( function(data) {
                if (data.length > 0) {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', data.getItem(0)['@odata.readLink'] + '/Items', [], '$orderby=ItemSortNumber desc&$top=1').then( function(resultTwo) {
                        if (resultTwo.length > 0) {
                            return String(parseInt(resultTwo.getItem(0).ItemSortNumber) + 1).padStart(4, '0'); 
                        } else {
                            return defaultSortNumber;
                        }
                    });
                }
                return defaultSortNumber;
            });
        } else {
            return defaultSortNumber;
        }
    });
}
