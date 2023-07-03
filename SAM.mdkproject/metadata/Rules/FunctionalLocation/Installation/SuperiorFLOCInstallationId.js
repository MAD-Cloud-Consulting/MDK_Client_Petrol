

export default function SuperiorEquipmentInstallationId(context) {

    if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return context.binding.FuncLocIdIntern;
    } 
    return '';
}
