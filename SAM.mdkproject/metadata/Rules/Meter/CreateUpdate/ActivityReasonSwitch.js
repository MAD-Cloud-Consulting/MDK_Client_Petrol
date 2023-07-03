import libMeter from '../../Meter/Common/MeterLibrary';

export default function ActivityReasonSwitch(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.getClientData().DeviceReadLink, [], '').then(function(result) {
        let meterTransactionType = libMeter.getMeterTransactionType(context);
        let device = {};
        if ((meterTransactionType === 'REP_INST' || meterTransactionType === 'REP_INST_EDIT') && result.length > 0 && (device = result.getItem(0))) {
            return device.ActivityReason;
        } else {
            return context.evaluateTargetPath('#Control:ReasonLstPkr/#Value/#First/#Property:ReturnValue');
        }
    }).catch(function() {
        return context.evaluateTargetPath('#Control:ReasonLstPkr/#Value/#First/#Property:ReturnValue');
    });
}
