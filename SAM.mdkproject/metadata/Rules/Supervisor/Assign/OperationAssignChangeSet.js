import { GlobalVar } from '../../Common/Library/GlobalCommon';

export default function OperationAssignChangeSet(context) {
    if (context.binding &&  context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        context.getClientData().OrderId = context.binding.OrderId;
        context.getClientData().OperationNo = context.binding.OperationNo;
        context.getClientData().EmployeeFrom = '';
        context.getClientData().EmployeeTo = context.evaluateTargetPath('#Control:AssignToLstPkr/#Value')[0].ReturnValue;
        context.getClientData().HeaderNotes = context.evaluateTargetPath('#Control:TransferNote/#Value');
        context.getClientData().ObjectType = GlobalVar.getAppParam().OBJECTTYPE.Operation;
        context.getClientData().ObjectKey = context.binding.OperationMobileStatus_Nav.ObjectKey;
        context.getClientData().MobileStatusReadLink = context.binding.OperationMobileStatus_Nav['@odata.readLink'];
        context.getClientData().OperationReadLink = context.binding['@odata.readLink'];
        context.getClientData().EmployeeReadLink = `Employees('${context.getClientData().EmployeeTo}')`;
        context.getClientData().Ignore = 'false';
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderOrOperationTransferAssignPerson.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationUpdatePerson.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignMobileStatusUpdate.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignSuccessMessage.action');
                });
            });
        });
    }
    let operations = context.getControl('FormCellContainer').getControl('OperationLstPkr').getValue();
    return CallActionWithReadPickerItems(context, operations);
}

export function CallActionWithReadPickerItems(context, operations) {
    if (operations.length > 0) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', operations[0].ReturnValue, [] ,'$expand=OperationMobileStatus_Nav').then(function(results) {
            if (results && results.length > 0) {
                let opr = results.getItem(0);
                operations.shift();
                context.getClientData().OrderId = opr.OrderId;
                context.getClientData().OperationNo = opr.OperationNo;
                context.getClientData().EmployeeFrom = '';
                context.getClientData().EmployeeTo = context.evaluateTargetPath('#Control:AssignToLstPkr/#Value')[0].ReturnValue;
                context.getClientData().HeaderNotes = context.evaluateTargetPath('#Control:TransferNote/#Value');
                context.getClientData().ObjectType = GlobalVar.getAppParam().OBJECTTYPE.Operation;
                context.getClientData().ObjectKey = opr.OperationMobileStatus_Nav.ObjectKey;
                context.getClientData().MobileStatusReadLink = opr.OperationMobileStatus_Nav['@odata.readLink'];
                context.getClientData().OperationReadLink = opr['@odata.readLink'];
                context.getClientData().EmployeeReadLink = `Employees('${context.getClientData().EmployeeTo}')`;
                context.getClientData().Ignore = 'false';
                return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderOrOperationTransferAssignPerson.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationUpdatePerson.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignMobileStatusUpdate.action').then(() => {
                            return CallActionWithReadPickerItems(context, operations);
                        });
                    });
                });
            }
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        });
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignSuccessMessage.action');
    }
}
