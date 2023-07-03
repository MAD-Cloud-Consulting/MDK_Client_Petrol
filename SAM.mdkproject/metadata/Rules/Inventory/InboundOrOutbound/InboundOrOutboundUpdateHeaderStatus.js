import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';

/**
 * Update the header status on delivery document when changes have been made to a child item
 * @param {*} context 
 * @param {*} DeliveriesReadLink 
 * @param {*} DeliveriesEntitySet 
 * @param {*} DocumentCategory 
 * @param {*} DeliveryNum 
 * @returns 
 */
export default function InboundOrOutboundUpdateHeaderStatus(context, deliveryNum) {

    let type = libCom.getStateVariable(context, 'IMObjectType');
    const deliveriesEntitySet = (type === 'IB' ? 'InboundDeliveries' : 'OutboundDeliveries');
    let deliveriesReadLink = '';
    if (context.binding['@odata.type'] === '#sap_mobile.InboundDelivery' || context.binding['@odata.type'] === '#sap_mobile.OutboundDelivery') {
        deliveriesReadLink = context.binding['@odata.readLink'];
    } else {
        deliveriesReadLink = (type === 'IB' ? context.binding.InboundDelivery_Nav['@odata.readLink'] : context.binding.OutboundDelivery_Nav['@odata.readLink']);
    }
    const documentCategory = (type === 'IB' ? '7' : 'J');
    
    //Loop over all line items to determine header status
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${deliveriesReadLink}/Items_Nav`, [], '$orderby=Item').then(itemResults => {
        if (itemResults && itemResults.length > 0) {
            let picked = false; //At least one item has been picked
            let fullyPicked = 0; //Number of fully picked items
            let status = ''; //Header status

            for (var index = 0; index < itemResults.length; index++) {
                let item = itemResults.getItem(index);
                if (Number(item.PickedQuantity ) > 0) {
                    picked = true;
                    if (Number(item.PickedQuantity) === Number(item.Quantity)) {
                        fullyPicked++;
                    }
                }
            }

            if (fullyPicked === itemResults.length) { //Determine header status
                status = 'C'; //Complete
            } else if (picked) {
                status = 'B'; //Partial
            } else {
                status = 'A'; //Open
            }

            // Update Delivery
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryUpdate.action', 'Properties': {
                'Target': {
                    'EntitySet': deliveriesEntitySet,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': deliveriesReadLink,
                },
                'Properties': {
                    'ActualGoodsMvtDate': new ODataDate().toDBDateTimeString(context),
                    'DocumentCategory' : documentCategory,
                    'GoodsMvtStatus': status,
                },
                'RequestOptions': {
                    'UpdateMode': 'Replace',
                },
                'Headers': {
                    'OfflineOData.TransactionID': deliveryNum,
                },
            }});
        }
        return Promise.resolve();
    });
}
