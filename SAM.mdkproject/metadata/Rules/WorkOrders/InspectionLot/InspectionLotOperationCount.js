import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function InspectionLotOperationCount(context) {
    return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderOperations', "$filter=OrderId eq '" + context.getPageProxy().getBindingObject().OrderId + "' and sap.entityexists(InspectionPoint_Nav)");
}
