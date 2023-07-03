import libCom from '../../../Common/Library/CommonLibrary';

export default function OperationsCount(context) {
    return libCom.getEntitySetCount(context, 'MyWorkOrderOperations', "$filter=OrderId eq '" + context.binding.OrderId + "' and sap.entityexists(InspectionPoint_Nav)");
}
