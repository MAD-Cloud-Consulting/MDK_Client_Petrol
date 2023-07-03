import ConfirmationOperation from './ConfirmationOperation';

export default function ConfirmationOperationDetails(context) {

    let operation = ConfirmationOperation(context);
    if (operation === undefined) {
        return '-';
    }

    return operation.OperationNo + (operation.OperationShortText.length > 0 ? ' - ' + operation.OperationShortText : '');

}
