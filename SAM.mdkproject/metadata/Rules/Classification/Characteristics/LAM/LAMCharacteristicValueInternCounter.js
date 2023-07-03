
import LAMCharacteristic from './LAMCharacteristicData';

export default function LAMCharacteristicValueInternCounter(context) {

    let value = LAMCharacteristic(context, 'InternCounter');
    return value;

}
