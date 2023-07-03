import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OperationAssignOnLoad(context) {
    try {
        let clientData = context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData();
        if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsUnAssign') && clientData.IsUnAssign) {
            context.setCaption(context.localizeText('operation_unassign', [context.binding.OperationNo]));
            if (!(libVal.evalIsEmpty(context.binding.Employee_Nav)) || !(context.binding.PersonNum === '00000000')) {
                let assignToLstPkr = context.getControl('FormCellContainer').getControl('AssignToLstPkr');
                assignToLstPkr.setValue(context.binding.PersonNum);
                assignToLstPkr.setEditable(false);
            }
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsAssign') && clientData.IsAssign) {
            context.setCaption(context.localizeText('operation_assign', [context.binding.OperationNo]));
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsReAssign') && clientData.IsReAssign) {
            context.setCaption(context.localizeText('workorder_reassign', [context.binding.OperationNo]));
            if (!(libVal.evalIsEmpty(context.binding.Employee_Nav)) || !(context.binding.PersonNum === '00000000')) {
                let assignToLstPkr = context.getControl('FormCellContainer').getControl('AssignToLstPkr');
                assignToLstPkr.setValue(context.binding.PersonNum);
                assignToLstPkr.setEditable(true);
                context.getClientData().PreviousEmployeeTo=context.binding.PersonNum;
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', [] ,`$filter=PersonnelNo eq '${context.binding.PersonNum}'`).then(function(userresults) {
                    if (userresults && userresults.length > 0) {
                        context.getClientData().PreviousEmployeeName=userresults.getItem(0).SAPUserId + ' - ' + userresults.getItem(0).UserNameLong;
                    }
                });
            }
        }
    } catch (error) {
        context.setCaption(context.localizeText('operations_assign'));
    }
}
