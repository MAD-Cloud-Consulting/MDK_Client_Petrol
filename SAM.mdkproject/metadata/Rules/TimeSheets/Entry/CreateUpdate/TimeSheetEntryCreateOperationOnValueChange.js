import libCommon from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import {TimeSheetLibrary as libTS} from '../../TimeSheetLibrary';

export default function TimeSheetEntryCreateOperationOnValueChange(control) {

    let clientData = control.getPageProxy().getClientData();
    if (clientData.LOADED && !clientData.subOpPickerIsLocked) {
        let formCellContainer = control.getPageProxy().getControl('FormCellContainer');
        let OperationLstPkrValue = formCellContainer.getControl('OperationLstPkr').getValue();
        let SubOperationLstPkrControl = formCellContainer.getControl('SubOperationLstPkr');
        if (!libVal.evalIsEmpty(OperationLstPkrValue)) {
            return libCommon.getEntitySetCount(control.getPageProxy(),libCommon.getListPickerValue(OperationLstPkrValue) + '/SubOperations', '').then(count => {
                if (count > 0) {
                    SubOperationLstPkrControl.setEditable(true);
                    var SubOperationSpecifier = SubOperationLstPkrControl.getTargetSpecifier();
                    SubOperationSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                    SubOperationSpecifier.setEntitySet(libCommon.getListPickerValue(OperationLstPkrValue) + '/SubOperations');
                    SubOperationSpecifier.setDisplayValue('{{#Property:SubOperationNo}} - {{#Property:OperationShortText}}');
                    SubOperationSpecifier.setReturnValue('{@odata.readLink}');
                    SubOperationSpecifier.setQueryOptions('$orderby=SubOperationNo');
                    return SubOperationLstPkrControl.setTargetSpecifier(SubOperationSpecifier).then(() => {
                        return updateWorkCenter(control);
                    });
                } else {
                    SubOperationLstPkrControl.setEditable(false);
                    return updateWorkCenter(control);
                }
              });
        }
        SubOperationLstPkrControl.setEditable(false);
        return updateWorkCenter(control);
    }
}

function updateWorkCenter(control) {
    let pageProxy = control.getPageProxy();
    let selection = control.getValue()[0] ? control.getValue()[0].ReturnValue : '';
    if (!selection) { //operation has been unchecked hence, get the workorder's workcenter and set the activity type picker accordingly
        let recOrderProxy = libCommon.getControlProxy(pageProxy, 'RecOrderLstPkr');   
        selection = recOrderProxy.getValue()[0].ReturnValue;
    }        
    return libTS.GetWorkCenterFromObject(pageProxy, selection).then(newWorkCenter => {
        return libTS.updateWorkCenter(pageProxy, newWorkCenter);
    });
}
