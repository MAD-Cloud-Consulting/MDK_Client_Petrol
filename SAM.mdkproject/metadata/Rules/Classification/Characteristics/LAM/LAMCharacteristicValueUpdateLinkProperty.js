
export default function LAMCharacteristicValueUpdateEntitySet(context) {
    let binding = context.binding;
    var value = '';

    switch (binding['@odata.type']) {
        case '#sap_mobile.MyEquipClassCharValue':
            value = 'MyEquipClassCharValue_Nav';
            break;
        case '#sap_mobile.MyFuncLocClassCharValue':
            value = 'MyFuncLocClassCharValue_Nav';
            break;
        default:
            break;
    }
    
    return value;

}
