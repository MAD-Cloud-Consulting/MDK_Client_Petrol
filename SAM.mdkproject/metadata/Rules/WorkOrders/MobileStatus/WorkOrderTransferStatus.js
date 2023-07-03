import libWOMobile from './WorkOrderMobileStatusLibrary';
export default function WorkOrderTransferStatus(context) {
    context.showActivityIndicator('');
    return libWOMobile.transferWorkOrder(context);
}
