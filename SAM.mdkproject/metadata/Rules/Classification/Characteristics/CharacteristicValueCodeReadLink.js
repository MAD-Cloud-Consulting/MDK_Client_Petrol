import ValueRel from '../Characteristics/Update/CharacteristicUpdateValueRel';
export default function CharacteristicValueCodeReadLink(context) {
    return 'CharValueCodes(\'' + ValueRel(context) + '\')';

}
