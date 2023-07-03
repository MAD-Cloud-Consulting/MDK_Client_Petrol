import DocLib from '../Documents/DocumentLibrary';

export default function OperationWorkOrderId(controlProxy) {
    let value = controlProxy.binding['@odata.readLink'];
    switch (DocLib.getParentObjectType(controlProxy)) {
        case DocLib.ParentObjectType.WorkOrder:
            return '0';
        case DocLib.ParentObjectType.Notification:
            return '0';
        case DocLib.ParentObjectType.Equipment:
            return '0';
        case DocLib.ParentObjectType.FunctionalLocation:
            return '0';
        case DocLib.ParentObjectType.Operation:
            value += ':OrderId';
            return '<' + value + '>';
        default:
            return '0';
    }
}
