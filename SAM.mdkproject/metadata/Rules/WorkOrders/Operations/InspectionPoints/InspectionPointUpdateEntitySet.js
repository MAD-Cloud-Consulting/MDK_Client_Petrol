export default function InspectionPointUpdateEntitySet(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
        return context.binding['@odata.readLink'];
    } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return context.binding.InspectionPoint_Nav['@odata.readLink'];
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return context.binding.InspectionPoint_Nav[0]['@odata.readLink'];
    } 
    return `InspectionLots('${context.binding.InspectionLot}')` + '/InspectionPoints_Nav';

}
