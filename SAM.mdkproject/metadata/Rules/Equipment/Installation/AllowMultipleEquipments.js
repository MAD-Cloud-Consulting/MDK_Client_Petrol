
export default function AllowMultipleEquipments(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation' && context.binding.SingleInstall === 'X') {
       return false;
    }
    return true;
}
