import libCom from '../../../Common/Library/CommonLibrary';

export default function InspectionPointsCount(context) {
    return libCom.getEntitySetCount(context, 'InspectionPoints', "$filter=OrderId eq '" + context.binding.OrderId + "' and OperationNo eq '" + context.binding.OperationNo + "'");
}
