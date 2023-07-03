import libMeter from '../../../Meter/Common/MeterLibrary';
export default function MeterDetailsOnLoad(context) {
    libMeter.setMeterTransactionType(context, 'PERIODIC');
    context.setActionBarItemVisible(0, false); //take readings

    context.count('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Device_Nav/PeriodicMeterReading_Nav', '').then(function(result) {
        if (result > 0) {
            context.setActionBarItemVisible(0, true);
        } else {
            context.setActionBarItemVisible(0, false);
        }
    });
}
