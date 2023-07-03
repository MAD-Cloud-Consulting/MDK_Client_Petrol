export default function UninstallValue(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        return context.binding.EquipDesc;
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return context.binding.FuncLocDesc;
    } else {
        return '';
    }
}
