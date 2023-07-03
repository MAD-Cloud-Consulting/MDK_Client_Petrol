import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import NotificationMobileStatusesFromTable from './NotificationMobileStatusesFromTable';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function NotificationMobileStatusToolBarCaption(context, notificationMobileStatus = libMobile.getMobileStatus(context.binding, context)) {

    let started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    let completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

    if (notificationMobileStatus === started) {
        return Promise.resolve(context.localizeText('complete_notification'));
    } else if (notificationMobileStatus === completed) {
        return Promise.resolve(context.localizeText(notificationMobileStatus));
    } else {
        return NotificationMobileStatusesFromTable(context).then((result) => {
            if (ValidationLibrary.evalIsEmpty(result)) { // if data is corrupted, or the status is not the one we support from client
                if (notificationMobileStatus) {
                    return context.localizeText(notificationMobileStatus);
                } else if (context.binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav) {
                    return context.binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav.OverallStatusLabel;
                } else {
                    return '';
                }
            } else if (result.length > 1 || result.length === 0) { // If there are more than one statuses to show or if the status doesnt exist in sequence table then just show the current status on the toolbar
                return context.localizeText(notificationMobileStatus);
            } else {
                // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
                if (result[0].TransitionTextKey) {
                    return context.localizeText(result[0].TransitionTextKey);
                } else {
                    return result[0].OverallStatusLabel;
                }
            }
        });
    }
}
