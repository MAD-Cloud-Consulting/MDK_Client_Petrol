export default function RegisterReadingDifference(context) {
    return (context.binding.MeterReadingRecorded - context.binding.PreviousReadingFloat);
}
