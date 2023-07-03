import common from '../../Common/Library/CommonLibrary';

export default function GetShippingPointDesc(clientAPI) {
    var outboundDeliveryDoc = clientAPI.binding;
    if (common.isDefined(outboundDeliveryDoc.ShippingPoint)) {
        return common.getPlantName(clientAPI, outboundDeliveryDoc.ShippingPoint);
    }
    return '';
}
