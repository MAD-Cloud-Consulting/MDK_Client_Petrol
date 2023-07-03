export default function ThresholdStyle(context) {
    if (context.binding.IndicatorColorCode) {
        return 'Color_' + context.binding.IndicatorColorCode.toUpperCase().substring(1);
    } else {
        return '';
    }
}
