import libMeter from '../../../Meter/Common/MeterLibrary';

export default function RegisterDetailsOnLoad(context) {
    context.setActionBarItemVisible(0, false);
    let previousContextBinding = context.evaluateTargetPathForAPI('#Page:-Previous').binding;
    let readLink = '';
    let queryoptions = '$expand=OrderISULinks,OrderMobileStatus_Nav';
    if (previousContextBinding['@odata.type'] === '#sap_mobile.DisconnectionObject') {
        // Disconnect/Reconnect
        readLink = previousContextBinding['@odata.readLink'] + '/DisconnectActivity_Nav/WOHeader_Nav';
    } else if (previousContextBinding['@odata.type'] === '#sap_mobile.OrderISULink') {
        // Install/Remove/Replace/Aperiodic
        readLink = previousContextBinding['@odata.readLink'] + '/Workorder_Nav';
    } else if (previousContextBinding['@odata.type'] === '#sap_mobile.StreetRoute') {
        // Periodic
        context.setActionBarItemVisible(0, true);
        return Promise.resolve();
    } else {
        context.setActionBarItemVisible(0, false);
        return Promise.resolve();
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], queryoptions).then(function(result) {
        let woHeader = {};
        if (result.length > 0 && (woHeader = result.getItem(0))) {
            let meterTransactionType = woHeader.OrderISULinks[0].ISUProcess;
            let mobileStatus = woHeader.OrderMobileStatus_Nav.MobileStatus;
            if (mobileStatus === 'STARTED') {
                if (meterTransactionType === 'READING' || meterTransactionType === 'REPAIR') {
                    context.setActionBarItemVisible(0, true);
                } else if (libMeter.isLocal(previousContextBinding) || libMeter.isProcessed(previousContextBinding)) {
                    context.setActionBarItemVisible(0, true);
                } else {
                    context.setActionBarItemVisible(0, false);
                }
            }
        }
    });
}
