

export default function EquipmentOrFLOCTransactionID(context) {

    if (context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        return context.binding.EquipId;
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return context.binding.FuncLocId;
    }
 
    return '';
}
