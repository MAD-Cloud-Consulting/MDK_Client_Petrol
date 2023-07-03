import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueOrReceiptCreateUpdateNavWrapper';
import receipt from '../StockTransportOrder/SetSTOGoodsReceipt';
import issue from '../StockTransportOrder/SetSTOIssue';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';

export default function SetPurchaseOrderGoodsReceipt(context) {
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'StockTransportOrderItem' || type === 'StockTransportOrderHeader') {
        if (allowIssue(context)) {
            return issue(context); //Supplying plant matches user's default plant, so do an issue
        }
        return receipt(context);
    } else if (type === 'PurchaseOrderItem' || type === 'PurchaseOrderHeader') {
        libCom.setStateVariable(context, 'IMObjectType', 'PO'); //PO/STO/RES/IN/OUT/ADHOC/PRD
        libCom.setStateVariable(context, 'IMMovementType', 'R'); //I/R
        return wrapper(context);    
    } else if (type === 'ReservationItem' || type === 'ReservationHeader') {
        libCom.setStateVariable(context, 'IMObjectType', 'RES');
        libCom.setStateVariable(context, 'IMMovementType', 'I');
        return wrapper(context);
    } else if (type === 'ProductionOrderHeader') {
        if (context.currentPage.id === 'ProductionOrderComponentsListPage') {
            libCom.setStateVariable(context, 'IMObjectType', 'PRD');
            libCom.setStateVariable(context, 'IMMovementType', 'I');
            return wrapper(context);
        } else if (context.currentPage.id === 'PurchaseOrderItemsListPage') {
            libCom.setStateVariable(context, 'IMObjectType', 'PRD');
            libCom.setStateVariable(context, 'IMMovementType', 'R');
            return wrapper(context);
        }
    }
}
