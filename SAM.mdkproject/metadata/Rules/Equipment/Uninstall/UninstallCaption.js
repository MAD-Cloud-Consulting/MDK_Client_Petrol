export default function UninstallCaption(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
        return context.localizeText('superior_equipment');
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return context.localizeText('functional_location');
    } else {
        return '';
    }
}
