import libMeter from '../../Meter/Common/MeterLibrary';
import common from '../../Common/Library/CommonLibrary';

export default function MeterDetailsOnLoad(context) {
    let meterTransactionType;
    context.setActionBarItemVisible(0, false); //take readings
    context.setActionBarItemVisible(1, false); //replace
    context.setActionBarItemVisible(2, false); //uninstall
    context.setActionBarItemVisible(3, false); //disconnect
    context.setActionBarItemVisible(4, false); //reconnect
    context.setActionBarItemVisible(5, false); //edit

    let targetEntity;
    let expand = [];

    // Only enable buttons if we're not on a Device entity
    if (context.binding['@odata.type'] !== '#sap_mobile.Device') {

        //Current page can have OrderISULink or DisconnectionObject as the context. Need to check which one is the current context.
        if (context.binding.DisconnectActivity_Nav) {
            targetEntity = context.binding['@odata.readLink'] + '/DisconnectActivity_Nav';
            expand = ['WOHeader_Nav/OrderMobileStatus_Nav', 'WOHeader_Nav/OrderISULinks'];
        } else {
            targetEntity = context.binding['@odata.readLink'] + '/Workorder_Nav';
            expand = ['OrderMobileStatus_Nav'];
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', targetEntity, [], '$expand=' + expand.join(',')).then(result => {
            if (result && result.getItem(0)) {
                let WOHeader = '';
                if (result.getItem(0).WOHeader_Nav) {
                    WOHeader = result.getItem(0).WOHeader_Nav;
                } else {
                    WOHeader = result.getItem(0);
                }
                let isStartedPromise = null;
                switch (common.getWorkOrderAssnTypeLevel(context)) {
                    case 'Header':
                        // Header level: Check the OrderMobileStatus, and return the resolved Promise.
                        isStartedPromise = Promise.resolve(WOHeader.OrderMobileStatus_Nav.MobileStatus === 'STARTED' || WOHeader.MobileStatus === 'STARTED');
                        break;
                    case 'Operation':
                        // Operation Level: Get a count of all of the Operations whose OperationMobileStatus is 'STARTED'. If count > 0, return true.
                        isStartedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', WOHeader['@odata.readLink'] + '/Operations', "$filter=OperationMobileStatus_Nav/MobileStatus eq 'STARTED'").then(function(count) {
                            return (count > 0);
                        });
                        break;
                    case 'SubOperation':
                            // Suboperation Level: Get a count of all of the Operations who have a Sub-Operation whose SuboperationMobileStatus is 'STARTED'. If count > 0, return true.
                        isStartedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', WOHeader['@odata.readLink'] + '/Operations', "$filter=SubOperations/any(subop : subop/SubOpMobileStatus_Nav/MobileStatus eq 'STARTED')").then(function(count) {
                            return (count > 0);
                        });
                        break;
                    default:
                        isStartedPromise = Promise.resolve(false);
                }
                return isStartedPromise.then(function(isStarted) {
                    if (isStarted) {
                        if (context.binding.DisconnectActivity_Nav) {
                            expand = 'DisconnectDoc_Nav,DisconnectActivity_Nav/WOHeader_Nav/OrderISULinks,Device_Nav/DeviceCategory_Nav/Material_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,Device_Nav/DeviceLocation_Nav';
                        } else {
                            expand = '$expand=Workorder_Nav/DisconnectActivity_Nav/DisconnectObject_Nav,Installation_Nav,Premise_Nav,Device_Nav/DeviceCategory_Nav/Material_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,Device_Nav/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,Device_Nav/DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderMobileStatus_Nav,Workorder_Nav/OrderISULinks,Device_Nav/MeterReadings_Nav';
                        }
                        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], expand).then(results => {
                            if (results && results.length > 0) {
                                let binding = results.getItem(0);
                                meterTransactionType = binding.ISUProcess;
                                if ((meterTransactionType) !== undefined) {
                                    switch (meterTransactionType) {
                                        case 'READING':
                                            enableReading(context, binding);
                                            break;
                                        case 'REPAIR':
                                            context.setActionBarItemVisible(0, true);
                                            break;
                                        case 'REPLACE':
                                            enableReplace(context, binding);
                                            break;
                                        case 'REMOVE':
                                            enableRemove(context,binding);
                                            break;
                                        case 'INSTALL':
                                        case 'REP_INST':
                                            enableInstall(context, binding);
                                            break;
                                    }
                                } else if ((meterTransactionType = result.getItem(0).WOHeader_Nav.OrderISULinks[0].ISUProcess) !== undefined) {
                                    if (meterTransactionType === 'DISCONNECT' && result.getItem(0).ActivityStatus === '10') {
                                        enableDisconnect(context, binding);
                                    } else if (meterTransactionType === 'RECONNECT' && result.getItem(0).ActivityStatus === '20') {
                                        enableReconnect(context, binding);
                                    }
                                }
                            }
                        });
                    }
                    return Promise.resolve();
                });
            } else {
                return Promise.resolve();
            }
        });
    }
}

export function allowReadingsAndEdit(context) {
    context.setActionBarItemVisible(0, true);
    context.setActionBarItemVisible(5, true);
}

export function enableReconnect(context, binding) {
    if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
        allowReadingsAndEdit(context);
    } else if (!libMeter.isProcessed(binding)) {
        context.setActionBarItemVisible(0, true);
        context.setActionBarItemVisible(4, true);
    }
}

export function enableDisconnect(context, binding) {
    if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
        allowReadingsAndEdit(context);
    } else if (!libMeter.isProcessed(binding)) {
        context.setActionBarItemVisible(0, true);
        context.setActionBarItemVisible(3, true);
    }
}

export function enableRemove(context, binding) {
    if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
        allowReadingsAndEdit(context);
    } else if (!libMeter.isProcessed(binding)) {
        context.setActionBarItemVisible(2, true);
    }
}

export function enableInstall(context, binding) {
    if (libMeter.isLocal(binding) && libMeter.isProcessed(binding)) {
        allowReadingsAndEdit(context);
    }
}

export function enableReplace(context, binding) {
    if (libMeter.isLocal(binding) && libMeter.isProcessed(binding) && binding.Workorder_Nav.OrderISULinks.length === 2) {
        allowReadingsAndEdit(context);
    } else if (libMeter.isLocal(binding) && libMeter.isProcessed(binding) && binding.Workorder_Nav.OrderISULinks.length === 1) {
        context.setActionBarItemVisible(1, true);
        context.setActionBarItemVisible(5, true);
    } else if (!libMeter.isProcessed(binding)) {
        context.setActionBarItemVisible(1, true);
    }
}

export function enableReading(context, binding) {
    if (binding.Device_Nav && binding.Device_Nav.MeterReadings_Nav) {
        let allReadingsArray = binding.Device_Nav.MeterReadings_Nav;

        //We don't want to allow further readings if there exists an aperiodic reading with MRO
        //So we look for a reading with any of the aperiodic reason codes and a MR Doc ID
        let aperiodicReadingsWithMROFound = allReadingsArray.find(reading => {
            return reading.MeterReadingReason !== '01' && reading.MeterReadingDocID;
        });

        if (aperiodicReadingsWithMROFound !== undefined || allReadingsArray.length === 0) {
            context.setActionBarItemVisible(0, true);
        }

    } else {
        context.setActionBarItemVisible(0, true);
    }
}
