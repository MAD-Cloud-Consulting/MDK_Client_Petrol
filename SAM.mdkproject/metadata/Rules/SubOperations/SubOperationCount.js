import CommonLibrary from '../Common/Library/CommonLibrary';

export default function WorkOrderSubOperationsCount(context) {
    return CommonLibrary.getEntitySetCount(context,'MyWorkOrderSubOperations','');
}
