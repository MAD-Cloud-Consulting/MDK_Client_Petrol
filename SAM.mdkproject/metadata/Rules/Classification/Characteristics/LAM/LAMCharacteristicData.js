

export default function LAMCharacteristicData(context, field) {
    var value = '';
    let binding = context.binding;

    switch (field) {
        case 'ObjectKey':
            value =  binding.ObjectKey;
            break;
        case 'InternCharacteristic':
            value =  binding.CharId;
            break;
        case 'CharValCounter':
            value = binding.CharValCounter;
            break;
        case 'ObjClassFlag':
            value = binding.ObjClassFlag;
            break;
        case 'ClassType':
            value = binding.ClassType;
            break;
        case 'InternCounter':
            value = binding.InternCounter;
            break;
        case 'Table':
            switch (binding['@odata.type']) {
                case '#sap_mobile.MyEquipClassCharValue':
                    value = 'EQUI';
                    break;
                case '#sap_mobile.MyFuncLocClassCharValue':
                    value = 'IFLOT';
                    break;
                default:
                    break;
            }
            break;
        case 'CharValDesc':
            value = binding.CharValDesc;
            break;
        default:
            break;
    }

    return value;

}
