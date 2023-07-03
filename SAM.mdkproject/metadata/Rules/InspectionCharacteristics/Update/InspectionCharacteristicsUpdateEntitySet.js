export default function InspectionCharacteristicsUpdateEntitySet(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionLot') {
        return context.binding['@odata.readLink'] + '/InspectionChars_Nav';
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return 'InspectionCharacteristics';
    } else if (context.binding['@odata.type'] === '#sap_mobile.EAMChecklistLink') {
        return context.binding['@odata.readLink'] + '/InspectionChar_Nav';
    } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
        return context.binding['@odata.readLink'] + '/InspectionChar_Nav';
    } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return context.binding['@odata.readLink'];
    }
    return '';
}
