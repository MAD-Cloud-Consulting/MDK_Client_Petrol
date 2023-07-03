
import LAMInternChar from './LAMCharacteristicValueInternChar';
import LAMObjClasFlag from './LAMCharacteristicValueObjClassFlag';
import LAMClassType from './LAMCharacteristicValueClassType';
import LAMCharValCounter from './LAMCharacteristicValueCharValCounter';
import InternCounter from './LAMCharacteristicValueInternCounter';
import LAMObjectKey from './LAMCharacteristicValueObjectKey';
import LAMTable from './LAMCharacteristicValueTable';

import GenerateLocalID from '../../../Common/GenerateLocalID';

export default function LAMCharacteristicValueLAMInternCounter(context) {

    let lamInternChar = LAMInternChar(context);
    let lamObjClassFlag = LAMObjClasFlag(context);
    let lamClassType = LAMClassType(context);
    let lamCharValCounter = LAMCharValCounter(context);
    let internCounter = InternCounter(context);
    let lamObjectKey = LAMObjectKey(context);
    let lamTable = LAMTable(context);

    let filterString = `$filter=CharValCounter eq '${lamCharValCounter}' and ClassType eq '${lamClassType}' and ObjClassFlag eq '${lamObjClassFlag}' ` +
                       `and ObjectKey eq '${lamObjectKey}' and InternCounter eq '${internCounter}' and Table eq '${lamTable}' and InternCharacteristic eq '${lamInternChar}'`;


    return GenerateLocalID(context, 'LAMCharacteristicValues', 'LAMInternCounter', '0000', filterString, '').then(LAMInternCounter => {
        return LAMInternCounter;
    });
}
