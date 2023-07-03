import DocLib from './DocumentLibrary';
import Logger from '../Log/Logger';


export default function DocumentsBDSListEntitySet(controlProxy) {
    let value = '';
    Logger.debug(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), controlProxy.getPageProxy().getBindingObject());
    Logger.debug(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'type: ' + controlProxy.getPageProxy().getBindingObject()['@odata.type']);
    switch (DocLib.lookupParentObjectType(controlProxy, controlProxy.getPageProxy().getBindingObject()['@odata.type'])) {
        case DocLib.ParentObjectType.WorkOrder:
            value = controlProxy.binding['@odata.readLink'] + '/WODocuments';
            break;
        case DocLib.ParentObjectType.Notification:
            value = controlProxy.binding['@odata.readLink'] + '/NotifDocuments';
            break;
        case DocLib.ParentObjectType.Equipment:
            value = controlProxy.binding['@odata.readLink'] + '/EquipDocuments';
            break;
        case DocLib.ParentObjectType.FunctionalLocation:
            value = controlProxy.binding['@odata.readLink'] + '/FuncLocDocuments';
            break;
        case DocLib.ParentObjectType.Operation:
            value = controlProxy.binding['@odata.readLink'] + '/WOOprDocuments_Nav';
            break;
        default:
            break;
    }
    /**Implementing our Logger class*/
    Logger.debug(controlProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'EntitySet: ' + value);

    return value;
}
