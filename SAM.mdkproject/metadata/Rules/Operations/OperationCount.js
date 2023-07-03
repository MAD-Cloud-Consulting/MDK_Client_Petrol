import CommonLibrary from '../Common/Library/CommonLibrary';

export default function WorkOrderOperationsCount(context, queryOption = '') {
    return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderOperations', queryOption);
}
