import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import NotificationMobileStatusLibrary from './NotificationMobileStatusLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';

export default function NotificationChangeStatus(context) {
    let binding = context.binding;

    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const onSuccessAction = '/SAPAssetManager/Rules/Notifications/MobileStatus/NotificationMobileStatusUpdateOnSuccess.js';

    if (IsPhaseModelEnabled(context) && MobileStatusLibrary.getMobileStatus(binding, context) === STARTED) {
        return NotificationMobileStatusLibrary.showNotificationCompleteWarningMessage(context).then(proceed => {
            if (proceed) {
                return NotificationMobileStatusLibrary.completeNotification(context);
            } else {
                return '';
            }
        });
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/NotifMobileStatus_Nav`, [], '$expand=OverallStatusCfg_Nav').then(rollback => {
        //Save mobile status in the page's client data using key 'PhaseModelRollbackStatus'
        CommonLibrary.setStateVariable(context, 'PhaseModelRollbackStatus', rollback.getItem(0));
        let queryOptions = IsPhaseModelEnabled(context) ? '$expand=NextOverallStatusCfg_Nav' : `$filter=UserPersona eq '${PersonaLibrary.getActivePersona(context)}'&$expand=NextOverallStatusCfg_Nav`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/NotifMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], queryOptions).then(codes => {
            let popoverItems = [];

            codes.forEach(element => {
                // Go through each available next status and create a PopoverItems array
                let statusElement = element.NextOverallStatusCfg_Nav;
                let transitionText;

                // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
                if (statusElement.TransitionTextKey) {
                    transitionText = context.localizeText(statusElement.TransitionTextKey);
                } else {
                    transitionText = statusElement.OverallStatusLabel;
                }

                // Add items to possible transitions list
                if (statusElement.MobileStatus === COMPLETED) {
                    // Save statusElement since we can't pass it as a parameter to this rule
                    CommonLibrary.setStateVariable(context, 'StatusElement', statusElement);
                    // Prepend warning dialog to complete status change
                    popoverItems.push({
                        'Title': transitionText, 'OnPress': {
                            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                            'Properties': {
                                'Title': context.localizeText('confirm_status_change'),
                                'Message': context.localizeText('notification_complete_warning'),
                                'OKCaption': context.localizeText('ok'),
                                'CancelCaption': context.localizeText('cancel'),
                                'OnOK': '/SAPAssetManager/Rules/Notifications/MobileStatus/NotificationMobileStatusComplete.js',
                            },
                        },
                    });
                } else {
                    // Add all other items to possible transitions as-is
                    popoverItems.push({ 'Title': transitionText, 'OnPress': MobileStatusUpdateOverride(context, statusElement, 'NotifMobileStatus_Nav', onSuccessAction) });
                }
            });

            // Only build and show popover if there are multiple status transitions available
            if (codes.length > 1) {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusTransitionPopover.action',
                    'Properties': {
                        'PopoverItems': popoverItems,
                    },
                }).then(() => {
                    // Unset StatusElement as soon as action chain is complete
                    CommonLibrary.removeStateVariable(context, 'StatusElement');
                });
            } else if (codes.length === 1) {
                // If only one status transition is available, immediately execute that action instead of showing a popover
                return context.executeAction(popoverItems[0].OnPress).then(() => {
                    // Unset StatusElement as soon as action chain is complete
                    CommonLibrary.removeStateVariable(context, 'StatusElement');
                });
            } else {
                return Promise.resolve();
            }
        });
    });
}

