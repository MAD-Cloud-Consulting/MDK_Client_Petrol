import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterStorageLocationIsVisible(context) {
    let meterTransactionType = libMeter.getMeterTransactionType(context);

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        meterTransactionType = context.binding.ISUProcess + '_EDIT';
    }

    if (meterTransactionType !== 'INSTALL' && context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav) {
        if (context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0]) {
            if (context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0]) {
                return true;
            }
        }
    }

    return false;
}
