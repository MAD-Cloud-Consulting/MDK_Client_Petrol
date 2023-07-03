import libCom from '../../Common/Library/CommonLibrary';

export default function UpdateHeaderCountItems(context, type, docInfo) {
    let binding = context.binding;
    if (docInfo) {
        binding = docInfo;
    }
    if (!binding) {
        return Promise.resolve();
    }
    let entitySet;
    let readLink;
    let readLinkItems;

    if (!type) {
        type = libCom.getStateVariable(context, 'IMObjectType');
    }
    switch (type) {
        case 'PO':
            entitySet = 'PurchaseOrderHeaders';
            if (binding.PurchaseOrderHeader_Nav) {
                readLink = binding.PurchaseOrderHeader_Nav['@odata.readLink'];
            } else {
                readLink = binding['@odata.readLink'];
            }
            readLinkItems = readLink + '/PurchaseOrderItem_Nav';
            break;
        case 'STO':
            entitySet = 'StockTransportOrderHeaders';
            if (binding.StockTransportOrderHeader_Nav) {
                readLink = binding.StockTransportOrderHeader_Nav['@odata.readLink'];
            } else {
                readLink = binding['@odata.readLink'];
            }
            readLinkItems = readLink + '/StockTransportOrderItem_Nav';
            break;
        case 'RES':
            entitySet = 'ReservationHeaders';
            if (binding.ReservationHeader_Nav) {
                readLink = binding.ReservationHeader_Nav['@odata.readLink'];
            } else {
                readLink = binding['@odata.readLink'];
            }
            readLinkItems = readLink + '/ReservationItem_Nav';
            break;
        default:
            return Promise.resolve();
    }
    
    //Loop over all line items to determine header status
    return context.read('/SAPAssetManager/Services/AssetManager.service', readLinkItems, [], '').then(itemResults => {
        if (itemResults && itemResults.length > 0) {
            let picked = false; //At least one item has been picked
            let fullyPicked = 0; //Number of fully picked items
            let status = ''; //Header status

            for (var index = 0; index < itemResults.length; index++) {
                let item = itemResults.getItem(index);
                let completed;
                let required = 0;
                switch (type) {
                    case 'PO':
                        completed = item.ReceivedQuantity;
                        required = item.OrderQuantity;
                        break;
                    case 'STO':
                        completed = item.IssuedQuantity;
                        required = item.OrderQuantity;
                        break;
                    case 'RES':
                        completed = item.WithdrawalQuantity;
                        required = item.RequirementQuantity;
                        break;
                    default:
                }
                if (Number(required) > 0) {
                    if (Number(completed) > 0) {
                        picked = true;
                        if (Number(completed) === Number(required)) {
                            fullyPicked++;
                        }
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
                    'EntitySet': entitySet,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': readLink,
                },
                'Properties': {
                    'DocumentStatus': status,
                },
                'Headers': {
                    'Transaction.Ignore': 'true',
                },
            }}).then(() => {
                return Promise.resolve(status);
            });
        }
        return Promise.resolve();
    });
}
