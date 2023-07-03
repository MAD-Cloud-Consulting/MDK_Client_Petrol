import MileageAddEditOperationQueryOptionsQueryBuilder from './MileageAddEditOperationQueryOptionsQueryBuilder';

export default function MileageAddEditServiceOrderOnValueChange(listPickerProxy) {
    
    let orderId = listPickerProxy.getValue()[0] ? listPickerProxy.getValue()[0].ReturnValue : ''; 

    let pageProxy = listPickerProxy.getPageProxy();
    let formCellContainer = pageProxy.getControl('FormCellContainer');

    let operationPicker = formCellContainer.getControl('OperationPkr');
    let operationPickerSpecifier = operationPicker.getTargetSpecifier();

    if (orderId) { //an order was selected so update the operation picker accordingly
        operationPicker.setEditable(true);
        operationPicker.setValue('');
        return MileageAddEditOperationQueryOptionsQueryBuilder(listPickerProxy, orderId).then(queryOptions => {
            operationPickerSpecifier.setQueryOptions(queryOptions);
            return operationPicker.setTargetSpecifier(operationPickerSpecifier);
        });
        
    } else { //an order was unselected
        operationPicker.setEditable(false);
        operationPickerSpecifier.setQueryOptions('');
        operationPicker.setValue('');
        return operationPicker.setTargetSpecifier(operationPickerSpecifier);
    }
}
