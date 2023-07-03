import RemoveCreatedExpenses from './RemoveCreatedExpenses';
import commonLib from '../../Common/Library/CommonLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function ExpensesDiscardAll(context) {
    return context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action', 
        'Properties': { 
            'Title': context.localizeText('confirm'),
            'Message': context.localizeText('are_you_sure'),
            'OKCaption': context.localizeText('confirm'),
            'CancelCaption': context.localizeText('cancel'),
        }}).then(successResult => {
            let selection = JSON.parse(successResult.data);
            if (selection === true) {
                return RemoveCreatedExpenses(context).then(() => {
                    if (IsCompleteAction(context)) {
                        commonLib.setStateVariable(context, 'expenses', []);
                    }
                });
            }

            return Promise.resolve();
        });
}
