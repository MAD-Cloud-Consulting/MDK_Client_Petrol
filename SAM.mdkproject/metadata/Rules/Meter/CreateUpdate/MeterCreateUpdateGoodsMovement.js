import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterCreateUpdateGoodsMovement(context) {

    let meterTransactionType = libMeter.getMeterTransactionType(context);

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        meterTransactionType = context.binding.ISUProcess + '_EDIT';
    }
    
    if (meterTransactionType === 'REMOVE' || meterTransactionType === 'REPLACE') {
        return 'U62';
    } else if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        return 'U61';
    }
    if (context.binding.Device_Nav.GoodsMovement_Nav) {
        return context.binding.Device_Nav.GoodsMovement_Nav[0].MovementType;
    }
    return '';   
}
