import GenerateLocalConfirmationNum from '../../Confirmations/CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import commonLib from '../../Common/Library/CommonLibrary';
import GenerateCounter from '../../Confirmations/CreateUpdate/OnCommit/GenerateConfirmationCounter';
import Logger from '../../Log/Logger';
import GetAmountValue from './Data/GetAmountValue';

export default function ExpenseCreateUpdateOnCommit(context) {
    let onCreate = commonLib.IsOnCreate(context);
    
    if (onCreate) {
        return GenerateLocalConfirmationNum(context).then(confirmationNum => {
            commonLib.setStateVariable(context, 'LAMConfirmationNum',confirmationNum);
            return GenerateCounter(context).then(confirmationCounter => {
                commonLib.setStateVariable(context, 'LAMConfirmationCounter', confirmationCounter);
                context.getClientData().localConfirmationCounter = confirmationCounter;
                context.getClientData().localConfirmationNum = confirmationNum;

                let expenses = commonLib.getStateVariable(context, 'expenses') || [];
                expenses.push({
                    localConfirmationCounter: confirmationCounter,
                    localConfirmationNum: confirmationNum,
                    actualWork: GetAmountValue(context),
                });
                commonLib.setStateVariable(context, 'expenses', expenses);

                return context.executeAction('/SAPAssetManager/Actions/Expense/ExpenseCreate.action').catch((error)=>{
                    Logger.error('CONFIRMATION', `Confirmation.createExpense error: ${error}`);
                });
            });
        }).catch((error)=>{
            Logger.error('CONFIRMATION', `Confirmation.createExpense error: ${error}`);
        });
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Expense/ExpenseUpdate.action')
            .catch((error)=>{
                Logger.error('CONFIRMATION', `Confirmation.updateExpense error: ${error}`);
            });
    }
}
