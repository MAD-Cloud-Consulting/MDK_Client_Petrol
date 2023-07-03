export default function PriorityQueryOptions(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return "$filter=PriorityType eq 'PM'&$orderby=Priority";
    }
    return "$filter=PriorityType eq '{{#Property:PriorityType}}'&$orderby=Priority";
}
