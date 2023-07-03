import { GlobalVar } from '../../Common/Library/GlobalCommon';
import autoSyncLib from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';

export default function WorkOrderReAssignChangeSet(context) {
    if (context.binding &&  context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        let employeeTo = context.evaluateTargetPath('#Control:AssignToLstPkr/#Value')[0].ReturnValue;
        if (employeeTo === context.getClientData().PreviousEmployeeTo) {
            context.getClientData().Error=context.localizeText('already_assign_message', [context.getClientData().PreviousEmployeeName]);
            return context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
        }
        //unassign && assign
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderPartners', [] ,`$filter=PartnerFunction eq 'VW' and PersonNum eq '${context.getClientData().PreviousEmployeeTo}' and OrderId eq '${context.binding.OrderId}' and sap.islocal()`).then(function(results) {
            if (results && results.length >0) {
                context.getClientData().OrderId = context.binding.OrderId;
                context.getClientData().PartnerReadLink = results.getItem(0)['@odata.readLink'];
                context.getClientData().EmployeeTo = context.getClientData().PreviousEmployeeTo;
                context.getClientData().Ignore = 'true';
                context.getClientData().ObjectType = GlobalVar.getAppParam().OBJECTTYPE.WorkOrder;
                context.getClientData().ObjectKey = context.binding.OrderMobileStatus_Nav.ObjectKey;
                context.getClientData().MobileStatusReadLink = context.binding.OrderMobileStatus_Nav['@odata.readLink'];
                context.getClientData().OrderReadLink = context.binding['@odata.readLink'];
                context.getClientData().PartnerFunction = 'VW';
                context.getClientData().EmployeeReadLink = `Employees('${context.getClientData().PreviousEmployeeTo}')`;
                return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignPartnerDelete.action').then(() =>{
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkOrderTransfers', [], `$filter=OrderId eq '${context.binding.OrderId}' and EmployeeTo eq '${context.getClientData().PreviousEmployeeTo}' and sap.islocal()`).then(function(transferResults) {
                        if (transferResults && transferResults.length > 0) {
                            context.getClientData().TransferReadLink = transferResults.getItem(0)['@odata.readLink'];
                            return context.executeAction('/SAPAssetManager/Actions/Supervisor/UnAssign/WorkOrderUnAssignPerson.action').then(() =>{
                                context.getClientData().Ignore = 'false';
                                context.getClientData().EmployeeTo = context.evaluateTargetPath('#Control:AssignToLstPkr/#Value')[0].ReturnValue;
                                context.getClientData().EmployeeReadLink = `Employees('${context.getClientData().EmployeeTo}')`;
                                return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignChangeSet.action').then(() => {
                                    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignPartnerCreate.action').then(() => {
                                        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignSuccessMessage.action').then(() => {
                                            return autoSyncLib.autoSyncOnStatusChange(context);
                                        });
                                    });
                                });
                            });
                        }
                        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
                    });
                });
            }
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
        });
    }
}
