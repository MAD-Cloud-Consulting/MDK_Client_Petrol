import libSubOprMobile from './SubOperationMobileStatusLibrary';

export default function SubOperationTransferStatus(context) {
    context.showActivityIndicator('');
    return libSubOprMobile.transferSubOperation(context);
}
