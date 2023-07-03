import CommonLib from '../../Common/Library/CommonLibrary';
import DocLib from '../DocumentLibrary';
export default function DocumentCreateObjectKeyForHeader(controlProxy) {
    const binding = CommonLib.getPageName(controlProxy) === 'PDFControl' ? CommonLib.getStateVariable(controlProxy, 'ServiceReportData') : controlProxy.binding;
    let value = binding['@odata.readLink'];
    switch (DocLib.getParentObjectType(controlProxy)) {
        case DocLib.ParentObjectType.WorkOrder:
            value += ':OrderId';
            break;
        case DocLib.ParentObjectType.Notification:
            value += ':NotificationNumber';
            break;
        case DocLib.ParentObjectType.Equipment:
            value += ':EquipId';
            break;
        case DocLib.ParentObjectType.FunctionalLocation:
            value += ':FuncLocIdIntern';
            break;
        case DocLib.ParentObjectType.Operation:
            if (controlProxy.binding.OperationNo && controlProxy.binding.OperationNo[0] === 'L') {
                value += ':OperationNo';
                break;
            } else {
                return controlProxy.binding.ObjectKey;
            }
        default:
            break;
    }
    return '<' + value + '>';
}
