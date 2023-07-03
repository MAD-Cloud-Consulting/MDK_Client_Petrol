import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import FinalizeCompletePage from './FinalizeCompletePage';
import IsMeterComponentEnabled from '../../ComponentsEnablement/IsMeterComponentEnabled';

export default function FinalizeCompletePageMessage(context) {
    let binding = context.getPageProxy().binding;
    let title = 'completion_WO_title';
    let message = 'meter_action_has_not_been_performed_for_wo';

    let noStatusMessage = 'meter_action_has_not_been_performed_for_wo_no_status';
    if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {
        message = 'meter_action_has_not_been_performed_for_operation_no_status';
    }
    if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
        title = 'completion_sub_operation_title';
        message = 'meter_action_has_not_been_performed_for_suboperation_no_status';
    }

    if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {
        noStatusMessage = 'meter_action_has_not_been_performed_for_operation';
    }
    if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
        noStatusMessage = 'meter_action_has_not_been_performed_for_suboperation';
    }
    if (IsMeterComponentEnabled(context)) {

        return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, [], '$expand=OrderISULinks')
            .then(data => {
                let woData = data.getItem(0);
                if (woData && woData.OrderISULinks.length > 0 && !!woData.OrderISULinks[0].ISUProcess) {
                    let type = woData.OrderType;
                    let activityType = type === 'RC01' ? '03' : '01';

                    switch (type) {
                        case 'CU01':
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, [], '$expand=OrderISULinks/Device_Nav/MeterReadings_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav').then(results => {
                                if (results && results.length > 0) {
                                    for (var i = 0; i < results.length; i++) {
                                        let isuLinks = results.getItem(i).OrderISULinks;
                                        if (isuLinks && isuLinks.length > 0) {
                                            for (var j = 0; j < isuLinks.length; j++) {
                                                let deviceNav = isuLinks[j].Device_Nav;
                                                if (deviceNav && deviceNav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.Status !== 'INST') {
                                                    if (deviceNav.hasOwnProperty('@sap.isLocal')) {
                                                        return FinalizeCompletePage(context);
                                                    }
                                                    for (var k = 0; k < deviceNav.MeterReadings_Nav.length; k++) {
                                                        let meterReadingObj = deviceNav.MeterReadings_Nav[k];
                                                        if (meterReadingObj.hasOwnProperty('@sap.isLocal')) {
                                                            return FinalizeCompletePage(context);
                                                        }
                                                    }
                                                    return showMessageDialg(context, title, noStatusMessage);
                                                }
                                            }
                                        }
                                    }

                                }
                                return showMessageDialg(context, title, message);
                            }); 
                        case 'SM01':
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, [], '$expand=OrderISULinks/Device_Nav/MeterReadings_Nav').then(results => {
                                if (results && results.length > 0) {
                                    for (var i = 0; i < results.length; i++) {
                                        let isuLinks = results.getItem(i).OrderISULinks;
                                        if (isuLinks && isuLinks.length > 0) {
                                            for (var j = 0; j < isuLinks.length; j++) {
                                                let deviceNav = isuLinks[j].Device_Nav;
                                                if (deviceNav) {
                                                    if (deviceNav.hasOwnProperty('@sap.isLocal')) {
                                                        return FinalizeCompletePage(context);
                                                    }
                                                    for (var k = 0; k < deviceNav.MeterReadings_Nav.length; k++) {
                                                        let meterReadingObj = deviceNav.MeterReadings_Nav[k];
                                                        if (meterReadingObj.hasOwnProperty('@sap.isLocal')) {
                                                            return FinalizeCompletePage(context);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                }
                                return showMessageDialg(context, title, message);
                            }); 
                        case 'MR01':
                        case 'SM02':
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, [], '$expand=OrderISULinks/Device_Nav/MeterReadings_Nav').then(results => {
                                if (results && results.length > 0) {
                                    for (var i = 0; i < results.length; i++) {
                                        let isuLinks = results.getItem(i).OrderISULinks;
                                        if (isuLinks && isuLinks.length > 0) {
                                            for (var j = 0; j < isuLinks.length; j++) {
                                                let deviceNav = isuLinks[j].Device_Nav;
                                                if (deviceNav) {
                                                    for (var k = 0; k < deviceNav.MeterReadings_Nav.length; k++) {
                                                        let meterReadingObj = deviceNav.MeterReadings_Nav[k];
                                                        if (meterReadingObj.hasOwnProperty('@sap.isLocal')) {
                                                            return FinalizeCompletePage(context);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                }
                                return showMessageDialg(context, title, message);
                            });
                        case 'RP01':
                            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${binding.OrderId}')`, [], '$expand=OrderISULinks/Device_Nav/MeterReadings_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav').then(results => {
                                let installed = false;
                                let removed = false;
                                let removedESTO = false;
                                if (results && results.length > 0) {
                                    for (var i = 0; i < results.length; i++) {
                                        let isuLinks = results.getItem(i).OrderISULinks;
                                        if (isuLinks && isuLinks.length > 0) {
                                            for (var j = 0; j < isuLinks.length; j++) {
                                                let deviceNav = isuLinks[j].Device_Nav;
                                                if (deviceNav) {
                                                    if (deviceNav.hasOwnProperty('@sap.isLocal') && deviceNav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.Status === 'INST') {
                                                        installed = true;
                                                    }
                                                    if (deviceNav.hasOwnProperty('@sap.isLocal') && deviceNav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.Status === 'UNST' || deviceNav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.Status === 'ESTO') {
                                                        removed = true;
                                                    }
                                                    if (!deviceNav.hasOwnProperty('@sap.isLocal') && deviceNav.Equipment_Nav.ObjectStatus_Nav.SystemStatus_Nav.Status === 'ESTO') {
                                                        removedESTO = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (installed && removed) {
                                    return FinalizeCompletePage(context);
                                } else if (removedESTO) {
                                    return showMessageDialg(context, title, noStatusMessage);
                                }
                                return showMessageDialg(context, title, message);
                            });
                        case 'DC01':
                        case 'RC01':
                            return context.read('/SAPAssetManager/Services/AssetManager.service', 'DisconnectionObjects', [], `$filter=DisconnectActivity_Nav/OrderId eq '${binding.OrderId}' and DisconnectActivity_Nav/ActivityType eq '${activityType}'&$expand=DisconnectActivity_Nav,Device_Nav`).then(results => {
                                let hasLocal = results._array.every(obj => obj.hasOwnProperty('@sap.isLocal') && obj.DisconnectActivity_Nav.hasOwnProperty('@sap.isLocal') && obj.Device_Nav.hasOwnProperty('@sap.isLocal'));
                                if (hasLocal) {
                                    return FinalizeCompletePage(context);
                                } else {
                                    let disconnect = false;
                                    let reconnect = false;
                                    if (type === 'DC01') {
                                        disconnect = results._array.every(obj => (obj.DisconnectActivity_Nav.DisconnectFlag === 'X'));
                                    } else if (type === 'RC01') {
                                        reconnect = results._array.every(obj => (obj.DisconnectActivity_Nav.DisconnectFlag === ''));
                                    }
                                    if (disconnect || reconnect) {
                                        return showMessageDialg(context, title, message);
                                    }
                                    return showMessageDialg(context, title, noStatusMessage);
                                }
                            });
                    }
                    return Promise.resolve();
                }
                return showMessageDialg(context, title, 'completion_WO_message');
            })
            .catch(() => {
                return showMessageDialg(context, title, 'completion_WO_message');
        });
    }
    return FinalizeCompletePage(context);
}

function showMessageDialg(context, title, message) {
    return context.executeAction(
        {
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': context.localizeText(title),
                'Message': context.localizeText(message),
                'OKCaption': context.localizeText('ok'),
                'CancelCaption': context.localizeText('cancel'),
                'OnOK': '/SAPAssetManager/Rules/WorkOrders/Complete/FinalizeCompletePage.js',
            },
        }
    );
}
