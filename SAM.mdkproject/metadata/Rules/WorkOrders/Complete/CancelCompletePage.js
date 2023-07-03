import libCom from '../../Common/Library/CommonLibrary';
import RemoveCreatedExpenses from '../../Expense/List/RemoveCreatedExpenses';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import Logger from '../../Log/Logger';
import RedrawCompletePage from './RedrawCompletePage';

export default function CancelCompletePage(context) {
    try {
        var resetActions = [];
        resetActions.push(RemoveCreatedExpenses(context));

        if (WorkOrderCompletionLibrary.getStepValue(context, 'mileage')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context,
                WorkOrderCompletionLibrary.getStepDataLink(context, 'mileage')));
        
            WorkOrderCompletionLibrary.updateStepState(context, 'mileage', {
                value: '',
                data: '',
                link: '',
            });
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'lam')) {
            WorkOrderCompletionLibrary.updateStepState(context, 'lam', {
                value: '',
                data: '',
                lam: '',
            });

            resetActions.push(WorkOrderCompletionLibrary.resetStep(context, 
                WorkOrderCompletionLibrary.getStepDataLink(context, 'lam')));
        }
    
        if (WorkOrderCompletionLibrary.getStepValue(context, 'notification')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context, 
                WorkOrderCompletionLibrary.getStepDataLink(context, 'notification')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'time')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context, 
                WorkOrderCompletionLibrary.getStepDataLink(context, 'time')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'note')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context, 
                WorkOrderCompletionLibrary.getStepDataLink(context, 'note')));
        
            WorkOrderCompletionLibrary.updateStepState(context, 'note', {
                value: '',
                data: '',
                link: '',
            });
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'digit_signature')) {
            resetActions.push(context.executeAction({'Name': 
                '/SAPAssetManager/Actions/OData/DigitalSignature/DeleteDraftSignatureFromUserPrefs.action',
                'Properties': {
                    'Target': {
                        'ReadLink': WorkOrderCompletionLibrary.getStepDataLink(context, 'digit_signature'),
                    },
                },
            }));
            WorkOrderCompletionLibrary.updateStepState(context, 'digit_signature', {
                value: '',
                link: '',
            });
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'signature')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context, 
                WorkOrderCompletionLibrary.getStepDataLink(context, 'signature')));
        
            WorkOrderCompletionLibrary.updateStepState(context, 'signature', {
                value: '',
                link: '',
            });
        }

        return Promise.all(resetActions).then(() => {
            libCom.setStateVariable(context, 'expenses', []);
            libCom.removeBindingObject(context);
            libCom.removeStateVariable(context, 'contextMenuSwipePage');
            WorkOrderCompletionLibrary.resetValidationMessages(context);
            RedrawCompletePage(context);
            WorkOrderCompletionLibrary.clearSteps(context);
            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(context, false);
            WorkOrderCompletionLibrary.getInstance().deleteBinding(context);
            return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
        });
    } catch (failure) {
        Logger.error('Reset confirmation failed', failure);
    }
}
