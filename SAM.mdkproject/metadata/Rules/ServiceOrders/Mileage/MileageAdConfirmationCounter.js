import GenerateLocalID from '../../Common/GenerateLocalID';
import MileageAddEditOperationNo from './MileageAddEditOperationNo';
import MileageAddEditOrderId from './MileageAddEditOrderId';


export default function MileageAdConfirmationCounter(pageProxy) {
    let orderId = MileageAddEditOrderId(pageProxy);
    let operationNo = MileageAddEditOperationNo(pageProxy);

    if (orderId && operationNo) {
        let queryOptions = `$filter=OrderID eq '${orderId}' and Operation eq '${operationNo}'`;
    
        return GenerateLocalID(pageProxy, 'Confirmations', 'ConfirmationCounter', '00000000', queryOptions, '', 'ConfirmationCounter').then(confirmationCounter => {
            return confirmationCounter ? confirmationCounter : '';
        });

    } else {
        return '';
    }
}
