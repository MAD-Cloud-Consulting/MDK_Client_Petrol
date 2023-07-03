import libDocument from './DocumentLibrary';

export default function DocumentFilter(context) {
    let id = '';
    let operation_num = '';
    switch (libDocument.lookupParentObjectType(context, context.getPageProxy().binding['@odata.type'])) {
        case libDocument.ParentObjectType.WorkOrder:
            id = context.getPageProxy().binding.OrderId;
            return "OrderId eq '" + id + "' and (OperationNo eq null or OperationNo eq '') and Document/FileName ne null";
        case libDocument.ParentObjectType.Notification:
            id = context.getPageProxy().binding.NotificationNumber;
            return "NotificationNumber eq '" + id + "' and Document/FileName ne null";
        case libDocument.ParentObjectType.Equipment:
            id = context.getPageProxy().binding.EquipId;
            return "EquipId eq '" + id + "' and Document/FileName ne null";
        case libDocument.ParentObjectType.FunctionalLocation:
            id = context.getPageProxy().binding.FuncLocIdIntern;
            return "FuncLocIdIntern eq '" + id + "' and Document/FileName ne null";
        case libDocument.ParentObjectType.Operation:
            id = context.getPageProxy().binding.OrderId;
            operation_num = context.getPageProxy().binding.OperationNo;
            return "OrderId eq '" + id + "' and OperationNo eq '" + operation_num + "' and Document/FileName ne null";
        default:
            return 'Document/FileName ne null';
    }
}
