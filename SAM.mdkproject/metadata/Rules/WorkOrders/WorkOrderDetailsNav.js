import {WorkOrderLibrary as libWo} from '../WorkOrders/WorkOrderLibrary';
import libCom from '../Common/Library/CommonLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import Logger from '../Log/Logger';
export default function WorkOrderDetailsNav(context) {
    let actionBinding;
    let previousPageProxy;
    let pageProxy;
    try {
        if (typeof context.getPageProxy === 'function') {
            actionBinding = context.getPageProxy().getActionBinding();
            previousPageProxy = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');
            pageProxy = context.getPageProxy();
        } else {
            actionBinding = context.getActionBinding();
            previousPageProxy = context.evaluateTargetPathForAPI('#Page:-Previous');
            pageProxy = context;
        }
    } catch (err) {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
            Logger.error('METER' , 'No Previous Page Exists');
            actionBinding = context.getPageProxy().getActionBinding();
            pageProxy = context.getPageProxy();
            let queryOptions = libWo.getWorkOrderDetailsNavQueryOption(context);
            if (queryOptions.indexOf('$expand=') > 0) {
                let expandIndex = queryOptions.indexOf('$expand=');
                let beforeExpand = queryOptions.substring(0, expandIndex);
                let afterExpand = queryOptions.substring(expandIndex + 8);
                queryOptions = beforeExpand + '$expand=OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,' + afterExpand;
            } else {
                queryOptions = queryOptions + 'OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,';
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions).then(function(result) {
                pageProxy.setActionBinding(result.getItem(0));
                let newBinding = result.getItem(0);
                if (newBinding.OrderISULinks[0]) {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
                }
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
            });
        } else {
            actionBinding = context.getPageProxy().getActionBinding();
            pageProxy = context.getPageProxy();
            return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], libWo.getWorkOrderDetailsNavQueryOption(context)).then(function(result) {
                pageProxy.setActionBinding(result.getItem(0));
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
            });
        }
    }

    if (libCom.getPageName(previousPageProxy) === 'PartDetailsPage') {
        let partsPreviousPage = previousPageProxy.evaluateTargetPathForAPI('#Page:-Previous');
        if (libCom.getPageName(partsPreviousPage) === 'PartsListViewPage') {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                });
            });
        }
    }

    if (libCom.getPageName(previousPageProxy) === 'WorkOrderDetailsPage' && previousPageProxy.getBindingObject().OrderId === actionBinding.OrderId) { //if the previous page was the parent workorder then, navigate back
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }

    if (libCom.getPageName(previousPageProxy) === 'InspectionLotDetailsPage') {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        });
    } 

    if (libCom.getPageName(previousPageProxy) === 'ObjectDetailsViewPage') {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        });
    }

    let queryOptions = libWo.getWorkOrderDetailsNavQueryOption(context);
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        if (queryOptions.indexOf('$expand=') > 0) {
            let expandIndex = queryOptions.indexOf('$expand=');
            let beforeExpand = queryOptions.substring(0, expandIndex);
            let afterExpand = queryOptions.substring(expandIndex + 8);
            queryOptions = beforeExpand + '$expand=OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,' + afterExpand;
        } else {
            queryOptions = queryOptions + 'OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,';
        }
    }
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions).then(function(result) {
        pageProxy.setActionBinding(result.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
    });
}
