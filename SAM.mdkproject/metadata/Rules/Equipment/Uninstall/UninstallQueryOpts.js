export default function UninstallQueryOpts(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        return `$expand=WorkCenter_Nav&$filter=SuperiorEquip eq '${context.binding.EquipId}'`;
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return `$expand=WorkCenter_Nav&$filter=FunctionalLocation/FuncLocId eq '${context.binding.FuncLocId}' and SuperiorEquip eq ''`;
    } else {
        return 'false';
    }
}
