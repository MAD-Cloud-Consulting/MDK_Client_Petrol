import libCom from '../../Common/Library/CommonLibrary';
import RemoveCreatedExpenses from '../../Expense/List/RemoveCreatedExpenses';
import RedrawCompletePage from './RedrawCompletePage';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import Logger from '../../Log/Logger';

export default function ResetCompleteScreenFields(context) {
    try {
        var page = context.getPageProxy();
        page.showActivityIndicator();

        var resetActions = [];

        WorkOrderCompletionLibrary.updateStepState(page, 'expenses', {
            value: '',
            count: 0,
        });
        resetActions.push(RemoveCreatedExpenses(context));

        if (WorkOrderCompletionLibrary.getStepValue(page, 'mileage')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'mileage')));
                
            WorkOrderCompletionLibrary.updateStepState(page, 'mileage', {
                    value: '',
                    data: '',
                    link: '',
                });
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'notification')) {
            WorkOrderCompletionLibrary.updateStepState(page, 'notification', {
                value: '',
                data: WorkOrderCompletionLibrary.getStep(page, 'notification').initialData,
                lam: '',
            });

            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'notification')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'lam')) {
            WorkOrderCompletionLibrary.updateStepState(page, 'lam', {
                value: '',
                data: '',
                lam: '',
            });

            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'lam')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'time')) {
            WorkOrderCompletionLibrary.updateStepState(page, 'time', {
                value: '',
                data: '',
            });

            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'time')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'note')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'note')));

            WorkOrderCompletionLibrary.updateStepState(page, 'note', {
                value: '',
                data: '',
                link: '',
            });
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'digit_signature')) {
            resetActions.push(page.executeAction({'Name': 
                '/SAPAssetManager/Actions/OData/DigitalSignature/DeleteDraftSignatureFromUserPrefs.action',
                'Properties': {
                    'Target': {
                        'ReadLink': WorkOrderCompletionLibrary.getStepDataLink(page, 'digit_signature'),
                    },
                },
            }));
            
            WorkOrderCompletionLibrary.updateStepState(page, 'digit_signature', {
                value: '',
                link: '',
            });    
        }

        if (WorkOrderCompletionLibrary.getStepValue(page, 'signature')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(page, 
                WorkOrderCompletionLibrary.getStepDataLink(page, 'signature')));

            WorkOrderCompletionLibrary.updateStepState(page, 'signature', {
                value: '',
                link: '',
            });
        }

        return Promise.all(resetActions)
            .then(() => {
                libCom.setStateVariable(page, 'expenses', []);

                RedrawCompletePage(page);
                page.dismissActivityIndicator();
            });
    } catch (failure) {
        Logger.error('Reset confirmation failed', failure);
        page.dismissActivityIndicator();
    }
}
