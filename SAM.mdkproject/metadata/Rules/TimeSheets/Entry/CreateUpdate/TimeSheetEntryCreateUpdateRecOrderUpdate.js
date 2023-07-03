import libCom from '../../../Common/Library/CommonLibrary';
import {TimeSheetLibrary as libTS} from '../../TimeSheetLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function TimeSheetEntryCreateUpdateRecOrderUpdate(controlProxy) {
    let pageProxy = controlProxy.getPageProxy();
    let selection = controlProxy.getValue()[0] ? controlProxy.getValue()[0].ReturnValue : '';
    let opListPickerProxy = libCom.getControlProxy(pageProxy,'OperationLstPkr');
    let subOpListPickerProxy = libCom.getControlProxy(pageProxy,'SubOperationLstPkr');
    let activityListPickerProxy = libCom.getControlProxy(pageProxy,'ActivityTypeLstPkr');

     /**
     * Returns controlkeys whose confirmation indicator does not equal '3'
     * Operations with a controlkey whose confirmation indicator is 3 cannot be confirmed
     */
      function getConfirmableControlKeys() {
        return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'ControlKeys', ['ControlKey'], "$filter=ConfirmationIndicator ne '3'").then(function(result) {
            return result.map(({ ControlKey }) => ControlKey);
        });
    }

    return Promise.all([getConfirmableControlKeys()]).then((result) => {
        var confirmableControlKeys = result[0]; //Confirmable control keys
        var confirmableControlKeyFilter = "$filter=ControlKey eq '" + Array.from(confirmableControlKeys).join("' or ControlKey eq '") + "'&"; //Filter string built from confirmable control keys

    if (libVal.evalIsEmpty(selection)) { //No order, so disable and empty op and sub-op pickers
        opListPickerProxy.setValue('');
        subOpListPickerProxy.setValue('');
        let entity = 'MyWorkOrderOperations';
        let filter = confirmableControlKeyFilter + '$orderby=OperationNo asc'; //Only show operations that can be confirmed
        return libTS.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => {
            libCom.setFormcellNonEditable(opListPickerProxy);
            libCom.setFormcellNonEditable(subOpListPickerProxy);
            libCom.setFormcellNonEditable(activityListPickerProxy);
            entity = 'MyWorkOrderSubOperations';
            filter = confirmableControlKeyFilter + '$orderby=OperationNo asc'; //Only show suboperations that can be confirmed
            return libTS.setSubOperationSpecifier(subOpListPickerProxy, entity, filter);                        
        });
    } else {
        libCom.setFormcellEditable(opListPickerProxy);
        let entity = selection + '/Operations';
        let filter = confirmableControlKeyFilter + '$orderby=OperationNo asc'; //Only show operations that can be confirmed
        opListPickerProxy.setValue('');
        subOpListPickerProxy.setValue('');
        return libTS.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => { //Populate op picker from chosen order
            return libTS.GetWorkCenterFromObject(pageProxy, selection).then(newWorkCenter => {
                if (newWorkCenter) {
                    return libTS.updateWorkCenter(controlProxy.getPageProxy(), newWorkCenter).then(() => {
                        libCom.setFormcellNonEditable(subOpListPickerProxy);
                        entity = 'MyWorkOrderSubOperations';
                        filter = "$filter=ControlKey ne 'PM07'&SubOperationNo eq ''";    
                        return libTS.setSubOperationSpecifier(subOpListPickerProxy, entity, filter);
                    });
                }
                return Promise.resolve(true);
            });
        });
    }
});
}
