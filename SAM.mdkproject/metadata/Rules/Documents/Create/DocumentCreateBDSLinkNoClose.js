import CommonLib from '../../Common/Library/CommonLibrary';
import DocLib from '../DocumentLibrary';

export default function DocumentCreateBDSLinkNoClose(controlProxy) {
    const serviceName = '/SAPAssetManager/Services/AssetManager.service';
    const binding = CommonLib.getPageName(controlProxy) === 'PDFControl' ? CommonLib.getStateVariable(controlProxy, 'ServiceReportData') : controlProxy.binding;
    const parentReadLink = binding['@odata.readLink'];
    let promises = [];
    let entitySet = '';
    let parentEntitySet = '';
    let parentProperty = '';

    let objectKey = '';
    switch (DocLib.getParentObjectType(controlProxy)) {
        case DocLib.ParentObjectType.WorkOrder:
            entitySet = 'MyWorkOrderDocuments';
            parentEntitySet = 'MyWorkOrderHeaders';
            parentProperty = 'WOHeader';
            objectKey = binding.OrderId;
            break;
        case DocLib.ParentObjectType.Notification:
            entitySet = 'MyNotifDocuments';
            parentEntitySet = 'MyNotificationHeaders';
            parentProperty = 'NotifHeader';
            objectKey = binding.NotificationNumber;
            break;
        case DocLib.ParentObjectType.Equipment:
            entitySet = 'MyEquipDocuments';
            parentEntitySet = 'MyEquipments';
            parentProperty = 'Equipment';
            objectKey = binding.EquipId;
            break;
        case DocLib.ParentObjectType.FunctionalLocation:
            entitySet = 'MyFuncLocDocuments';
            parentEntitySet = 'MyFunctionalLocations';
            parentProperty = 'FunctionalLocation';
            objectKey = binding.FuncLocIdIntern;
            break;
        case DocLib.ParentObjectType.Operation:
        case DocLib.ParentObjectType.SubOperation:
            entitySet = 'MyWorkOrderDocuments';
            parentEntitySet = 'MyWorkOrderOperations';
            parentProperty = 'WOOperation_Nav';
            if (binding.OperationNo[0] === 'L') {
                objectKey = binding.OperationNo;
            } else {
                objectKey = binding.ObjectKey;
            }
            break;
        default: 
            break;
    }

    const properties = {ObjectKey: objectKey};

    const readLinks = controlProxy.getClientData().mediaReadLinks;
    if (readLinks && parentReadLink) {
        for (let readLink of readLinks) {
            let links = [];
            let link = controlProxy.createLinkSpecifierProxy(parentProperty, parentEntitySet, '', parentReadLink);
            links.push(link);
            link = controlProxy.createLinkSpecifierProxy('Document', 'Documents', '', readLink);
            links.push(link);
            promises.push(controlProxy.create(serviceName, entitySet, properties, links, {'OfflineOData.RemoveAfterUpload':'true'}));
        }
    }

    return Promise.all(promises).then(() => true)
   .catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
}
