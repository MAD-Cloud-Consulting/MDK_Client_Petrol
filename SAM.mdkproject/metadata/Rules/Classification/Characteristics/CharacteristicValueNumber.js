
import charValue from './CharacteristicValueFrom';
export default function CharacteristicValueNumber(context) {
    let maxDecimalDigits = context.binding.Characteristic.NumofDecimal;
    return context.formatNumber(charValue(context),null,{useGrouping : false, maximumFractionDigits : maxDecimalDigits});
}
