import libMeter from '../../Meter/Common/MeterLibrary';

export default function ActivityUpdateNav(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav,WOHeader_Nav/OrderMobileStatus_Nav,WOHeader_Nav/OrderISULinks').then(function(result) {
        context.setActionBinding(result.getItem(0));
        let isuProcess = result.getItem(0).WOHeader_Nav.OrderISULinks[0].ISUProcess;
        libMeter.setMeterTransactionType(context, isuProcess);

        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityUpdateNav.action');
    });
}
