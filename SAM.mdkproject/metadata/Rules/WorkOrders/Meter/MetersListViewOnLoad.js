import libMeter from '../../Meter/Common/MeterLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';


export default function MetersListViewOnLoad(context) {
    let isuProcess = libMeter.getISUProcess(context.binding.OrderISULinks);
    context.setActionBarItemVisible(0, false); //disconnect all
    context.setActionBarItemVisible(1, false); //reconnect all

    if (libMobile.isHeaderStatusChangeable(context)) {
        context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/OrderMobileStatus_Nav', [], '').then(result => {
            if (result && result.getItem(0)) {
                let curMobileStatus = result.getItem(0).MobileStatus;
                if (curMobileStatus === 'STARTED' || curMobileStatus.MobileStatus === 'STARTED') {
                    setStatusForToolbarActions();
                }
            }
        });
    } else if (libMobile.isOperationStatusChangeable(context)) {
        context.count('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Operations', "$filter=OperationMobileStatus_Nav/MobileStatus eq 'STARTED'").then(function(count) {
            if (count > 0) {
                setStatusForToolbarActions();
            }
        });
    } else if (libMobile.isSubOperationStatusChangeable(context)) {
        context.count('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Operations', "$filter=SubOperations/any(subop : subop/SubOpMobileStatus_Nav/MobileStatus eq 'STARTED'").then(function(count) {
            if (count > 0) {
                setStatusForToolbarActions();
            }
        });
    }

    function setStatusForToolbarActions() {
        context.read('/SAPAssetManager/Services/AssetManager.service', context.binding.DisconnectActivity_Nav[0]['@odata.readLink'], [], '').then(function(disconnectActivityResult) {
            if (disconnectActivityResult && disconnectActivityResult.getItem(0)) {
                let disconnectActivity = disconnectActivityResult.getItem(0);
                if (isuProcess === 'DISCONNECT' && disconnectActivity.ActivityStatus === '10') {
                    context.read('/SAPAssetManager/Services/AssetManager.service', 'DisconnectionObjects', [], `$filter=DisconnectActivity_Nav/OrderId eq '${context.binding.OrderId}'&$expand=Device_Nav`).then(function(disconnectResult) {
                        let isAllDeviceConnected = true;
                        for (let i = 0; i < disconnectResult.length; i ++) {
                            if (disconnectResult.getItem(i).Device_Nav.DeviceBlocked === true) {
                                isAllDeviceConnected = false;
                            }
                        }
                        context.setActionBarItemVisible(0, isAllDeviceConnected);
                    });
                } else if (isuProcess === 'RECONNECT' && disconnectActivity.ActivityStatus === '20') {
                    context.read('/SAPAssetManager/Services/AssetManager.service', 'DisconnectionObjects', [], `$filter=DisconnectActivity_Nav/OrderId eq '${context.binding.OrderId}'&$expand=Device_Nav`).then(function(reconnectResult) {
                        let isAllDeviceBlocked = true;
                        for (let i = 0; i < reconnectResult.length; i ++) {
                            if (reconnectResult.getItem(i).Device_Nav.DeviceBlocked === false) {
                                isAllDeviceBlocked = false;
                            }
                        }
                        context.setActionBarItemVisible(1, isAllDeviceBlocked);
                    });
                }
            }
        });
    }
    
}
