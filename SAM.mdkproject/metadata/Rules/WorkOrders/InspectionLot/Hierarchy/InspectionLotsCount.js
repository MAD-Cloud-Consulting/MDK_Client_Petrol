import libCom from '../../../Common/Library/CommonLibrary';

export default function InspectionLotsCount(context) {
    return libCom.getEntitySetCount(context, 'InspectionLots', "$filter=OrderId eq '" + context.binding.OrderId + "'");
}
