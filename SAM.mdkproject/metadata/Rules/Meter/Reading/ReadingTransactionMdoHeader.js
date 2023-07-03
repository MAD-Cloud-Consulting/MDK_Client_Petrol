import libMeter from '../../Meter/Common/MeterLibrary';

export default function ReadingTransactionMdoHeader(context) {
    if (context.binding.pageBinding.ErrorObject) {
        for (let idx = 0; idx < context.binding.pageBinding.ErrorObject.CustomHeaders.length; idx ++) {
            let obj = context.binding.pageBinding.ErrorObject.CustomHeaders[idx];
            if (obj.Name === 'transaction.omdo_id') {
                return obj.Value;
            }
        }
        return 'SAM2210_METER_READING';
    } else {
        let meterTransactionType = libMeter.getMeterTransactionType(context);
        if (meterTransactionType.startsWith('INSTALL') || meterTransactionType.startsWith('REMOVE') || meterTransactionType.startsWith('REPLACE') || meterTransactionType.startsWith('REP_INST')) {
            return 'SAM2210_DEVICE';
        } else if (meterTransactionType.startsWith('PERIODIC')) {
            return 'SAM2210_MR_PERIODIC';
        }
        return 'SAM2210_METER_READING';
    }
}
