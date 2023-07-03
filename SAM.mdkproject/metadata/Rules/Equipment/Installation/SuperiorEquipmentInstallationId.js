

export default function SuperiorEquipmentInstallationId(context) {

    if (context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        return context.binding.EquipId;
    } 
    return '';
}
