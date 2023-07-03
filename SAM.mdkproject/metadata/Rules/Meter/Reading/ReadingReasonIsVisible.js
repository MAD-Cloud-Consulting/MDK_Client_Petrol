import libMeter from '../../Meter/Common/MeterLibrary';

export default function ReadingReasonIsVisible(context) {
    return libMeter.getMeterTransactionType(context) === 'READING';
}
