import libCom from '../../Common/Library/CommonLibrary';
import actPickerQueryOptions from './ActivityPickerQueryOptions';
import variancePickerQueryOptions from './VariancePickerQueryOptions';
import SubOperationQueryOptions from './SubOperationPickerQueryOptions';

export default function OnOperationChangeListPickerUpdate(pageProxy) {
    let operation = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:OperationPkr/#Value'));
    let workorder = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:WorkOrderLstPkr/#Value'));
    let enable = false;

    if (operation) {
        enable = true;
    }
    return Promise.all([SubOperationQueryOptions(pageProxy, workorder, operation), actPickerQueryOptions(pageProxy), variancePickerQueryOptions(pageProxy)]).then(function(results) {
        return pageProxy.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderSubOperations', results[0]).then(count => { //Check for existence of sub-operations
            let clearSubOperationValue = count > 0;
            if (operation && operation === pageProxy.binding.Operation) {
                clearSubOperationValue = false;
            }

            return redrawListControl(pageProxy, 'SubOperationPkr', results[0], count > 0 && pageProxy.binding.IsOnCreate, clearSubOperationValue).then(() => {
                return redrawListControl(pageProxy, 'ActivityTypePkr', results[1], enable).then(() => {
                    if (pageProxy.getClientData().DefaultActivityType) {  //Default the activity type to the operation's activity type
                        if (!libCom.getListPickerValue(libCom.getControlProxy(pageProxy,'ActivityTypePkr').getValue())) {
                            let control = libCom.getControlProxy(pageProxy, 'ActivityTypePkr');
                            control.setValue(pageProxy.getClientData().DefaultActivityType);
                        }
                    }
                    return redrawListControl(pageProxy, 'VarianceReasonPkr', results[2], enable).then(() => {
                        return true;
                    });
                });
            });
        });
    });
}

/**
 * Redraw a page control
 * @param {*} pageProxy 
 * @param {*} controlName 
 * @param {*} queryOptions 
 * @param {*} isEditable 
 * @param {*} isClearValue 
 */
 function redrawListControl(pageProxy, controlName, queryOptions, isEditable=true, isClearValue=false) {
    let control = libCom.getControlProxy(pageProxy,controlName);
    let specifier = control.getTargetSpecifier();

    specifier.setQueryOptions(queryOptions);
    specifier.setService('/SAPAssetManager/Services/AssetManager.service');

    control.setEditable(isEditable);
    return control.setTargetSpecifier(specifier).then(() => {
        if (isClearValue) {
            control.setValue('');
        }
        return true;
    });
}

export { redrawListControl };
