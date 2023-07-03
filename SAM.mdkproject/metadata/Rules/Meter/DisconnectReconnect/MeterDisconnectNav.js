import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterDisconnectNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/DisconnectActivity_Nav/WOHeader_Nav/OrderISULinks', [], '').then(function(result) {
        let isuProcess = result.getItem(0).ISUProcess;
        libMeter.setMeterTransactionType(context, isuProcess);

        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=Device_Nav,DisconnectActivity_Nav/WOHeader_Nav/OrderISULinks,DisconnectDoc_Nav').then(function(result2) {
            context.setActionBinding(result2.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/Meters/MeterDisconnectNav.action');
        });
    });
}
