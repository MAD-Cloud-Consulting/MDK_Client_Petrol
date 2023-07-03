import libCommon from '../../Common/Library/CommonLibrary';
import libWOMobile from './WorkOrderMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import { ChecklistLibrary as libChecklist } from '../../Checklists/ChecklistLibrary';
import ExpensesVisible from '../../ServiceOrders/Expenses/ExpensesVisible';
import MileageIsEnabled from '../../ServiceOrders/Mileage/MileageIsEnabled';
import mileageAddNav from '../../ServiceOrders/Mileage/MileageAddNav';
import expenseCreateNav from '../../Expense/CreateUpdate/ExpenseCreateNav';

export default function WorkOrderCompleteStatus(context) {
    //ChangeStatus is used by WorkOrderMobileStatusFailureMessage.action & WorkOrderMobileStatusSuccessMessage.action
    context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    
    var isStatusChangeable = libMobile.isHeaderStatusChangeable(context);
    if (isStatusChangeable) {
        let binding = libCommon.getBindingObject(context);
        var equipment = binding.HeaderEquipment;
        var functionalLocation = binding.HeaderFunctionLocation;
        return libChecklist.allowWorkOrderComplete(context, equipment, functionalLocation).then(results => { //Check for non-complete checklists and ask for confirmation
            if (results === true) {
                return libWOMobile.completeWorkOrder(context).then(function() {
                    let executeExpense = false;
                    let executeMilage = false;
                    if (ExpensesVisible(context)) {
                        libCommon.setStateVariable(context, 'IsWOCompletion', true);
                        executeExpense = true;
                    } 
                    if (MileageIsEnabled(context)) {
                        executeMilage = true;
                    }
                    libCommon.setStateVariable(context, 'IsExecuteExpense', executeExpense);
                    libCommon.setStateVariable(context, 'IsExecuteMilage', executeMilage);
        
                    // IsPDFGenerate variable handles the generation after the mileage or expense creation
                    libCommon.setStateVariable(context, 'IsPDFGenerate', executeExpense || executeMilage);
                    if (executeExpense) {
                        context.getPageProxy().setActionBinding(binding);
                        return expenseCreateNav(context);
                    } else if (executeMilage) {
                        context.getPageProxy().setActionBinding(binding);
                        return mileageAddNav(context);
                    } else {
                        return Promise.resolve();
                    }
                });
            } else {
                return Promise.resolve(true);
            }
        }).finally(() => {
            delete context.getPageProxy().getClientData().ChangeStatus; 
            context.getPageProxy().getClientData().didShowSignControl = false;    
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action').finally(() => {
        delete context.getPageProxy().getClientData().ChangeStatus;
    });
}
