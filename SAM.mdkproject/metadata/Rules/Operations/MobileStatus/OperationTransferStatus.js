import libOprMobile from './OperationMobileStatusLibrary';

export default function OperationTransferStatus(context) {
    context.showActivityIndicator('');
    return libOprMobile.transferOperation(context);
}
