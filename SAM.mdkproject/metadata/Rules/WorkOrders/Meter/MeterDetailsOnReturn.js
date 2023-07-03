import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterDetailsOnReturn(context) {
    let meterTransactionType = undefined;
    
    if (!(meterTransactionType = context.binding.ISUProcess)) {
        if (context.binding.DisconnectActivity_Nav && !Array.isArray(context.binding.DisconnectActivity_Nav)) {
            meterTransactionType = context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks[0].ISUProcess;
        }
    }
    if (meterTransactionType && meterTransactionType !== 'INSTALL' && meterTransactionType !== 'REP_INST') {
        let previousPageProxy = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage');
        previousPageProxy.setActionBarItemVisible(0, false); //take readings
        previousPageProxy.setActionBarItemVisible(1, false); //replace
        previousPageProxy.setActionBarItemVisible(2, false); //uninstall
        previousPageProxy.setActionBarItemVisible(3, false); //disconnect
        previousPageProxy.setActionBarItemVisible(4, false); //reconnect
        previousPageProxy.setActionBarItemVisible(5, false); //edit

        let isuLink = undefined;

        if (context.binding['@odata.type'] === '#sap_mobile.OrderISULink') {
            try {
                isuLink = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').getClientData().ISULink['@odata.editLink'];
                if (!isuLink) {
                    isuLink = context.binding['@odata.readLink'];
                } else {
                    if (meterTransactionType === 'INSTALL_EDIT') {
                        previousPageProxy.setActionBarItemVisible(0, true); //take readings
                        previousPageProxy.setActionBarItemVisible(5, true); //edit
                        return Promise.resolve();
                    }
                }
            } catch (exc) {
                isuLink = context.binding['@odata.readLink'];
            }
        } else {
            isuLink = context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks[0]['@odata.readLink'];
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', isuLink, [],'$expand=Device_Nav/DeviceCategory_Nav/Material_Nav,DeviceLocation_Nav/Premise_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderISULinks').then(function(orderISULink) {
            if (orderISULink.getItem(0)) {
                if (meterTransactionType === 'READING' || meterTransactionType === 'DISCONNECT' || meterTransactionType === 'RECONNECT') {
                    if (meterTransactionType === 'DISCONNECT') {
                        if (libMeter.isProcessed(context.binding)) {
                            previousPageProxy.setActionBarItemVisible(0, true);
                            previousPageProxy.setActionBarItemVisible(5, true);
                        } else {
                            previousPageProxy.setActionBarItemVisible(0, true);
                            previousPageProxy.setActionBarItemVisible(3, true);
                        }
                    } else if (meterTransactionType === 'RECONNECT') {
                        if (libMeter.isProcessed(context.binding)) {
                            previousPageProxy.setActionBarItemVisible(0, true);
                            previousPageProxy.setActionBarItemVisible(5, true);
                        } else {
                            previousPageProxy.setActionBarItemVisible(0, true);
                            previousPageProxy.setActionBarItemVisible(4, true);
                        }
                    } else if (meterTransactionType === 'READING') {
                        previousPageProxy.setActionBarItemVisible(0, true);
                    }
                } else if (meterTransactionType.startsWith('REPLACE')) {
                    if (libMeter.isProcessed(orderISULink.getItem(0)) && orderISULink.getItem(0).Workorder_Nav.OrderISULinks.length === 2) {
                        previousPageProxy.setActionBarItemVisible(0, true);
                        previousPageProxy.setActionBarItemVisible(5, true);
                    } else if (libMeter.isProcessed(orderISULink.getItem(0)) && orderISULink.getItem(0).Workorder_Nav.OrderISULinks.length === 1) {
                        previousPageProxy.setActionBarItemVisible(1, true);
                        previousPageProxy.setActionBarItemVisible(5, true);
                    } else if (libMeter.isProcessed(orderISULink.getItem(0))) {
                        previousPageProxy.setActionBarItemVisible(0, true);
                        previousPageProxy.setActionBarItemVisible(5, true);
                    }
                } else if (meterTransactionType.startsWith('REMOVE')) {
                    if (libMeter.isProcessed(orderISULink.getItem(0))) {
                        previousPageProxy.setActionBarItemVisible(0, true);
                        previousPageProxy.setActionBarItemVisible(5, true);
                    }
                }
            }
        });
    }
    return Promise.resolve();
}
