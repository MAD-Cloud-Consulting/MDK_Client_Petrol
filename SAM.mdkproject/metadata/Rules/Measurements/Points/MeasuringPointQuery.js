export default function MeasuringPointQuery(context) {
    let pageProxy = context.getPageProxy();
    let binding = pageProxy.binding;
    let query = "$filter=Point eq '" + binding.Point + "'&$expand=MeasurementDocs,MeasurementDocs/MeasuringPoint&$select=*,MeasurementDocs/ReadingDate,MeasurementDocs/ReadingTimestamp,MeasurementDocs/ReadingTime,MeasurementDocs/ReadingValue,MeasurementDocs/IsCounterReading,MeasurementDocs/CounterReadingDifference,MeasurementDocs/MeasurementDocNum";
    return query;
}
