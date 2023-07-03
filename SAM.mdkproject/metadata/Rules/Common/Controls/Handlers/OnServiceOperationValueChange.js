import CommonLibrary from '../../Library/CommonLibrary';

export default function OnServiceOperationValueChange(control) {
    let pageProxy = control.getPageProxy();
    let isMileage = pageProxy.getControl('FormCellContainer').getControl('OrderLstPkr');
    let workCenterPicker = CommonLibrary.getControlProxy(pageProxy,'WorkCenterPicker');

    let operationNo = control.getValue()[0] ? control.getValue()[0].ReturnValue : '';
    if (pageProxy.getClientData().currentObject) {
        pageProxy.getClientData().currentObject.Operation = operationNo;
    }

    if (operationNo) {
        let defaultWorkCenter = isMileage ?
            CommonLibrary.getMileageWorkCenter(pageProxy) : CommonLibrary.getExpenseWorkCenter(pageProxy);
        if (defaultWorkCenter) {
            workCenterPicker.setEditable(true);
            workCenterPicker.setValue(defaultWorkCenter);
            return Promise.resolve();
        }
        
        let orderControlName = isMileage ? 'OrderLstPkr' : 'WorkOrderLstPkr';
        let orderId = CommonLibrary.getListPickerValue(CommonLibrary.getControlProxy(pageProxy,orderControlName).getValue());
        let queryOptions = `$filter=OrderId eq '${orderId}' and OperationNo eq '${operationNo}'`;

        if (queryOptions) {
            return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', ['MainWorkCenter'], queryOptions).then(results => {
                if (results.length > 0) {
                    let operationRecord = results.getItem(0);
                    let mainWorkCenter = operationRecord.MainWorkCenter;
    
                    if (mainWorkCenter) {
                        workCenterPicker.setEditable(true);
                        workCenterPicker.setValue(mainWorkCenter);
                    }
                }
            });
        }
    } else {
        workCenterPicker.setEditable(false);
        workCenterPicker.setValue('');
    }
}
