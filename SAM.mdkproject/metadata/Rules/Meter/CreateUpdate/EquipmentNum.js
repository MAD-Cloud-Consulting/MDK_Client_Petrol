import libMeter from '../../Meter/Common/MeterLibrary';

export default function EquipmentNum(context) {

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive) {
        return context.binding.EquipmentNum;
    } else if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        return context.binding.EquipmentNum;
    } else {
        let meterTransactionType = libMeter.getMeterTransactionType(context);
        if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST' ) {
            return '';
        } else {
            return context.binding.EquipmentNum;
        }
    }
}
