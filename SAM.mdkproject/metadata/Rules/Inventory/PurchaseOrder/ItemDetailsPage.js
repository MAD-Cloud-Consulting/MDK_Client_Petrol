import libCom from '../../Common/Library/CommonLibrary';

export default function ItemDetailsPage(context) {
    const headerType = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const headers = ['ReservationHeader', 'PurchaseOrderHeader', 'StockTransportOrderHeader', 'ProductionOrderHeader'];
    const binding = context.getPageProxy().getActionBinding();
    const type = binding['@odata.type'].substring('#sap_mobile.'.length);

    let entitySet = '';
    let query = '';

    if (headerType === 'MaterialDocument') {
        libCom.setStateVariable(context, 'BlockIMNavToMDocHeader', true);
    } else {
        libCom.setStateVariable(context, 'BlockIMNavToMDocHeader', false);
    }

    if (headers.includes(headerType) && type === 'MaterialDocItem') {
        libCom.setStateVariable(context, 'ClosePageCount', 2);
    } else {
        libCom.setStateVariable(context, 'ClosePageCount', 3);
    }

     if (type === 'PurchaseOrderItem') {
        entitySet = 'PurchaseOrderItems';
        query = `$filter=PurchaseOrderId eq '${binding.PurchaseOrderId}'&$expand=ScheduleLine_Nav,MaterialPlant_Nav,POSerialNumber_Nav,PurchaseOrderHeader_Nav,MaterialDocItem_Nav/SerialNum&$orderby=ItemNum`;
    } else if (type === 'StockTransportOrderItem') {
        entitySet = 'StockTransportOrderItems';
        query = `$filter=StockTransportOrderId eq '${binding.StockTransportOrderId}'&$expand=MaterialPlant_Nav,StockTransportOrderHeader_Nav,STOScheduleLine_Nav,STOSerialNumber_Nav,MaterialDocItem_Nav/SerialNum&$orderby=ItemNum`;
    } else if (type === 'ReservationItem') {
        entitySet = 'ReservationItems';
        query = `$expand=ReservationHeader_Nav,MaterialPlant_Nav,MaterialDocItem_Nav/SerialNum&$filter=ReservationNum eq '${binding.ReservationNum}'&$orderby=ItemNum`;
    } else if (type === 'ProductionOrderItem') {
        entitySet = 'ProductionOrderItems';
        query = `$expand=Material_Nav,MaterialDocItem_Nav&$filter=OrderId eq '${binding.OrderId}'&$orderby=OrderId`;
    } else if (type === 'ProductionOrderComponent') {
        entitySet = 'ProductionOrderComponents';
        query = `$expand=MaterialDocItem_Nav&$filter=OrderId eq '${binding.OrderId}'&$orderby=OrderId`;
    } else if (type === 'InboundDeliveryItem') {
        entitySet = 'InboundDeliveryItems';
        query = `$filter=DeliveryNum eq '${binding.DeliveryNum}'&$expand=InboundDeliverySerial_Nav,MaterialPlant_Nav,InboundDelivery_Nav&$orderby=Item`;
    } else if (type === 'OutboundDeliveryItem') {
        entitySet = 'OutboundDeliveryItems';
        query = `$filter=DeliveryNum eq '${binding.DeliveryNum}'&$expand=OutboundDeliverySerial_Nav,MaterialPlant_Nav,OutboundDelivery_Nav&$orderby=Item`;
    } else if (type === 'MaterialDocItem') {
        entitySet = 'MaterialDocItems';
        query = `$filter=MaterialDocNumber eq '${binding.MaterialDocNumber}'&$expand=SerialNum&$orderby=MatDocItem`;
    } else if (type === 'PhysicalInventoryDocItem') {
        entitySet = 'PhysicalInventoryDocItems';
        const select = '*,MaterialSLoc_Nav/StorageBin,MaterialPlant_Nav/SerialNumberProfile,Material_Nav/Description';
        const expand = 'MaterialPlant_Nav,MaterialSLoc_Nav,Material_Nav,PhysicalInventoryDocItemSerial_Nav';
        const orderBy = 'Item';
        let baseQuery = "(PhysInvDoc eq '" + binding.PhysInvDoc + "' and FiscalYear eq '" + binding.FiscalYear;
        if (binding.ItemCounted || binding.ZeroCount) {
            baseQuery += "' and (EntryQuantity gt 0 or ZeroCount eq 'X'))";
        } else {
            baseQuery += "' and EntryQuantity eq 0 and ZeroCount ne 'X')";
        }

        query = '$select=' + select + '&$filter=' + baseQuery + '&$expand=' + expand + '&$orderby=' + orderBy;
    }

    libCom.setStateVariable(context, 'ItemsQuery', {entitySet, query});

    return context.executeAction('/SAPAssetManager/Actions/Inventory/Item/ItemDetails.action');
}
