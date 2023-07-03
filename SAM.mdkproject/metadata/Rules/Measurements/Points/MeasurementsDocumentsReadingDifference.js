import libCommon from '../../Common/Library/CommonLibrary';
export default function ReadingDifference(context) {
    if (libCommon.isDefined(context.binding.IsCounterReading) && context.binding.IsCounterReading === 'X') {
        let decimal = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/MeasuringPoints/FormatDecimalPrecision.global').getValue());
        return context.formatNumber(context.binding.CounterReadingDifference, '', {maximumFractionDigits: decimal});
    } else {
        return '-';
    }
}
