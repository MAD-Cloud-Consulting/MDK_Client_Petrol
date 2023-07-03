import libMeter from '../../Meter/Common/MeterLibrary';
import {GlobalVar} from '../../Common/Library/GlobalCommon';

export default function ReadingReasonValue(context) {
    let transactionType = libMeter.getMeterTransactionType(context);
    if (transactionType.startsWith('READING')) {
        if (context.evaluateTargetPath('#Control:ReasonPicker/#Value').length > 0) {
            return context.evaluateTargetPath('#Control:ReasonPicker/#Value')[0].ReturnValue;
        } else {
            return '';
        }
    } else if (transactionType.startsWith('DISCONNECT')) {
        try {
            return GlobalVar.getAppParam().METERREASONCODE.Disconnect;
        } catch (exc) {
            return '';
        }
    } else if (transactionType.startsWith('RECONNECT')) {
        try {
            return GlobalVar.getAppParam().METERREASONCODE.Reconnect;
        } catch (exc) {
            return '';
        }
    } else {
        return '';
    }
}
