import ConfirmationSubOperation from './ConfirmationSubOperation';

export default function ConfirmationSubOperationDetails(context) {
    let subOperation = ConfirmationSubOperation(context);
    if (subOperation === undefined) {
        return '-';
    }
    return subOperation.SubOperationNo + (subOperation.OperationShortText.length > 0 ? ' - ' + subOperation.OperationShortText : '');
}
