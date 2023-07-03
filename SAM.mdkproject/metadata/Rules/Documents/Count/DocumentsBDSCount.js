import DocLib from '../DocumentLibrary';

export default function DocumentsBDSCount(controlProxy) {
    let value = 0;
    let id = '';
    let operation_num = '';
    switch (DocLib.lookupParentObjectType(controlProxy, controlProxy.getPageProxy().binding['@odata.type'])) {
        case DocLib.ParentObjectType.WorkOrder:
            id = controlProxy.getPageProxy().binding.OrderId;
            value = DocLib.getDocumentCount(controlProxy, 'MyWorkOrderDocuments', "$expand=Document&$filter=OrderId eq '" + id + "' and (OperationNo eq null or OperationNo eq '') and Document/FileName ne null");
            break;
        case DocLib.ParentObjectType.Notification:
            id = controlProxy.getPageProxy().binding.NotificationNumber;
            value = DocLib.getDocumentCount(controlProxy, 'MyNotifDocuments', "$expand=Document&$filter=NotificationNumber eq '" + id + "' and Document/FileName ne null");
            break;
        case DocLib.ParentObjectType.Equipment:
            id = controlProxy.getPageProxy().binding.EquipId;
            value = DocLib.getDocumentCount(controlProxy, 'MyEquipDocuments', "$expand=Document&$filter=EquipId eq '" + id + "' and Document/FileName ne null");
            break;
        case DocLib.ParentObjectType.FunctionalLocation:
            id = controlProxy.getPageProxy().binding.FuncLocIdIntern;
            value = DocLib.getDocumentCount(controlProxy, 'MyFuncLocDocuments', "&$expand=Document&$filter=FuncLocIdIntern eq '" + id + "' and Document/FileName ne null");
            break;
        case DocLib.ParentObjectType.Operation:
            id = controlProxy.getPageProxy().binding.OrderId;
            operation_num = controlProxy.getPageProxy().binding.OperationNo;
            value = DocLib.getDocumentCount(controlProxy, 'MyWorkOrderDocuments', "$expand=Document&$filter=OrderId eq '" + id + "' and OperationNo eq '" + operation_num + "' and Document/FileName ne null");
            break;
        default:
            break;
    }
    return value;
}
