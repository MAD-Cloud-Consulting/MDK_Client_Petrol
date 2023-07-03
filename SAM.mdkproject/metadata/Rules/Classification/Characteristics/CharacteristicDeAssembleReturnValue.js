import valueSignToRel from './CharacteristicsSignToValueRel';
export default function CharacteristicDeAssembleReturnValue(returnValue, getValue) {
    if (getValue === 'ValueRel') {
        return valueSignToRel(returnValue.split('|'));
    } else if (getValue === 'CharValFrom') {
        return returnValue.split('|')[1];
    } else if (getValue === 'CharValTo')  {
        return returnValue.split('|').length === 4 ? returnValue.split('|')[3] : returnValue.split('|')[2];
    }
}
