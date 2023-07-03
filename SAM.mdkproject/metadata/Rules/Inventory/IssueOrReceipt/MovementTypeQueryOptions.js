import libCom from '../../Common/Library/CommonLibrary';

export default function MovementTypeQueryOptions(context) {
    let type;

    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    }
    let movementTypeVar = libCom.getStateVariable(context, 'CurrentDocsItemsMovementType');
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    //Find the POItem record we are working with
    if (type === 'MaterialDocItem') {
        if (movementType === 'REV') {
            return "$filter=MovementType eq '" + (Number(context.binding.MovementType) + 1) + "'&$orderby=MovementType";
        } else if (movementType === 'RET') {
            return "$orderby=MovementType&$filter=(MovementType eq '122' or MovementType eq '102')";
        }
        return "$filter=MovementType eq '" + context.binding.MovementType + "'&$orderby=MovementType";
    } else if (type === 'PurchaseOrderItem' || type === 'ProductionOrderItem') { //Receipt
        return "$filter=MovementType eq '101'"; 
    } else if (type === 'ReservationItem' || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem' || type === 'ProductionOrderComponent') { //Issue, pull from the item itself
        return "$filter=MovementType eq '" + context.binding.MovementType + "'";
    } else if (type === 'StockTransportOrderItem') {
        if (movementType === 'I') {
            return "$filter=MovementType eq '351'"; //Issue
        }
        return "$filter=MovementType eq '101'"; //Receipt
    }
    if (movementTypeVar) {
        return "$filter=MovementType eq '" + movementTypeVar + "'&$orderby=MovementType";
    }
    if (movementType === 'I') {
        if (objectType === 'TRF') {
            return "$orderby=MovementType,MovementTypeDesc&$filter=(MovementType eq '301' or MovementType eq '311')";
        }
        return "$orderby=MovementType,MovementTypeDesc&$filter=(MovementType eq '201' or MovementType eq '221' or MovementType eq '261' or MovementType eq '281' or MovementType eq '551')";
    } else if (movementType === 'R') {
        return "$orderby=MovementType,MovementTypeDesc&$filter=(MovementType eq '501')";
    } else if (movementType === 'T') {
        return "$orderby=MovementType,MovementTypeDesc&$filter=(MovementType eq '301' or MovementType eq '311')";
    }

    return "$orderby=MovementType,MovementTypeDesc&$filter=SpecialStockInd eq '' and ReceiptInd eq '' and Consumption eq ''";
}
