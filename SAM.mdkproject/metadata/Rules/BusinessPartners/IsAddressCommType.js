
/**
 * True if the binding object PartnerType is LI, KU, AP, or US
 * @param {*} context 
 */
export default function IsAddressCommType(context) {
    let isAddressCommType;
    switch (context.getBindingObject().PartnerFunction_Nav.PartnerType) {
        case 'LI':
        case 'KU': //For vendor and customer
        case 'AP':
        case 'US': //For contact and user
            isAddressCommType = true;
            break;
        default:
            isAddressCommType = false;
            break;
    }
    return isAddressCommType;
}
