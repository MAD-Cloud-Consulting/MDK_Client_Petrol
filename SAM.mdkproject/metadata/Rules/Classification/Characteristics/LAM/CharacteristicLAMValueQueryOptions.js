
export default function CharacteristicLAMValueQueryOptions(context) {

    let binding = context.binding;

    let objKey = binding.ObjectKey;
    let charId = binding.CharId;
    let objType;
    let expand;
    if (binding['@odata.type'].includes('Equip')) {
        objType = 'EQUI';
        expand = 'MyEquipClassCharValue_Nav';
    } else {
        objType = 'IFLOT';
        expand = 'MyFuncLocClassCharValue_Nav';
    }
    let query = '$filter=(ObjectKey eq \'' + objKey + '\' and InternCharacteristic eq \'' + charId + '\' and Table eq \'' + objType + '\')&$expand=' + expand+'&$orderby='+expand+'/CharValDesc asc,'+expand+'/CharValFrom asc';
    return query;
}


