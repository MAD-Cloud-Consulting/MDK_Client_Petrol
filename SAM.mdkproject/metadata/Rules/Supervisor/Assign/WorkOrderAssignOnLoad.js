import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function WorkOrderAssignOnLoad(context) {
    try {
        let clientData = context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData();
        let partnerFunction = 'VW';
        if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsUnAssign') && clientData.IsUnAssign) {
            context.setCaption(context.localizeText('workorder_unassign', [context.binding.OrderId]));
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${context.binding.OrderId}')/WOPartners`, [] ,`$filter=PartnerFunction eq '${partnerFunction}' and sap.islocal()`).then(function(results) {
                if (results && results.length > 0) {
                    let assignToLstPkr = context.getControl('FormCellContainer').getControl('AssignToLstPkr');
                    assignToLstPkr.setValue(results.getItem(0).PersonNum);
                    assignToLstPkr.setEditable(false);
                }
            });
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsAssign') && clientData.IsAssign) {
            context.setCaption(context.localizeText('workorder_assign', [context.binding.OrderId]));
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsReAssign') && clientData.IsReAssign) {
            context.setCaption(context.localizeText('workorder_reassign', [context.binding.OrderId]));
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${context.binding.OrderId}')/WOPartners`, [] ,`$filter=PartnerFunction eq '${partnerFunction}' and sap.islocal()`).then(function(results) {
                if (results && results.length > 0) {
                    let assignToLstPkr = context.getControl('FormCellContainer').getControl('AssignToLstPkr');
                    assignToLstPkr.setValue(results.getItem(0).PersonNum);
                    assignToLstPkr.setEditable(true);
                    context.getClientData().PreviousEmployeeTo=results.getItem(0).PersonNum;
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', [] ,`$filter=PersonnelNo eq '${results.getItem(0).PersonNum}'`).then(function(userresults) {
                        if (userresults && userresults.length > 0) {
                            context.getClientData().PreviousEmployeeName=userresults.getItem(0).SAPUserId + ' - ' + userresults.getItem(0).UserNameLong;
                        }
                    });
                }
                return true;
            });
        }
    } catch (error) {
        context.setCaption(context.localizeText('workorders_assign'));
    }
}
