import meterReading from './MeterReadingRecorded';

export default function MeterReadingRecordedLocal(context) {
    return meterReading(context, true); //Pass the local only parameter
}
