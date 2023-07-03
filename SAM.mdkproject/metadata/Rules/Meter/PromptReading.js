import common from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libMeter from '../Meter/Common/MeterLibrary';
import meterReplaceInstall from './CreateUpdate/MeterReplaceInstall';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function PromptReading(context) {

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive) {
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
    }
    let meterTransactionType = libMeter.getMeterTransactionType(context);
    let batchEquipmentNum = context.binding.BatchEquipmentNum;
    let OrderISULink = context.binding;

    if (OrderISULink['@odata.type'] !== '#sap_mobile.OrderISULink') {
        OrderISULink = context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks[0];
    }

    let title = context.localizeText('meter');
    if (meterTransactionType === 'REMOVE' || meterTransactionType === 'REPLACE') {
        title = context.localizeText('meter_removed');
    } else if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        title = context.localizeText('meter_installed');
    } else if (meterTransactionType === 'DISCONNECT') {
        batchEquipmentNum = String(context.binding.DisconnectActivity_Nav.ActivityNum) + String(context.binding.DisconnectActivity_Nav.DocNum);
        context.getClientData().DeviceReadLink = context.binding.Device_Nav['@odata.readLink'];
        title = context.localizeText('meter_disconnected');
    } else if (meterTransactionType === 'RECONNECT') {
        batchEquipmentNum = String(context.binding.DisconnectActivity_Nav.ActivityNum) + String(context.binding.DisconnectActivity_Nav.DocNum);
        context.getClientData().DeviceReadLink = context.binding.Device_Nav['@odata.readLink'];
        title = context.localizeText('meter_reconnected');
    } else if (meterTransactionType.endsWith('_EDIT')) {
        title = context.localizeText('meter_updated');
    }
    return common.showWarningDialog(context, context.localizeText('reading_message'), title, 'OK', 'Skip').then(function() {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(function() {
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.getClientData().DeviceReadLink, [], '$expand=DeviceCategory_Nav,OrderISULink_Nav/DeviceLocation_Nav,RegisterGroup_Nav/Registers_Nav,Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,MeterReadings_Nav').then(function(result) {
                if (result && result.length === 1) {
                    let prevPageBinding = context.evaluateTargetPathForAPI('#Page:-Previous').binding;
                    prevPageBinding.DeviceLink = result.getItem(0);
                    prevPageBinding.BatchEquipmentNum = batchEquipmentNum;
                    try {
                        if (!(prevPageBinding.OrderISULink = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').getClientData().ISULink)) {
                            prevPageBinding.OrderISULink = OrderISULink;
                        }
                    } catch (exc) {
                        prevPageBinding.OrderISULink = OrderISULink;
                    }
                    prevPageBinding.ISUProcess = meterTransactionType;
                    common.setStateVariable(context, 'METERREADINGOBJ', prevPageBinding);
                    return context.executeAction('/SAPAssetManager/Actions/Meters/MeterReadingNavMultiple.action');
                } else {
                    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Meters/MeterUpdatedToast.action').then(function() {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                    });
                }
            });
        });
    }, function() {
        context.binding.BatchEquipmentNum = batchEquipmentNum;
        context.binding.OrderISULink = OrderISULink;
        return meterReplaceInstall(context);
    });
}
