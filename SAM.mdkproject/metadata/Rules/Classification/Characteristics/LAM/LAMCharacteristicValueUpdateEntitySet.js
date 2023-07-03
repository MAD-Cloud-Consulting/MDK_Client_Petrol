
export default function LAMCharacteristicValueUpdateEntitySet(context) {
    let binding = context.binding;
    var value = '';

    switch (binding['@odata.type']) {
        case '#sap_mobile.MyEquipClassCharValue':
            value = 'MyEquipClassCharValues';
            break;
        case '#sap_mobile.MyFuncLocClassCharValue':
            value = 'MyFuncLocClassCharValues';
            break;
        default:
            break;
    }
    
    return value;

}
