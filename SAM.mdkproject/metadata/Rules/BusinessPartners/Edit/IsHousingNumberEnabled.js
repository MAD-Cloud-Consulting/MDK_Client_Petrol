

export default function IsHousingNumberEnabled(context) {

    let binding = context.getBindingObject();
    let partnerType = binding.PartnerFunction_Nav.PartnerType;

    let isEnabled;
    switch (partnerType) {
        case 'LI':
        case 'KU':
        case 'AP':
        case 'US':
            isEnabled = true;
            break;
        default:
            isEnabled = false;
            break;
    }
    return isEnabled;
}
