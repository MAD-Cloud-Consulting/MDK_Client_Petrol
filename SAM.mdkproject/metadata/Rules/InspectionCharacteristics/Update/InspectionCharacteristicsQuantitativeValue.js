import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';

export default function InspectionCharacteristicsQuantitativeValue(context) {
    let resultValue = libCom.getFieldValue(context, 'QuantitativeValue', '', null, true);

    if (typeof(resultValue) === 'string' && libCom.isDefined(resultValue)) {
        return libLocal.toNumber(context, resultValue);
    } else {
        return resultValue;
    }
}
