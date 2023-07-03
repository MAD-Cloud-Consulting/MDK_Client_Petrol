export default function CharacteristicsValueRelToSign(relation) {
    let relationShipStrings = [];
    switch (relation) {
        case '9':
            relationShipStrings.push('>= ');
            break;
        case '8':
             relationShipStrings.push('> ');
             break;
        case '7':
            relationShipStrings.push('<= ');
            break;
        case '6':
            relationShipStrings.push('< ');
            break;
        case '5':
            relationShipStrings.push('> ');
            relationShipStrings.push(' - ');
            break;
        case '4':
            relationShipStrings.push('> ');
            relationShipStrings.push(' - < ');
            break;
        case '3':
            relationShipStrings.push('');
            relationShipStrings.push(' - ');
            break;
        case '2':
            relationShipStrings.push('');
            relationShipStrings.push(' - < ');
            break;
        case '1':
            relationShipStrings.push('');
            break;
        default:
            relationShipStrings.push('');

    }
    return relationShipStrings;
}
