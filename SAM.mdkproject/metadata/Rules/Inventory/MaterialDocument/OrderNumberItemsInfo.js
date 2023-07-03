import libCommon from '../../Common/Library/CommonLibrary';

export default function OrderNumberItemsInfo(context) {
    let move = libCommon.getStateVariable(context, 'IMMovementType');
    let order = libCommon.getStateVariable(context, 'CurrentDocsItemsOrderNumber');
    if (order && move === 'I') {
        return order;
    }
    return '';
}
