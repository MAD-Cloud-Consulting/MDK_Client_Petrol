export default function MeasuringPointReading(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let binding = pageClientAPI.binding;
    let decimal = Number(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/MeasuringPoints/FormatDecimalPrecision.global').getValue());

    if (binding.hasOwnProperty('ReadingValue')) {
        return pageClientAPI.formatNumber(binding.ReadingValue, '', {maximumFractionDigits: decimal});
    } else {
        return '';
    }
}
