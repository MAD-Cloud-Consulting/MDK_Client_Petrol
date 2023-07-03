import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Creates the navigation relationships for a new MaterialDocumentItem for inventory
 * @param {*} context
 */
 export default function MaterialDocumentItemCreateLinks(context) {

    var links = [];
    let parent = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');

    if (parent === 'PO') {        
        //Purchase order header
        links.push({
            'Property': 'PurchaseOrder_Nav',
            'Target':
            {
                'EntitySet': 'PurchaseOrderHeaders',
                'ReadLink': "PurchaseOrderHeaders('" + context.binding.TempLine_PurchaseOrderNumber + "')",
            },
        });
        //Purchase order item
        links.push({
            'Property': 'PurchaseOrderItem_Nav',
            'Target':
            {
                'EntitySet': 'PurchaseOrderItems',
                'ReadLink': "PurchaseOrderItems(ItemNum='" + context.binding.TempLine_PurchaseOrderItem + "',PurchaseOrderId='" + context.binding.TempLine_PurchaseOrderNumber + "')",
            },
        });
    } else if (parent === 'STO') {
            //STO header
            links.push({
                'Property': 'STO_Nav',
                'Target':
                {
                    'EntitySet': 'StockTransportOrderHeaders',
                    'ReadLink': "StockTransportOrderHeaders('" + context.binding.TempLine_PurchaseOrderNumber + "')",
                },
            });
    
            //STO item
            links.push({
                'Property': 'StockTransportOrderItem_Nav',
                'Target':
                {
                    'EntitySet': 'StockTransportOrderItems',
                    'ReadLink': "StockTransportOrderItems(ItemNum='" + context.binding.TempLine_PurchaseOrderItem + "',StockTransportOrderId='" + context.binding.TempLine_PurchaseOrderNumber + "')",
                },
            });
    } else if (parent === 'PRD' && move === 'R') {         
        //Production Order Item
        links.push({
            'Property': 'ProductionOrderItem_Nav',
            'Target':
            {
                'EntitySet': 'ProductionOrderItems',
                'ReadLink': "ProductionOrderItems(OrderId='" + context.binding.TempLine_PRDOrderNumber + "',ItemNum='" + context.binding.TempLine_PRDOrderItem + "')",
            },
        });
    } else if (parent === 'PRD' && move === 'I') {         
        //Production Order Component
        links.push({
            'Property': 'ProductionOrderComponent_Nav',
            'Target':
            {
                'EntitySet': 'ProductionOrderComponents',
                'ReadLink': "ProductionOrderComponents(Reservation='" + context.binding.TempLine_ReservationNumber + "',RecordType='" + context.binding.TempLine_RecordType + "',ItemNum='" + context.binding.TempLine_ReservationItem + "',OrderId='" + context.binding.TempLine_Order + "')",
            },
        });
    } else if (parent === 'RES') {         
        //Reservation header
        links.push({
            'Property': 'Reservation_Nav',
            'Target':
            {
                'EntitySet': 'ReservationHeaders',
                'ReadLink': "ReservationHeaders('" + context.binding.TempLine_ReservationNumber + "')",
            },
        });
        
        //Reservation item
        links.push({
            'Property': 'ReservationItem_Nav',
            'Target':
            {
                'EntitySet': 'ReservationItems',
                'ReadLink': "ReservationItems(ItemNum='" + context.binding.TempLine_ReservationItem + "',ReservationNum='" + context.binding.TempLine_ReservationNumber + "',RecordType='" + context.binding.TempLine_RecordType + "')",
            },
        });
    }

    //Material document
    let matDocLink = 'pending_1'; //Changeset, mat doc was just created
    if (!libVal.evalIsEmpty(context.binding) && !libVal.evalIsEmpty(context.binding.TempHeader_MatDocReadLink)) { //We are not in a changeset, mat doc is being updated
        matDocLink = context.binding.TempHeader_MatDocReadLink;
    } else if (!libVal.evalIsEmpty(context.getActionBinding()) && !libVal.evalIsEmpty(context.getActionBinding().TempHeader_MatDocReadLink)) { //We are not in a changeset, mat doc is being updated
        matDocLink = context.getActionBinding().TempHeader_MatDocReadLink;
    }
    links.push({
        'Property': 'AssociatedMaterialDoc',
        'Target':
        {
            'EntitySet': 'MaterialDocuments',
            'ReadLink': matDocLink,
        },
    });

    return links;
}
