import { GlobalVar } from '../../Common/Library/GlobalCommon';
import autoSyncLib from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';

export default function WorkOrderAssignChangeSet(context) {
    if (context.binding &&  context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        context.getClientData().OrderId = context.binding.OrderId;
        context.getClientData().OperationNo = '';
        context.getClientData().EmployeeFrom = '';
        context.getClientData().EmployeeTo = context.evaluateTargetPath('#Control:AssignToLstPkr/#Value')[0].ReturnValue;
        context.getClientData().HeaderNotes = context.evaluateTargetPath('#Control:TransferNote/#Value');
        context.getClientData().ObjectType = GlobalVar.getAppParam().OBJECTTYPE.WorkOrder;
        context.getClientData().ObjectKey = context.binding.OrderMobileStatus_Nav.ObjectKey;
        context.getClientData().MobileStatusReadLink = context.binding.OrderMobileStatus_Nav['@odata.readLink'];
        context.getClientData().OrderReadLink = context.binding['@odata.readLink'];
        context.getClientData().PartnerFunction = 'VW';
        context.getClientData().Ignore = 'false';
        context.getClientData().EmployeeReadLink = `Employees('${context.getClientData().EmployeeTo}')`;
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignChangeSet.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignPartnerCreate.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignSuccessMessage.action').then(() => {
                    return autoSyncLib.autoSyncOnStatusChange(context);
                });
            });
        });
    }
    let workorders = context.getControl('FormCellContainer').getControl('WorkorderLstPkr').getValue();
    return CallActionWithReadPickerItems(context, workorders);
}

export function CallActionWithReadPickerItems(context, workorders) {
    let queryOptions = '$expand=OrderMobileStatus_Nav&$filter=OrderId eq id';
    if (workorders.length > 0) {
        let id = workorders[0].ReturnValue;
        queryOptions = queryOptions.replace('id', `'${id}'`);
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [] ,queryOptions).then(function(results) {
            if (results && results.length > 0) {
                let newBinding = results.getItem(0);
                workorders.shift();
                context.setActionBinding(newBinding);
                context.getClientData().OrderId = id;
                context.getClientData().OperationNo = '';
                context.getClientData().EmployeeFrom = '';
                context.getClientData().EmployeeTo = context.evaluateTargetPath('#Control:AssignToLstPkr/#Value')[0].ReturnValue;
                context.getClientData().HeaderNotes = context.evaluateTargetPath('#Control:TransferNote/#Value');
                context.getClientData().ObjectType = GlobalVar.getAppParam().OBJECTTYPE.WorkOrder;
                context.getClientData().ObjectKey = newBinding.OrderMobileStatus_Nav.ObjectKey;
                context.getClientData().MobileStatusReadLink = newBinding.OrderMobileStatus_Nav['@odata.readLink'];
                context.getClientData().OrderReadLink = newBinding['@odata.readLink'];
                context.getClientData().PartnerFunction = 'VW';
                context.getClientData().Ignore = 'false';
                context.getClientData().EmployeeReadLink = `Employees('${context.getClientData().EmployeeTo}')`;
                return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignChangeSet.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignPartnerCreate.action').then(() => {
                        return CallActionWithReadPickerItems(context, workorders);
                    });
                });
            }
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        });
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignSuccessMessage.action').then(() => {
            return autoSyncLib.autoSyncOnStatusChange(context);
        });
    }
}
